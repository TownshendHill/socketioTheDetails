// Where the socket.io listeners and (most) emitters live.

import type { Server } from 'socket.io';
import { ROOMS, type ClientToServerEvents, type ServerToClientEvents } from '@perf/contract';

// TODO: these belong in env vars, not source
const NODE_CLIENT_TOKEN = '239rfaiskdfvq243EGa4q3wefsdad';
const REACT_CLIENT_TOKEN = '23jrtiheriufyqwidsf';

export const socketMain = (io: Server<ClientToServerEvents, ServerToClientEvents>, pid: number) => {
    io.on('connection', (socket) => {
        // the machine this socket reports for - only set once perfData arrives
        let machineMacA: string | undefined;

        const { token } = socket.handshake.auth;

        if (token === NODE_CLIENT_TOKEN) {
            socket.join(ROOMS.nodeClient);
        } else if (token === REACT_CLIENT_TOKEN) {
            socket.join(ROOMS.reactClient);
        } else {
            socket.disconnect();
            console.log('YOU HAVE BEEN DISCONNECTED!!!');
            return;
        }

        console.log(`Someone connected on worker ${pid}`);
        socket.emit('welcome', 'Welcome to our cluster driven socket.io server!');

        socket.on('perfData', (data) => {
            console.log('Tick...', pid, data.macA);

            if (!machineMacA) {
                machineMacA = data.macA;
                io.to(ROOMS.reactClient).emit('connectedOrNot', { machineMacA, isAlive: true });
            }

            io.to(ROOMS.reactClient).emit('perfData', data);
        });

        socket.on('testConnection', (data) => console.log(data));
        socket.on('welcomeButton', (data) => console.log(data));

        socket.on('disconnect', () => {
            // a nodeClient dropped - tell the dashboards
            if (machineMacA) {
                io.to(ROOMS.reactClient).emit('connectedOrNot', { machineMacA, isAlive: false });
            }
        });
    });
};
