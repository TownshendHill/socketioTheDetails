import express from 'express';
import path from 'node:path';
import { Server, type Socket } from 'socket.io';
import { namespaces } from './data/namespaces.ts';
import type { ClientToServerEvents, ServerToClientEvents } from '../contract/events.ts';

const app = express();
app.use(express.static(path.join(import.meta.dirname, '..', 'public')));

const expressServer = app.listen(9000);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(expressServer);

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
    io.of(ns.endpoint).on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
        console.log(`New client connected to namespace ${ns.endpoint}: ${socket.id}`); 
    });
});