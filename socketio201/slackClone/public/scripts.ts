import { io, type Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '../contract/events.ts';
import { joinNs } from './joinNs.ts';

// const userName = prompt('What is your name?');
// const password = prompt('What is your password?');

// temp: remove prompt for now, just hardcode a user name and password for testing
const userName = 'Rob';
const password = '1234';

// always join the main namespace, because that is the source for other namespaces.
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:9000');
// const socket2: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:9000/wiki');
// const socket3: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:9000/mozilla');
// const socket4: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:9000/linux');

// sockets will be put into this array, in the index of their ns.id
const nameSpaceSocket = [] as Socket<ServerToClientEvents, ClientToServerEvents>[];
const listeners = {
    // sparse array indexed by ns.id: true once a handler is attached for that socket
    nsChange: [] as boolean[],
};

const addListeners = (nsId: number) => {
    if (!listeners.nsChange[nsId]) {
        nameSpaceSocket[nsId].on('nsChange', (updatedNs) => {
            console.log('Client on nsChange', updatedNs);
        });
        listeners.nsChange[nsId] = true;
    }
};

socket.on('connect', () => {
    console.log('Client on connect');
    console.log('Client emit clientConnect');
    socket.emit('clientConnect', { text: 'Hello from the client!!' });
});

// listen for the nsList event from the server which gives us the namespaces
socket.on('nsList', (nsData) => {
    const lastNs = localStorage.getItem('lastNs');
    console.log('Client on nsList: ', nsData);
    const nsDiv = document.querySelector('.namespaces') as HTMLDivElement;

    nsDiv.innerHTML = ''; // Clear existing namespaces, on initial connect and on retries
    nsData.forEach((ns) => {
        // update the HTML with each ns
        nsDiv.innerHTML += `<div class="namespace" data-ns="${ns.endpoint}">
            <img src="${ns.image}" />
        </div>`;

        // initialize thisNs as its index in nameSpaceSockets
        // if the connection is new, this will be null
        // if the connection has already been established, it will reconnect and remain in its spot

        // join this namespace with io() if not already connected
        if (!nameSpaceSocket[ns.id]) {
            // there is no socket at this nsId, so make a new connection!
            nameSpaceSocket[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
        }
        addListeners(ns.id);
    });

    Array.from(document.getElementsByClassName('namespace')).forEach((element) => {
        console.log(element);

        element.addEventListener('click', () => {
            joinNs(element, nsData);
        });
    });

    // Restore the last namespace if it still exists, otherwise fall back to the first.
    // Covers both a stale lastNs and an empty namespace list.
    const target =
        [...nsDiv.children].find((el) => el.getAttribute('data-ns') === lastNs) ??
        nsDiv.firstElementChild;

    if (target) joinNs(target, nsData);
});
