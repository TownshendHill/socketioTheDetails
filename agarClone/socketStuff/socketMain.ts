//Where all our socket stuff will go
//oh... we need express, get app, but only put what we need to inside of our socket stuff
import { app, io } from '../servers.ts';
import Orb from './classes/Orb.ts';

// make an orb array that will host all 500/5000 NOT PLAYER orbs
// every time an orb is absorbed, the server will create a new one
const orbs: Orb[] = [];

// on server start, to make our initial 500
initGame();

io.on('connection', (socket) => {
    // event that runs on join that does init game stuff
    console.log('OnConnect');
    socket.emit('init', { orbs });
});

function initGame() {
    for (let i = 0; i < 500; i++) {
        orbs.push(new Orb());
    }
}
