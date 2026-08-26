import express from 'express';
import path from 'node:path';
import { Server, type Socket } from 'socket.io';
import { namespaces } from './data/namespaces.ts';
import type { ClientToServerEvents, ServerToClientEvents } from '../contract/events.ts';
import { Room } from './classes/Room.ts';

const app = express();
app.use(express.static(path.join(import.meta.dirname, '..', 'public')));

const expressServer = app.listen(9000);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(expressServer);

// manufactured way to change a ns without building a huge ui
app.get('/change-ns', (req, res) => {
    // update the ns array
    namespaces[0].addRoom(new Room(0, 'Deleted Articles', 0));

    // let everyone know in THIS namespace, that it changed
    io.of(namespaces[0].endpoint).emit('nsChange', namespaces[0]);
    res.json(namespaces[0]);
});

// Server side: we LISTEN to client events, we EMIT server events.
io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log('New client connected: ' + socket.id);

    socket.emit('welcome', { text: 'Welcome to the server!' });

    socket.on('clientConnect', (dataFromClient) => {
        console.log('Server on ClientConnect: ', dataFromClient);
        console.log('Server emit nsList');
        socket.emit('nsList', namespaces);
    });
});

namespaces.forEach((ns) => {
    io.of(ns.endpoint).on(
        'connection',
        (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
            socket.on('joinRoom', ({ roomTitle }) => {
                // need to fetch the history
                console.log('Server on joinRoom: ', roomTitle);

                // join the room
                socket.join(roomTitle);
            });
        },
    );
});
