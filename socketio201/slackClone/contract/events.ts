/* The event contract: which event names exist, and what each one carries.
   Both sides import this, so a typo in an event name is a compile error
   on BOTH ends instead of a silently dropped message at runtime. */

import type { MessageData, NamespaceData } from './dto.ts';

export interface ClientToServerEvents {
    clientConnect: (dataFromClient: { text: string }) => void;
    newMessageToRoom: (data: MessageData) => void;
    /* An ack is declared as the LAST parameter of the handler signature.
       Client: emit('joinRoom', data, (ack) => ...)
       Server: socket.on('joinRoom', (data, ack) => ack(...)) */
    joinRoom: (data: { roomTitle: string }, ack: (response: { numUsers: number }) => void) => void;
}

export interface ServerToClientEvents {
    welcome: (newMessage: { text: string }) => void;
    nsList: (namespaces: NamespaceData[]) => void;
    nsChange: (namespace: NamespaceData) => void;
    newMessageToRoom: (newMessage: MessageData) => void;
}
