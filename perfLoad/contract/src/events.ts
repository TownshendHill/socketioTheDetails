import type { ConnectedOrNot, PerfData } from './dto.ts';

/* The event contract. Each entry is the signature of that event's HANDLER;
   Socket.IO derives the emit signature from its parameters. */

export interface ClientToServerEvents {
    /** nodeClient -> server, once per second */
    perfData: (data: PerfData) => void;
    testConnection: (data: unknown) => void;
    welcomeButton: (data: unknown) => void;
}

export interface ServerToClientEvents {
    welcome: (message: string) => void;
    /** server -> reactClient, forwarded from a nodeClient */
    perfData: (data: PerfData) => void;
    /** server -> reactClient, when a monitored machine joins or drops */
    connectedOrNot: (data: ConnectedOrNot) => void;
}

/** Rooms the server sorts connections into, based on the handshake token. */
export const ROOMS = {
    nodeClient: 'nodeClient',
    reactClient: 'reactClient',
} as const;
