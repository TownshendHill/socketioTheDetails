// Where the socket.io listeners and (most) emitters live.

import type { Server } from 'socket.io';
import { ROOMS, type ClientToServerEvents, type ServerToClientEvents } from '@perf/contract';

// TODO: these belong in env vars, not source
const NODE_CLIENT_TOKEN = '239rfaiskdfvq243EGa4q3wefsdad';
const REACT_CLIENT_TOKEN = '23jrtiheriufyqwidsf';

export const socketMain = (io: Server<ClientToServerEvents, ServerToClientEvents>, pid: number) => {
    io.on('connection', (socket) => {
        console.log(`SocketMain - Client connected: ${socket.id}`);
    });
};
