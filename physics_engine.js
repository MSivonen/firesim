let balls = [], //array for particles
    ctx,
    qt,
    range,
    pixels = [],


    //paste settings here:
    wind = 0,
    maxTemp = 8.6,
    minTemp = 0.1,
    tempDecay = 0.022,//how fast temperature drops over time
    tempConductionSpeed = 8.7,//temp conduction between particles
    tempGravityMult = 0.4,//how much temp affects weight of particles (not mass)
    blurAmount = 10.6,
    heatWidth = 0.29,
    heatAmount = 0.108,
    sparkTemp = 2.95,//particles near this temperature will be brighter
    blurOn = "Blur off";

let calc = new Vec(0, 0);

const cos = Math.cos,
    sin = Math.sin,
    gravity = 0.08,
    amountOfBalls = 1000,
    friction = 0.98,
    w = 350, //canvas size
    h = 600,
    r = 5, //particle size
    gridSizeX = Math.floor(w / (r * 2.1)) + 1, //don't interact with particles further than this
    gridSizeY = Math.floor(h / (r * 2.1)) + 1,
    debug = true; //enable sliders and etc stuff


function setup() {
    frameRate(600);
    rectMode(CENTER);
    //createCanvas(w, h, WEBGL);
    createCanvas(w, h);
    ctx = document.getElementById("defaultCanvas0").getContext("2d");
    img = ctx.createImageData(w, h);
    makeBalls(amountOfBalls);
    //makePixels(w, h);
    if (debug) {
        makeSliders();
        // testBall1 = new Ball(100, 150, 1, [125, 125, 125], 20, 0, 0);
        //  testBall2 = new Ball(100, 200, 1, [125, 125, 125], 20, 0, 0);
        // testBall1.temp = 255;
        //  testBall2.temp = 0;
    }
}

function draw() {
    drawingContext.shadowBlur = 0;
    background('rgba(0,0,0,0.15)');
    //translate(-width/2,-height/2,0);
    //fillGrid();


    qt = new QuadTree(new Rectangle(w / 2, h / 2, w / 2, h / 2), 40);
    balls.forEach(ball => {
        qt.insert(ball);
    });



    balls.forEach(ball => {
        range = new Rectangle(ball.pos.x, ball.pos.y, ball.r * 2, ball.r * 2);
        let queryBalls = qt.query(range);
        queryBalls.forEach(other => {
            if (ball != other) ball.collision(other);
        });
    });
    balls.forEach(ball => {
        ball.temperature();
    });
    balls.forEach(ball => {
        ball.updateVel();
    });

    balls.forEach(ball => {
        ball.draw();
    });

    /*     for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                pixels[y][x].draw(4 * (w * y + x));
            }
        }
        ctx.putImageData(img, 0, 0); */


    fill(255, 0, 0, 100);
    // drawingContext.filter = `blur(${blurAmount}px)`;
    ctx.fillStyle = "rgba(100, 50, 0, 0.8)";
    /*  */rect((width / 2), height + 10, width * (1 - heatWidth), 30, 10);
    if (debug) {
        updateSliders();
        //text(Math.floor(getFrameRate()), 200, 10);
        //  testBalls();
    }

    //qt.show();
}

