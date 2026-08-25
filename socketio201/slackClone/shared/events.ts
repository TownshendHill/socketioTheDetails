/* The contract between client and server.
   Both sides import these, so a typo in an event name is a compile error
   on BOTH ends instead of a silently dropped message at runtime. */

export interface ClientToServerEvents {
    clientConnect: (dataFromClient: { text: string }) => void;
}

export interface ServerToClientEvents {
    welcome: (newMessage: { text: string }) => void;
    nsList: (namespaces: { name: string; image: string }[]) => void;
}
