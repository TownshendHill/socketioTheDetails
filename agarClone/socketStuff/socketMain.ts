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
const players: Player[] = [];
let tickTockInterval: NodeJS.Timeout;

// on server start, to make our initial defaultNumberOfOrbs
initGame();

io.on('connection', (socket) => {
    console.log('OnConnect');

    // a player has connected
    socket.on('init', (playerObj, ack) => {
        if (players.length === 0) {
            // tick-tock - issue an event to every connected socket, that is playing the game, 30 times per second
            tickTockInterval = setInterval(() => {
                io.to('game').emit('tick', players); // send the event to the 'game' room. not the entire namespace
            }, 1000 / 30); // 30 times per second or 1 of 30fps
        }

        socket.join('game'); // put the socket in the 'game' room, so we can send events to all players in the game
        console.log('Player init data received: ', playerObj);

        // make a playerConfig object - the data specific to the player that only the player needs to know
        const playerName = playerObj.playerName;
        const playerConfig = new PlayerConfig(settings);
        const playerData = new PlayerData(playerName, settings);
        const player = new Player(socket.id, playerConfig, playerData);
        players.push(player);

        // make a playerData object - the data specific to the player that all players need to know
        // a master player object to house both
        // event that runs on join that does init game stuff
        ack({
            orbs, // send the orbs array back as an ack function
        });
    });

    socket.on('disconnect', () => {
        console.log('onDisconnect');

        if (players.length === 0) clearInterval(tickTockInterval); // stop the tick-tock if there are no players left
    });
});

function initGame() {
    for (let i = 0; i < settings.defaultNumberOfOrbs; i++) {
        orbs.push(new Orb(settings));
    }
}
