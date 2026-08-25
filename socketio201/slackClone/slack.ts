import express from 'express';
import path from 'node:path';
import { Server, type Socket } from 'socket.io';
import { namespaces } from './data/namespaces.ts';
import type { ClientToServerEvents, ServerToClientEvents } from './shared/events.ts';

const app = express();
app.use(express.static(path.join(import.meta.dirname, 'public')));

const expressServer = app.listen(9000);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(expressServer);

// Server side: we LISTEN to client events, we EMIT server events.
io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log('New client connected: ' + socket.id);

    socket.emit('welcome', { text: 'Welcome to the server!' });

    socket.on('clientConnect', (dataFromClient) => {
        console.log('Data from client: ', dataFromClient);
    });

    socket.emit('nsList', namespaces);
});
