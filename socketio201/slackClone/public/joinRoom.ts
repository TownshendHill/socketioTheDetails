import { nameSpaceSockets } from './scripts.ts';

export const joinRoom = (roomTitle: string, namespaceId: number) => {
    console.log('Joining room: ', roomTitle, namespaceId);

    nameSpaceSockets[namespaceId].emit('joinRoom', { roomTitle }, (ackResponse) => {
        console.log('Server ack response: ', ackResponse);

        document.querySelector('.curr-room-num-users')!.innerHTML =
            `${ackResponse.numUsers} <span class="fa-solid fa-user"></span>`;
        document.querySelector('.curr-room-text')!.innerHTML = roomTitle;
    });
};
