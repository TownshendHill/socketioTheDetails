// This is where all the data is that no other player needs to know about

class PlayerConfig{
    xVector: number;
    yVector: number;
    speed: number;
    zoom: number;

    constructor(settings){
        this.xVector = 0;
        this.yVector = 0;
        this.speed = settings.defaultSpeed;
        this.zoom = settings.defaultZoom;
    }
}

export default PlayerConfig;
