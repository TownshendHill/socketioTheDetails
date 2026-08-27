import { io, type Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '../contract/events.ts';
import { joinNs } from './joinNs.ts';
import { buildMessageHtml } from './buildMessageHtml.ts';

// const userName = prompt('What is your name?');
// const password = prompt('What is your password?');

// temp: remove prompt for now, just hardcode a user name and password for testing
const userName = 'Rob';
const password = '1234';

const clientOptions = {
    query: {
        userName,
        password,
    },
    auth: {
        userName,
        password,
    },
};

// always join the main namespace, because that is the source for other namespaces.
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    'http://localhost:9000',
    clientOptions,
);
// const socket2: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:9000/wiki');
// const socket3: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:9000/mozilla');
// const socket4: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:9000/linux');

// sockets will be put into this array, in the index of their ns.id
export const nameSpaceSockets = [] as Socket<ServerToClientEvents, ClientToServerEvents>[];
const listeners = {
    // sparse array indexed by ns.id: true once a handler is attached for that socket
    nsChange: [] as boolean[],
    messageToRoom: [] as boolean[],
};

// a global variable we can update when the user clicks a new namespace
// we will use it to broadcast across the app (redux would be great here)
export let selectedNsId = 0;

// imported bindings are read-only, so other modules cannot assign to selectedNsId
// directly. They call this instead; reads of selectedNsId still see the new value.
export const setSelectedNsId = (id: number) => {
    selectedNsId = id;
};

// add a submit hanlder for our form, keep the browser from submitting
document.querySelector('#message-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    // grab the value from the input box
    const newMessage = (document.querySelector('#user-message') as HTMLInputElement).value;
    console.log('Client emit newMessageToServer: ', newMessage, selectedNsId);

    nameSpaceSockets[selectedNsId].emit('newMessageToRoom', {
        text: newMessage,
        userName,
        avatar: 'https://via.placeholder.com/30',
        date: Date.now(),
        namespaceId: selectedNsId,
    });

    (document.querySelector('#user-message') as HTMLInputElement).value = '';
});

// addListeners job is to manage all listenes added to all namespaces
// the prevents listeneres being added multiple times when the user clicks the same namespace multiple times and makes life better to us devs
const addListeners = (nsId: number) => {
    if (!listeners.nsChange[nsId]) {
        nameSpaceSockets[nsId].on('nsChange', (updatedNs) => {
            console.log('Client on nsChange', updatedNs);
        });
        listeners.nsChange[nsId] = true;
    }

    if (!listeners.messageToRoom[nsId]) {
        nameSpaceSockets[nsId].on('newMessageToRoom', (newMessage) => {
            console.log('Client on newMessageToRoom: ', newMessage);
            document.querySelector('#messages')!.innerHTML += buildMessageHtml(newMessage);
        });
        listeners.messageToRoom[nsId] = true;
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
        if (!nameSpaceSockets[ns.id]) {
            // there is no socket at this nsId, so make a new connection!
            nameSpaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
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
