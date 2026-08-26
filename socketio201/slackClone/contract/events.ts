/* The event contract: which event names exist, and what each one carries.
   Both sides import this, so a typo in an event name is a compile error
   on BOTH ends instead of a silently dropped message at runtime. */

import type { NamespaceData } from './dto.ts';

export interface ClientToServerEvents {
    clientConnect: (dataFromClient: { text: string }) => void;
}

export interface ServerToClientEvents {
    welcome: (newMessage: { text: string }) => void;
    nsList: (namespaces: NamespaceData[]) => void;
    nsChange: (namespace: NamespaceData) => void;
}
