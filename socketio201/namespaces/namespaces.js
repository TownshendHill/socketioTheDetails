const express = require('express');
const app = express();
// require('socket.io') = Server in the docs
const socketio = require('socket.io')

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(8001);
// io = the server object in the docs!
const io = socketio(expressServer)

io.on('connection', (socket) => {
    console.log('New client connected: ' + socket.id);

    socket.on('newMessageToServer', (dataFromClient) => {
        console.log('Data from client: ', dataFromClient);
    });
});