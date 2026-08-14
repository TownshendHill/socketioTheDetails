import express from 'express';
import path from 'node:path';
// the Server class is what require('socket.io') used to give us
import { Server } from 'socket.io';

const app = express();

app.use(express.static(path.join(import.meta.dirname, 'public')));

const expressServer = app.listen(8001);
// io = the server object in the docs!
const io = new Server(expressServer);

// io = server in the docs
io.on('connection',(socket)=>{
    console.log(socket.id,"has connected")
    //in ws we use "send" method, and it socket.io we use the "emit" method
    // socket.emit('messageFromServer',{data:"Welcome to the socket server!"})
    socket.on('newMessageToServer',(dataFromClient)=>{
        console.log("Data:",dataFromClient);
        io.emit('newMessageToClients',{text:dataFromClient.text});
    })
})
