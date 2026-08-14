import express from 'express';
import path from 'node:path';
// the Server class is what require('socket.io') used to give us
import { Server, type Socket } from 'socket.io';

/* Socket.IO is generic over your event maps. Declaring them means every
   emit/on below is checked: wrong event name or wrong payload = a red
   squiggle, not a bug you find at runtime. */
interface ClientToServerEvents {
    newMessageToServer: (dataFromClient: { text: string }) => void;
}

interface ServerToClientEvents {
    newMessageToClients: (newMessage: { text: string }) => void;
}

const app = express();

app.use(express.static(path.join(import.meta.dirname, 'public')));

const expressServer = app.listen(8001);
// io = the server object in the docs!
const io = new Server<ClientToServerEvents, ServerToClientEvents>(expressServer);

io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log('New client connected: ' + socket.id);

    socket.on('newMessageToServer', (dataFromClient) => {
        // dataFromClient is inferred as { text: string } - no annotation needed
        console.log('Data from client: ', dataFromClient);
    });
});
