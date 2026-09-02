// Connect to the socket server
const socket = io.connect('http://localhost:9000');

const init = async () => {
    // init is called inside of start-game click event listener in uiStuff.ts
    const initOrbs = await socket.emitWithAck('init', {
        playerName: player.name,
    });

    console.log('orbs: ', initOrbs);
    orbs = initOrbs.orbs;
    draw();
};
