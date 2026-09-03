// Connect to the socket server
const socket = io.connect('http://localhost:9000');

const init = async () => {
    // init is called inside of start-game click event listener in uiStuff.ts
    const initData = await socket.emitWithAck('init', {
        playerName: player.name,
    });

    // our await has resolved, so start "tocking"
    setInterval(() => {
        socket.emit('tock', {
            xVector: player.xVector ? player.xVector : 0.1,
            yVector: player.yVector ? player.yVector : 0.1,
        });
    }, 1000 / 30); // 60 times per second

    // console.log('orbs: ', initData);
    orbs = initData.orbs;
    player.indexInPlayers = initData.indexInPlayers;
    draw();
};

// the server sends out the location/data of all player 30 times per second
socket.on('tick', (playersArray) => {
    // console.log('onTick: ', playersArray);
    players = playersArray;
    player.locX = players[player.indexInPlayers!].playerData.locX;
    player.locY = players[player.indexInPlayers!].playerData.locY;
});

socket.on('orbSwitch', (orbData) => {
    // the server just told us that an orb was observed, replace it in the orbs array
    console.log('onOrbSwitch: ', orbData);
    orbs.splice(orbData.capturedOrbI, 1, orbData.newOrb);
});

socket.on('playerAbsorbed', (absorbData) => {
    console.log('onPlayerAbsorbed: ', absorbData);
});
