//Where all our socket stuff will go
//oh... we need express, get app, but only put what we need to inside of our socket stuff
import { app, io } from '../servers.ts';
import Orb from './classes/Orb.ts';
import Player from './classes/Player.ts';
import PlayerConfig from './classes/PlayerConfig.ts';
import PlayerData from './classes/PlayerData.ts';

// make an orb array that will host all 500/5000 NOT PLAYER orbs
// every time an orb is absorbed, the server will create a new one
const orbs: Orb[] = [];
const settings = {
    defaultNumberOfOrbs: 500, // number of orbs on the map
    defaultSpeed: 6,
    defaultSize: 6,
    defaultZoom: 1.5,
    worldWidth: 500,
    worldHeight: 500,
    defaultGenericOrbSize: 5, // smaller than player orbs
};

// on server start, to make our initial defaultNumberOfOrbs
initGame();

io.on('connection', (socket) => {
    // a player has connected
    // make a playerConfig object - the data specific to the player that only the player needs to know
    const playerName = 'Rob';
    const playerConfig = new PlayerConfig(settings);
    const playerData = new PlayerData(playerName, settings);
    const player = new Player(socket.id, playerConfig, playerData);
    // make a playerData object - the data specific to the player that all players need to know
    // a master player object to house both
    // event that runs on join that does init game stuff
    console.log('OnConnect');
    socket.emit('init', {
        orbs,
    });
});

function initGame() {
    for (let i = 0; i < settings.defaultNumberOfOrbs; i++) {
        orbs.push(new Orb(settings));
    }
}
