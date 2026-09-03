import { io, type Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '@perf/contract';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3000',
    { auth: { token: '23jrtiheriufyqwidsf' } },
);

socket.on('welcome', (message) => console.log(message));
