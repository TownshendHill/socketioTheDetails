import { nameSpaceSockets } from './scripts.ts';

export const joinRoom = (roomTitle: string, namespaceId: number) => {
    console.log('Joining room: ', roomTitle, namespaceId);

    nameSpaceSockets[namespaceId].emit('joinRoom', { roomTitle });
};
