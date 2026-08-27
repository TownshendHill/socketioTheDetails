import { nameSpaceSockets } from './scripts.ts';

export const joinRoom = async (roomTitle: string, namespaceId: number) => {
    console.log('Joining room: ', roomTitle, namespaceId);

    const ackResp = await nameSpaceSockets[namespaceId].emitWithAck('joinRoom', { roomTitle });

    document.querySelector('.curr-room-num-users')!.innerHTML =
        `${ackResp.numUsers} <span class="fa-solid fa-user"></span>`;
    document.querySelector('.curr-room-text')!.innerHTML = roomTitle;
    // nameSpaceSockets[namespaceId].emit('joinRoom', { roomTitle }, (ackResponse) => {
    //     console.log('Server ack response: ', ackResponse);

    //     document.querySelector('.curr-room-num-users')!.innerHTML =
    //         `${ackResponse.numUsers} <span class="fa-solid fa-user"></span>`;
    //     document.querySelector('.curr-room-text')!.innerHTML = roomTitle;
    // });
};
