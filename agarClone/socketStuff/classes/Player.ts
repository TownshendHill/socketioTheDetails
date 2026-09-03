// this is where ALL the data is stored about a given player

// `import type` because these are only used as types here - erased at build,
// so this file has no runtime dependency on either of them.
import type PlayerConfig from './PlayerConfig.ts';
import type PlayerData from './PlayerData.ts';

class Player {
    socketId: string;
    playerConfig: PlayerConfig;
    playerData: PlayerData;
    /** set false by checkForPlayerCollisions when this player is absorbed */
    alive = true;

    constructor(socketId: string, playerConfig: PlayerConfig, playerData: PlayerData) {
        this.socketId = socketId;
        this.playerConfig = playerConfig;
        this.playerData = playerData;
    }
}

export default Player;
