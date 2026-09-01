const init = () => {
    draw();
};

let randomX = Math.floor(500 * Math.random() + 10); // horizontal axis
let randomY = Math.floor(500 * Math.random() + 10); // vertical axis

context.beginPath();
context.fillStyle = 'rgb(255, 0, 0)';

// arg1 and arg 2 are center x and y of the arc,
// arg3 is the radius,
// arg4 = where to start drawing in radians (0 = 3 o'clock position)
// arg5 = where to stop drawing in radians (usually Math.PI * 2 for a full circle)
context.arc(randomX, randomY, 10, 0, Math.PI * 2);
context.fill();
context.lineWidth = 3;
context.strokeStyle = 'rgb(0, 255, 0)';
context.stroke();

console.log(randomX);

// draw
const draw = () => {};
