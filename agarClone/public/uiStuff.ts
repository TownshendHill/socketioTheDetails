
// Globals provided by <script> tags in index.html, not by our own code.
declare const io: any;
declare const bootstrap: any;

// Shape of the local player. Loose for now - the course fills it in.
interface PlayerState {
    name?: string;
    locX?: number;
    locY?: number;
    xVector?: number;
    yVector?: number;
    indexInPlayers?: number;
}

//set height and width of canvas = window
let wHeight = window.innerHeight;
let wWidth = window.innerWidth;
//canvas element needs to be in a variable
const canvas = document.querySelector('#the-canvas') as HTMLCanvasElement;
//context is how we draw! We will be drawing in 2d
const context = canvas.getContext('2d')!;
//set the canvas height and width to = window height and width
canvas.height = wHeight;
canvas.width = wWidth;
const player: PlayerState = {} //This will be all things "this" player
let orbs: any[] = []; //this is a global for all non-player orbs
let players: any[] = []; //this is an array of all players

//put the modals into variables so we can interact with them
const loginModal = new bootstrap.Modal(document.querySelector('#loginModal'));
const spawnModal = new bootstrap.Modal(document.querySelector('#spawnModal'));


window.addEventListener('load',()=>{
    //on page load, open the login modal
    loginModal.show();
})

document.querySelector('.name-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    // console.log("SUbmitted!")
    player.name = (document.querySelector('#name-input') as HTMLInputElement).value;
    document.querySelector('.player-name')!.innerHTML = player.name!
    loginModal.hide();
    spawnModal.show();
    console.log(player);
})

document.querySelector('.start-game').addEventListener('click',(e)=>{
    //hide the start modal
    spawnModal.hide();
    //show the hiddenOnStart elements
    const elArray = Array.from(document.querySelectorAll('.hiddenOnStart'))
    elArray.forEach(el=>el.removeAttribute('hidden'))
    init(); //init is iniside of socketStuff.js
})