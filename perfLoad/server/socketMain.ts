// Where the socket.io listeners and (most) emitters live.

import type { Server } from 'socket.io';
import { ROOMS, type ClientToServerEvents, type ServerToClientEvents } from '@perf/contract';

// TODO: these belong in env vars, not source
const NODE_CLIENT_TOKEN = '239rfaiskdfvq243EGa4q3wefsdad';
const REACT_CLIENT_TOKEN = '23jrtiheriufyqwidsf';

export const socketMain = (io: Server<ClientToServerEvents, ServerToClientEvents>, pid: number) => {
    io.on('connection', (socket) => {
        console.log(`SocketMain - onConnect: ${socket.id}`);
        const auth = socket.handshake.auth;
        const token = auth.token;
        // console.log(`SocketMain - onConnect token: ${token}`);

        if (token === NODE_CLIENT_TOKEN) {
            socket.join(ROOMS.nodeClient);
        }
        if (token === REACT_CLIENT_TOKEN) {
            socket.join(ROOMS.reactClient);
        }

        if (token !== NODE_CLIENT_TOKEN && token !== REACT_CLIENT_TOKEN) {
            console.log(`Unauthorized client attempted to connect: ${socket.id}`);
            socket.disconnect();
            return;
        }

        socket.on('perfData', (data) => {
            io.to(ROOMS.reactClient).emit('perfData', data);
        });

        socket.on('testConnection', (data) => {
            console.log(`TestConnection received from ${socket.id}:`, data);
        });
    });
};
