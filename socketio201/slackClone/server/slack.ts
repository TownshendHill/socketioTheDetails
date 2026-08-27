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
            socket.on('joinRoom', async ({ roomTitle }, ackCallBack) => {
                console.log('Server on joinRoom: ', roomTitle);

                // leave all rooms, because the client can only be in one room at a time
                const rooms = socket.rooms;
                let i = 0;
                rooms.forEach((room) => {
                    // we don't want to leave the socket's personal room which is guaranteed to be the first one in the set, so we skip it
                    if (i > 0) {
                        socket.leave(room);
                    }
                    i++;
                });

                // join the room
                socket.join(roomTitle);

                // fetch the number of sockets in this room
                const sockets = await io.of(ns.endpoint).in(roomTitle).fetchSockets();
                const socketCount = sockets.length;

                // fetch the history and send it straight back on the ack
                const room = ns.rooms.find((r) => r.roomTitle === roomTitle);
                ackCallBack({ numUsers: socketCount });
            });

            socket.on('newMessageToRoom', (message) => {
                console.log('Server on newMessageToRoom: ', message);

                // broadcast this to all the connect clients... this room only
                // how can we find out what room THIS socket is in?
                // socket.rooms is a Set, and it ALWAYS contains the socket's own id room.
                // The room we want is the other one.
                const currentRoom = [...socket.rooms].find((r) => r !== socket.id);
                if (!currentRoom) return;
                // //send out this message to everyone including the sender
                io.of(ns.endpoint).in(currentRoom).emit('newMessageToRoom', message);
            });
        },
    );
});
