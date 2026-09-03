//Where all our socket stuff will go
//oh... we need express, get app, but only put what we need to inside of our socket stuff
import { app, io } from '../servers.ts';
import Orb from './classes/Orb.ts';
import Player from './classes/Player.ts';
import PlayerConfig from './classes/PlayerConfig.ts';
import PlayerData from './classes/PlayerData.ts';
import { checkForOrbCollisions, checkForPlayerCollisions } from './checkCollisions.ts';

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
// absorbed or disconnected players are replaced with {} rather than removed,
// so the array indexes stay stable (indexInPlayers depends on them)
const players: Partial<Player>[] = [];
// sent to clients: only what everyone needs to know. No playerConfig - that is
// server-side only (speed, zoom, vectors).
const playersForUsers: PlayerDtoOrGone[] = [];
let tickTockInterval: NodeJS.Timeout;

// on server start, to make our initial defaultNumberOfOrbs
initGame();

io.on('connection', (socket) => {
    let player: Player = {} as Player;
    console.log('OnConnect');

    // a player has connected
    socket.on('init', (playerObj, ack) => {
        if (players.length === 0) {
            // tick-tock - issue an event to every connected socket, that is playing the game, 30 times per second
            tickTockInterval = setInterval(() => {
                io.to('game').emit('tick', playersForUsers); // send the event to the 'game' room. not the entire namespace
            }, 1000 / 30); // 30 times per second or 1 of 30fps
        }

        socket.join('game'); // put the socket in the 'game' room, so we can send events to all players in the game
        console.log('Player init data received: ', playerObj);

        // make a playerConfig object - the data specific to the player that only the player needs to know
        const playerName = playerObj.playerName;
        const playerConfig = new PlayerConfig(settings);
        const playerData = new PlayerData(playerName, settings);
        player = new Player(socket.id, playerConfig, playerData);
        players.push(player); // server use only
        playersForUsers.push({ playerData }); // client use only

        // make a playerData object - the data specific to the player that all players need to know
        // a master player object to house both
        // event that runs on join that does init game stuff
        ack({
            orbs, // send the orbs array back as an ack function
            indexInPlayers: playersForUsers.length - 1, // send the index of the player in the playersForUsers array back as an ack function
        });
    });

    socket.on('tock', (data) => {
        // a tock has come in before the player is set up
        // this is because the client kept tocking after disconnect
        if (!player.playerConfig) return;

        const speed = player.playerConfig.speed;
        const xV = (player.playerConfig.xVector = data.xVector);
        const yV = (player.playerConfig.yVector = data.yVector);

        if ((player.playerData.locX > 5 && xV < 0) || (player.playerData.locX < 500 && xV > 0)) {
            player.playerData.locX += speed * xV;
        }

        if ((player.playerData.locY > 5 && yV > 0) || (player.playerData.locY < 500 && yV < 0)) {
            player.playerData.locY -= speed * yV;
        }

        // check for the tocking player to hit orbs
        const capturedOrbI = checkForOrbCollisions(
            player.playerData,
            player.playerConfig,
            orbs,
            settings,
        );

        if (capturedOrbI !== null) {
            // remove the orb from the orbs array and make a new one
            orbs.splice(capturedOrbI, 1, new Orb(settings));

            // now update the clients with the new orb
            const orbData = {
                capturedOrbI,
                newOrb: orbs[capturedOrbI],
            };

            // emit to all sockets playing the game, the orbSwtich event so it can update orbs... just the new orbs
            io.to('game').emit('orbSwitch', orbData);

            // emit to all sockets playing the game, the updateLeaderBoard event so it can update the leaderboard... cause someone just scored
            io.to('game').emit('updateLeaderBoard', getLeaderBoard()); // send the event to the 'game' room. not the entire namespace
        }

        // player collisions - check for the tocking player to hit other players
        const absorbData = checkForPlayerCollisions(
            player.playerData,
            player.playerConfig,
            players,
            playersForUsers,
            socket.id,
        );

        if (absorbData) {
            io.to('game').emit('playerAbsorbed', absorbData); // send the event to the 'game' room. not the entire namespace
            io.to('game').emit('updateLeaderBoard', getLeaderBoard()); // send the event to the 'game' room. not the entire namespace
        }
    });

    socket.on('disconnect', () => {
        console.log('onDisconnect');
        // loop through players and find the player wiht THIS players socketId, and splice that player out
        for (let i = 0; i < players.length; i++) {
            if (players[i].socketId === socket.id) {
                players.splice(i, 1, {});
                playersForUsers.splice(i, 1, {});
                break;
            }
        }

        if (players.length === 0) clearInterval(tickTockInterval); // stop the tick-tock if there are no players left
    });
});

function initGame() {
    for (let i = 0; i < settings.defaultNumberOfOrbs; i++) {
        orbs.push(new Orb(settings));
    }
}

function getLeaderBoard() {
    // absorbed players are {} in the array, so drop them rather than mapping
    // them to an entry with no name or score
    return players
        .filter((curPlayer): curPlayer is Player => curPlayer.playerData !== undefined)
        .map((curPlayer) => ({
            name: curPlayer.playerData.name,
            score: curPlayer.playerData.score,
        }));
}
