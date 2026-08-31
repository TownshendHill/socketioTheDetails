
// Globals provided by <script> tags in index.html, not by our own code.
declare const io: any;
declare const bootstrap: any;

// set heigh and width of canvas = windo
let wHeight = window.innerHeight;
let wWidth = window.innerWidth;

// canvas element needs to be in a variable
const canvas = document.querySelector('#the-canvas') as HTMLCanvasElement;

// context is how we draw, we will be drawing in 2d
const context = canvas.getContext('2d') as CanvasRenderingContext2D;
canvas.width = wWidth;
canvas.height = wHeight;

// shape of the local player - loose for now, the course fills it in
interface PlayerState {
    name?: string;
    locX?: number;
    locY?: number;
    xVector?: number;
    yVector?: number;
    indexInPlayers?: number;
}

// player info
const player: PlayerState = {};

// shared with canvasStuff.ts and socketStuff.ts
let orbs: any[] = [];
let players: any[] = [];

// put the modals in variables so we can interact with them
const loginModal = new bootstrap.Modal(document.querySelector('#loginModal') as HTMLElement); 
const spawnModal = new bootstrap.Modal(document.querySelector('#spawnModal') as HTMLElement);

window.addEventListener('load', () => {
    loginModal.show();
});

document.querySelector('.name-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    player.name = (document.querySelector('#name-input') as HTMLInputElement).value;
    loginModal.hide();
    spawnModal.show();
    console.log(player);
});