class Orb {
    color: string;
    locX: number;
    locY: number;
    radius: number;

    // Defaults so `new Orb()` works before the lesson introduces a shared
    // settings object. Passing one later still works and overrides these.
    constructor(
        settings: { worldWidth: number; worldHeight: number; defaultGenericOrbSize: number } = {
            worldWidth: 5000,
            worldHeight: 5000,
            defaultGenericOrbSize: 5,
        },
    ) {
        this.color = this.getRandomColor();
        this.locX = Math.floor(Math.random() * settings.worldWidth);
        this.locY = Math.floor(Math.random() * settings.worldHeight);
        this.radius = settings.defaultGenericOrbSize; //generic orb size
    }

    getRandomColor() {
        const r = Math.floor(Math.random() * 200 + 50);
        const g = Math.floor(Math.random() * 200 + 50);
        const b = Math.floor(Math.random() * 200 + 50);
        //rbg(112,243,59)
        return `rgb(${r},${g},${b})`;
    }
}

export default Orb;
