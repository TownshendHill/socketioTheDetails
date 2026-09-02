const init = () => {
    console.log('orbs: ', orbs);
    draw();
};

// draw
const draw = () => {
    // reset the context translate back to default
    context.setTransform(1, 0, 0, 1, 0, 0);

    // clear the canvas so we can redraw it, so we can draw on a clean slate each frame.
    context.clearRect(0, 0, canvas.width, canvas.height);

    // clamp the screen / vp to the players location (x, y)
    const camX = -player.locX + canvas.width / 2;
    const camY = -player.locY + canvas.height / 2;

    // translate moves the canvas / context to where the player is at
    context.translate(camX, camY);

    context.beginPath();
    context.fillStyle = 'rgb(255, 0, 0)';

    // arg1 and arg 2 are center x and y of the arc,
    // arg3 is the radius,
    // arg4 = where to start drawing in radians (0 = 3 o'clock position)
    // arg5 = where to stop drawing in radians (usually Math.PI * 2 for a full circle)
    context.arc(player.locX, player.locY, 10, 0, Math.PI * 2);

    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = 'rgb(0, 255, 0)';
    context.stroke();

    orbs.forEach((orb) => {
        context.beginPath(); // this will start a new path
        context.fillStyle = orb.color;
        context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
        context.fill();
    });

    // rAF is like a controlled loop
    // it runs recursively, every paint/frame. If the frame rate is 60fps, it will run 60 times per second.
    requestAnimationFrame(draw);
};

let xVector = 0;
let yVector = 0;
let speed = 0;
let xV = 0;
let yV = 0;

canvas.addEventListener('mousemove', (event) => {
    // direction from the canvas centre to the mouse
    const dx = event.clientX - canvas.width / 2;
    const dy = event.clientY - canvas.height / 2;

    // normalise: same direction, length 1 whichever way you point.
    // yVector is negated because screen Y grows downward, but we want +1 = up.
    const length = Math.hypot(dx, dy) || 1;
    xVector = dx / length;
    yVector = -dy / length;

    speed = 10;
    xV = xVector;
    yV = yVector;

    if ((player.locX < 5 && xV < 0) || (player.locX > 500 && xV > 0)) {
        player.locY -= speed * yV;
    } else if ((player.locY < 5 && yV > 0) || (player.locY > 500 && yV < 0)) {
        player.locX += speed * xV;
    } else {
        player.locX += speed * xV;
        player.locY -= speed * yV;
    }
});
