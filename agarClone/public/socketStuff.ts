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

    // no index yet (init has not returned), or we were absorbed and our slot
    // is now a {} tombstone - either way there is nothing to follow
    if (player.indexInPlayers === undefined) return;
    const me = players[player.indexInPlayers];
    if (!me?.playerData) return;

    player.locX = me.playerData.locX;
    player.locY = me.playerData.locY;
});

socket.on('orbSwitch', (orbData) => {
    // the server just told us that an orb was observed, replace it in the orbs array
    console.log('onOrbSwitch: ', orbData);
    orbs.splice(orbData.capturedOrbI, 1, orbData.newOrb);
});

socket.on('playerAbsorbed', (absorbData) => {
    console.log('onPlayerAbsorbed: ', absorbData);
    const gameMessage = document.querySelector('#game-message') as HTMLElement;
    gameMessage.textContent = `${absorbData.absorbed} was absorbed by ${absorbData.absorbedBy}`;
    gameMessage.style.opacity = '1';
    window.setTimeout(() => {
        gameMessage.style.opacity = '0';
    }, 2000);
});

socket.on('updateLeaderBoard', (leaderBoardArray) => {
    leaderBoardArray.sort((a, b) => b.score - a.score);

    document.querySelector('.leader-board')!.innerHTML = '';

    leaderBoardArray.forEach((player) => {
        const li = document.createElement('li');
        li.className = 'leaderboard-player';
        li.textContent = `${player.name} - ${player.score}`;
        document.querySelector('.leader-board')!.appendChild(li);
    });
});
