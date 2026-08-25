import { io, type Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '../contract/events.ts';

// const userName = prompt('What is your name?');
// const password = prompt('What is your password?');

// temp: remove prompt for now, just hardcode a user name and password for testing
const userName = "Rob";
const password = "1234";


/* Note the generics are FLIPPED compared to the server.
   Socket<ListenEvents, EmitEvents> from each side's point of view:
     server listens to client events, emits server events
     client listens to server events, emits client events */
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:9000');

socket.on('connect', () => {
    console.log('connected 2');
    socket.emit('clientConnect', { text: 'Hello from the client!' });
});

// listen for the nsList event from the server which gives us the namespaces
socket.on('nsList', (nsData) => {
    console.log('Data from server: ', nsData);
    const nsDiv = document.querySelector('.namespaces') as HTMLDivElement;

    nsData.forEach((ns) => {
        nsDiv.innerHTML += `<div class="namespace" data-ns="${ns.endpoint}">
            <img src="${ns.image}" />
        </div>`;
    });
    

    Array.from(document.getElementsByClassName('namespace')).forEach((element) => {
        console.log(element);
        
        element.addEventListener('click', (e) => {
            const nsEndpoint = element.getAttribute('data-ns');
            console.log('Namespace clicked: ', nsEndpoint);

            const clickedNs = nsData.find((ns) => ns.endpoint === nsEndpoint);
            const rooms = clickedNs?.rooms || [];

            let roomsList = document.querySelector('.room-list') as HTMLDivElement;
            roomsList.innerHTML = ''; // Clear existing rooms

            rooms.forEach((room) => {
                roomsList.innerHTML += `<li><span class="glyphicon glyphicon-lock"></span> ${room.roomTitle}</li>`;
            });
        });
    });
});
