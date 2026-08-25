import express from 'express';
import path from 'node:path';
import { Server, type Socket } from 'socket.io';


interface ClientToServerEvents {
    clientConnect: (dataFromClient: { text: string }) => void;
}

interface ServerToClientEvents {
    welcome: (newMessage: { text: string }) => void;
}

const app = express();
app.use(express.static(path.join(import.meta.dirname, 'public')));

const expressServer = app.listen(9000);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(expressServer);

io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log('New client connected: ' + socket.id);

   socket.emit('welcome', { text: 'Welcome to the server!' });
   socket.on('clientConnect', (dataFromClient) => {
       console.log('Data from client: ', dataFromClient);
   });
});
