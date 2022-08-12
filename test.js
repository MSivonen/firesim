let balls = [];

const
    w = 400, //canvas size
    h = 400,
    r = 30; //enable sliders and etc stuff

function setup() {
    frameRate(55555);
    rectMode(CENTER);
    cnv = createCanvas(w, h);
    //  makeBalls(2);
    balls[0] = {
        x: 200,
        y: 200,
        r: r
    }
    balls[1] = {
        x: 50,
        y: 200,
        r: r
    }
    // cnv.mousePressed(() => { balls[1].x = mouseX; balls[1].y = mouseY });

}

function draw() {
    background('rgba(0,80,0,1)');
    stroke(0);
    strokeWeight(1);
    balls[1].x = mouseX; balls[1].y = mouseY;
    for (let i = 0; i < 2; i++) {
        let b = balls[i];
        circle(b.x, b.y, b.r * 2);
        text(i, b.x, b.y);
    };

    check(balls[0], balls[1]);

    text("FPS " + frameRate(), 200, 50);

}

function fastAtan2(y, x) {
    let a = Math.min(Math.abs(x), Math.abs(y)) / Math.max(Math.abs(x), Math.abs(y))
    let s = a * a;
    let r = ((-0.0464964749 * s + 0.15931422) * s - 0.327622764) * s * a + a;
    if (Math.abs(y) > Math.abs(x)) r = 1.57079637 - r;
    if (x < 0) r = 3.14159274 - r;
    if (y < 0) r = -r;
    return r;
}

function check(b0, b1) {
    //  balls[1].x = mouseX;
    //  balls[1].y = mouseY;
    let x = b0.x - b1.x;
    let y = b0.y - b1.y;
    let dist = Math.sqrt(x ** 2 + y ** 2);
    let angle = Math.atan2(y, x);
    let angleFast = fastAtan2(y, x);
    let distX = Math.cos(angle) * r;
    let distY = Math.sin(angle) * r;
    let midPointX = b0.x - Math.cos(angle) * dist / 2;
    let midPointY = b0.y - Math.sin(angle) * dist / 2;
    let midPointXfast = b0.x - Math.cos(angleFast) * dist / 2;
    let midPointYfast = b0.y - Math.sin(angleFast) * dist / 2;
    circle(midPointX, midPointY, 10);
    // if (dist > b0.r * 2) return;
    // b0.x = midPointX + distX;
    // b0.y = midPointY + distY;
    // b1.x = midPointX - distX;
    // b1.y = midPointY - distY;
    let b0new = {
        x: midPointX + distX,
        y: midPointY + distY,
    }
    let b1new = {
        x: midPointX - distX,
        y: midPointY - distY
    }

    text("x" + x, 30, 30);
    text("y" + y, 30, 50);
    text("dist" + dist, 30, 70);
    text("ang" + angle.toFixed(3), 30, 90);
    text("angleFast" + angleFast.toFixed(3), 120, 90);
    text("r" + b0.r, 30, 110);
    stroke(100, 0, 0);
    strokeWeight(2);
    line(b0.x, b0.y, b0new.x, b0new.y);
    text("0", b0new.x, b0new.y);
    stroke(100, 0, 0);
    line(b1.x, b1.y, b1new.x, b1new.y);
    text("1", b1new.x, b1new.y);
}

function makeBalls(amount) {
    amount > 100000 ? amount = 100000 : null;
    balls = [];
    for (let i = 0; i < amount; i++) {
        balls.push(new Ball(
            Math.random() * width,  //pos x
            Math.random() * height, //pos y
            Math.random() * 2 //mass
            , [255, 0, 0] //color
            , r //r
            , 0//(-.5 + Math.random()) * 2 //vel x
            , 0//(-.5 + Math.random()) * 2 //vel y
        ));
    }
}

function inf(num) {
    return (num == Infinity ? true : false);
}

