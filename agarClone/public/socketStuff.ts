// Connect to the socket server
const socket = io.connect('http://localhost:9000');

const init = async () => {
    // init is called inside of start-game click event listener in uiStuff.ts
    const initOrbs = await socket.emitWithAck('init', {
        playerName: player.name,
    });

    // our await has resolved, so start "tocking"
    setInterval(() => {
        socket.emit('tock', { xVector: player.xVector, yVector: player.yVector });
    }, 1000 / 30); // 60 times per second

    console.log('orbs: ', initOrbs);
    orbs = initOrbs.orbs;
    draw();
};

socket.on('tick', (playersArray) => {
    console.log('onTick: ', playersArray);
    players = playersArray;
});
