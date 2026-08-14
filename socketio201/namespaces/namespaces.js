import express from 'express';
import path from 'node:path';
// the Server class is what require('socket.io') used to give us
import { Server } from 'socket.io';

const app = express();

app.use(express.static(path.join(import.meta.dirname, 'public')));

const expressServer = app.listen(8001);
// io = the server object in the docs!
const io = new Server(expressServer);

io.on('connection', (socket) => {
    console.log('New client connected: ' + socket.id);

    socket.on('newMessageToServer', (dataFromClient) => {
        console.log('Data from client: ', dataFromClient);
    });
});
