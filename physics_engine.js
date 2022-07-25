let balls = [], //array for particles
maxTemp = 7,
minTemp = 0.5,
tempDecay = 0.044,//how fast temperature drops over time
tempConductionSpeed = 3.2,//temp conduction between particles
tempGravityMult  = 2.1,//how much temp affects weight of particles (not mass)
blurAmount  = 10.6,
heatWidth  = 0.76,
heatAmount = 0.194,
sparkTemp = 6.15,//particles near this temperature will be brighter
blurOn = "Blur on";

const cos = Math.cos,
    sin = Math.sin,
    gravity = 0.08,
    amountOfBalls = 1000,
    friction = 0.98,
    w = 400, //canvas size
    h = 400,
    r = 2.5, //particle size
    gridSizeX = r * 2, //don't interact with particles further than this
    gridSizeY = r * 2,
    debug = true; //enable sliders and etc stuff



function setup() {
    frameRate(60);
    angleMode(RADIANS);
    rectMode(CENTER);
    createCanvas(w, h);

    if (debug) {
        makeSliders();
        testBall1 = new Ball(100, 150, 1, [125, 125, 125], 20, 0, 0);
        testBall2 = new Ball(100, 200, 1, [125, 125, 125], 20, 0, 0);
        testBall1.temp = 255;
        testBall2.temp = 0;
    }

    for (let i = 0; i < amountOfBalls; i++) {
        balls.push(new Ball(
            Math.random() * width,  //pos x
            Math.random() * height, //pos y
            Math.random() * 2 //mass
            , [255, 0, 0] //color
            , r //r
            , (-.5 + Math.random()) * 2 //vel x
            , (-.5 + Math.random()) * 2 //vel y
        ));
    }
}

async function draw() {
    drawingContext.shadowBlur = 0;
    background('rgba(0,0,0,.05)');

    if (debug) {
        updateSliders();
        text(Math.floor(getFrameRate()), 300, 10);
        testBalls();
    }

    balls.forEach(ball => {
        ball.update();
    });
    balls.forEach(ball => {
        ball.draw();
    });
    fill(255, 0, 0, 100);
    rect((width / 2), height + 8, width * (1 - heatWidth), 30, 15);
}

function makeSliders() {
    let sliderpos = height + 25;

    let maxTempSliderp = createP("Max temp");
    maxTempSliderp.position(250, sliderpos + 9);
    maxTempSlider = createSlider(1, 20, maxTemp, 0.1);
    maxTempSlider.position(20, sliderpos += 25); //notice the += here
    maxTempSlider.style("width", "200px");

    let minTempSliderp = createP("Min temp");
    minTempSliderp.position(250, sliderpos + 9);
    minTempSlider = createSlider(0.1, 3, minTemp, 0.1);
    minTempSlider.position(20, sliderpos += 25);
    minTempSlider.style("width", "200px");

    let tempDecaySliderp = createP("Temperature decay");
    tempDecaySliderp.position(250, sliderpos + 9);
    tempDecaySlider = createSlider(0.01, 0.2, tempDecay, 0.002);
    tempDecaySlider.position(20, sliderpos += 25);
    tempDecaySlider.style("width", "200px");

    let tempConductionSpeedSliderp = createP("Temp conduction speed");
    tempConductionSpeedSliderp.position(250, sliderpos + 9);
    tempConductionSpeedSlider = createSlider(0.1, 15, tempConductionSpeed, 0.1);
    tempConductionSpeedSlider.position(20, sliderpos += 25);
    tempConductionSpeedSlider.style("width", "200px");

    let tempGravityMultSliderp = createP("Temp gravity mult");
    tempGravityMultSliderp.position(250, sliderpos + 9);
    tempGravityMultSlider = createSlider(0.1, 3, tempGravityMult, 0.1);
    tempGravityMultSlider.position(20, sliderpos += 25);
    tempGravityMultSlider.style("width", "200px");

    let sparksSliderp = createP("Spark temp");
    sparksSliderp.position(250, sliderpos + 9);
    sparksSlider = createSlider(minTemp, maxTemp, sparkTemp, 0.05);
    sparksSlider.position(20, sliderpos += 25);
    sparksSlider.style("width", "200px");

    let heatWidthSliderp = createP("Heater width");
    heatWidthSliderp.position(250, sliderpos + 9);
    heatWidthSlider = createSlider(-1, -.05, -heatWidth, 0.01);
    heatWidthSlider.position(20, sliderpos += 25);
    heatWidthSlider.style("width", "200px");

    let heatAmountSliderp = createP("Heater power");
    heatAmountSliderp.position(250, sliderpos + 9);
    heatAmountSlider = createSlider(0.005, 1, heatAmount, 0.001);
    heatAmountSlider.position(20, sliderpos += 25);
    heatAmountSlider.style("width", "200px");

    let blurAmountSliderp = createP("Blur amount");
    blurAmountSliderp.position(250, sliderpos + 9);
    blurAmountSlider = createSlider(0.1, 20, blurAmount, 0.1);
    blurAmountSlider.position(20, sliderpos += 25);
    blurAmountSlider.style("width", "200px");

    blurRadio = createRadio();
    blurRadio.option("Blur on");
    blurRadio.option("Blur off");
    blurRadio.selected(blurOn);
    blurRadio.position(20, sliderpos += 25);

    saveButton = createButton("Output settings to log");
    saveButton.position(20, sliderpos += 25);
    saveButton.mousePressed(saveSettings);
}

function saveSettings() {
    console.log(
        "maxTemp = " + maxTemp + ",\n" +
        "minTemp = " + minTemp + ",\n" +
        "tempDecay = " + tempDecay + ",//how fast temperature drops over time\n" +
        "tempConductionSpeed = " + tempConductionSpeed + ",//temp conduction between particles\n" +
        "tempGravityMult  = " + tempGravityMult + ",//how much temp affects weight of particles (not mass)\n" +
        "blurAmount  = " + blurAmount + ",\n" +
        "heatWidth  = " + heatWidth + ",\n" +
        "heatAmount = " + heatAmount + ",\n" +
        "sparkTemp = " + sparkTemp + ",//particles near this temperature will be brighter\n" +
        "blurOn = \"" + blurOn + "\";");
}

function updateSliders() {
    fill(0);
    rect(0, 0, 150, 80);
    maxTemp = maxTempSlider.value();
    minTemp = minTempSlider.value();
    tempDecay = tempDecaySlider.value();
    tempConductionSpeed = tempConductionSpeedSlider.value();
    tempGravityMult = tempGravityMultSlider.value();
    blurAmount = blurAmountSlider.value();
    sparkTemp = sparksSlider.value();
    heatAmount = heatAmountSlider.value();
    heatWidth = -heatWidthSlider.value();
    blurOn = blurRadio.value();

    stroke(255);
    let tempY = 5;
    text("MaxTemp: " + maxTemp, 10, tempY += 10);
    text("MinTemp: " + minTemp, 10, tempY += 10);
    text("TempDecay: " + tempDecay, 10, tempY += 10);
    text("TempCondunction: " + tempConductionSpeed, 10, tempY += 10);
    text("Temp gravity mult: " + tempGravityMult, 10, tempY += 10);
    text("Spark temp: " + sparkTemp, 10, tempY += 10);
    text(`Heater width: ${(1 - heatWidth).toFixed(2)}`, 10, tempY += 10);
    text("Heater power: " + heatAmount, 10, tempY += 10);
    text("Blur amount: " + blurAmount, 10, tempY += 10);
}

function testBalls() {
    testBall1.draw();
    testBall2.draw();
    testBall2.pos.set(mouseX, mouseY);
    let dist = p5.Vector.dist(testBall1.pos, testBall2.pos);
    let totalTemp = testBall1.temp + testBall2.temp;
    let avgTemp = totalTemp / 2;
    let ball1dist = testBall1.temp - avgTemp;
    let ball2dist = testBall2.temp - avgTemp;
    testBall1.temp += ball2dist / (dist * 10);
    testBall2.temp += ball1dist / (dist * 10);
    testBall1.col = [testBall1.temp, 0, 0];
    testBall2.col = [testBall2.temp, 0, 0];
    // console.log("B1: " + testBall1.temp + " B2: " + testBall2.temp)
}




class Ball {
    constructor(x_, y_, mass_ = 1, col_ = [255, 0, 0], r_ = 25, velx_ = 0, vely_ = 0) {
        this.pos = createVector(x_, y_);
        this.vel = createVector(velx_, vely_);
        this.acc = createVector(0, 0);
        this.r = r_;
        this.col = col_;
        this.mass = mass_;
        this.temp = -1.00001;
        this.gridx = this.pos.x / gridSizeX;
        this.gridy = this.pos.y / gridSizeY;
    }

    draw() {
        noStroke();
        if (this.temp < sparkTemp + 1 && this.temp > sparkTemp - 1) {
            this.col[0] += 50;
            this.col[1] += 50;
        }
        fill(...this.col);
        if (blurOn == "Blur on") {
            drawingContext.shadowBlur = blurAmount;
            drawingContext.shadowColor = color(...this.col);
        }
        rect(this.pos.x, this.pos.y,
            Math.min(this.r * 2, this.r * 2 * this.vel.mag()), //width
            Math.min(this.r * 2, this.r * 2 * this.vel.mag())); //length

    }

    update() {
        this.col = [
            map(this.temp, minTemp, maxTemp / 1.6, 0, 255), //r
            map(this.temp, minTemp, maxTemp, -100, 255), //g
            0 //b
        ];

        this.gridx = this.pos.x / gridSizeX;
        this.gridy = this.pos.y / gridSizeY;
        this.collision();
        if (this.vel.mag() > 2) {
            this.vel.normalize();
            this.vel.mult(2);
        }
        this.acc.y += gravity * this.mass * -(this.temp - tempGravityMult);
        this.vel.add(this.acc);
        this.vel.mult(friction);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
        if (this.pos.y > height - this.r) {
            this.pos.y = height - this.r;
            this.vel.y *= -1;
        }
        if (this.pos.y < this.r) {
            this.reset();
        }
        if (this.pos.x > width - this.r) {
            this.pos.x = width - this.r;
            this.vel.x *= -1;
        }
        if (this.pos.x < this.r) {
            this.pos.x = this.r;
            this.vel.x *= -1;
        }

        this.temperature();
    }

    temperature() {
        if (this.pos.y > height - this.r - 10) { //hotspot in the center of the floor
            this.temp += map(Math.abs((this.pos.x - width / 2)) * heatWidth, width / 8, 0, 0, heatAmount);
        }
        else this.temp -= tempDecay * Math.random();
        if (this.temp < minTemp || this.temp == 0) { //avoid div/0
            this.temp = minTemp + 0.00001;
        }
        if (this.temp > maxTemp) this.temp = maxTemp;
    }

    reset() {
        this.pos.y = height - this.r;
        this.temp = 0.0001;
        this.vel.set(0, 0);
    }

    conduction(ball1, ball2, dist) {
        let totalTemp = ball1.temp + ball2.temp;
        let avgTemp = totalTemp / 2;
        let ball1dist = ball1.temp - avgTemp;
        let ball2dist = ball2.temp - avgTemp;
        ball1.temp += ball2dist / (dist * tempConductionSpeed);
        ball2.temp += ball1dist / (dist * tempConductionSpeed);
        if (isNaN(ball1.temp) || ball1.temp == 0) ball1.reset();
        if (isNaN(ball2.temp) || ball2.temp == 0) ball2.reset();
    }

    collision() {
        for (const ball of balls) {
            if (ball != this) {
                if (this.gridx <= ball.gridx + 1 && this.gridx >= ball.gridx - 1 &&
                    this.gridy <= ball.gridy + 1 && this.gridy >= ball.gridy - 1) {
                    let distance = createVector(this.pos.dist(ball.pos));
                    this.conduction(this, ball, distance.mag());

                    if (distance.mag() < this.r + ball.r) { //2d elastic collision
                        let angle = Math.atan2(ball.pos.y - this.pos.y, ball.pos.x - this.pos.x); //collision angle

                        //move overlapping particles away a bit
                        ball.pos.set(this.pos.x + (cos(angle) * (this.r + ball.r) * 1.001),
                            this.pos.y + (sin(angle) * (this.r + ball.r) * 1.001));

                        //https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects
                        //https://wikimedia.org/api/rest_v1/media/math/render/svg/14d5feb68844edae9e31c9cb4a2197ee922e409c
                        let x1 = createVector(this.pos.x, this.pos.y),
                            x2 = createVector(ball.pos.x, ball.pos.y),
                            v1 = createVector(this.vel.x, this.vel.y),
                            v2 = createVector(ball.vel.x, ball.vel.y),
                            m1 = this.mass,
                            m2 = ball.mass;
                        if (inf(x1.x) || inf(x1.y) || inf(x2.x) || inf(x2.y)) console.log("FUUUCK");
                        let a = m2 * 2 / (m1 + m2);
                        let b = p5.Vector.dot(p5.Vector.sub(v1, v2), p5.Vector.sub(x1, x2));
                        b /= pow(p5.Vector.sub(x1, x2).mag(), 2);
                        let c = p5.Vector.sub(x1, x2);

                        if ((a + b + c.x + c.y) != Infinity && !isNaN(a + b + c.x + c.y)) { //hide your erorrs
                            let v_1 = p5.Vector.mult(p5.Vector.mult(c, b), a);
                            v_1 = p5.Vector.sub(v1, v_1);
                            this.vel.x = v_1.x;
                            this.vel.y = v_1.y;

                            a = m1 * 2 / (m1 + m2);
                            b = p5.Vector.dot(p5.Vector.sub(v2, v1), p5.Vector.sub(x2, x1));
                            b /= pow(p5.Vector.sub(x2, x1).mag(), 2);
                            c = p5.Vector.sub(x2, x1);

                            let v_2 = p5.Vector.mult(p5.Vector.mult(c, b), a);
                            v_2 = p5.Vector.sub(v2, v_2);
                            ball.vel.set(v_2.x, v_2.y);
                        } else {
                            this.reset();
                            ball.reset();
                        }
                    }
                }
            }
        }
    }
}

function inf(num) {
    return (num == Infinity ? true : false);
}