class Ball {
    constructor(x_, y_, mass_ = 1, col_ = [255, 0, 0], r_ = 25, velx_ = 0, vely_ = 0) {
        this.pos = createVector(x_, y_);
        this.vel = createVector(velx_, vely_);
        this.acc = createVector(0, 0);
        this.r = r_;
        this.col = col_;
        this.mass = mass_;
        this.temp = -1.00001;
        this.gridx = null;
        this.gridy = null;
    }

    draw() {
        noStroke();
        this.col = [
            map(this.temp, minTemp, maxTemp / 1.6, 0, 255), //r
            map(this.temp, minTemp, maxTemp, -100, 255), //g
            0 //b
        ];
        if (this.temp < sparkTemp + 0.1 && this.temp > sparkTemp - 0.1) {
            this.col[0] += 50;
            this.col[1] += 50;
        }
        fill(...this.col);
        if (blurOn == "Blur on") {
            drawingContext.shadowBlur = blurAmount;
            drawingContext.shadowColor = color(...this.col);
        }
        rect(this.pos.x, this.pos.y, this.r * 2, this.r * 2);

    }

    updateVel() {
        if (this.vel.mag() > 3) {
            this.vel.normalize();
             this.vel.mult(3);
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

    }

    setGrid() {
        this.gridx = Math.floor(gridSizeX / width * this.pos.x);
        this.gridy = Math.floor(gridSizeY / width * this.pos.y);
        return [this.gridx, this.gridy];
        // grid[this.gridy][this.gridx].push(this);
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
        this.pos.y = this.r + Math.random() * (height - this.r * 2);
        this.temp = 0.0001;
        this.vel.set(0, 0);
    }

    conduction(ball1, ball2, dist) {
        [ball1, ball2].forEach(b => {
            if (isNaN(b.temp) || b.temp == Infinity) b.reset();
            if (b.temp > maxTemp) b.temp = maxTemp;
            if (b.temp == 0) b.temp + .00001;
        })
        let totalTemp = ball1.temp + ball2.temp;
        let avgTemp = totalTemp / 2;
        let ball1dist = ball1.temp - avgTemp;
        let ball2dist = ball2.temp - avgTemp;
        ball1.temp += ball2dist / Math.max(1, (dist * tempConductionSpeed));
        ball2.temp += ball1dist / Math.max(1, (dist * tempConductionSpeed));
    }

    collision(ball) {
        let distance = createVector(this.pos.dist(ball.pos)).mag();

        if (distance < this.r + ball.r) {
            this.conduction(this, ball, distance)

            this.overlapMove(this.pos, ball.pos, distance);


            //https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects
            //https://wikimedia.org/api/rest_v1/media/math/render/svg/14d5feb68844edae9e31c9cb4a2197ee922e409c
            let x1 = createVector(this.pos.x, this.pos.y),
                x2 = createVector(ball.pos.x, ball.pos.y),
                v1 = createVector(this.vel.x, this.vel.y),
                v2 = createVector(ball.vel.x, ball.vel.y),
                m1 = this.mass,
                m2 = ball.mass;
            let a = m2 * 2 / (m1 + m2);
            let b = p5.Vector.dot(p5.Vector.sub(v1, v2), p5.Vector.sub(x1, x2));
            b /= pow(p5.Vector.sub(x1, x2).mag(), 2);
            let c = p5.Vector.sub(x1, x2);

            if (((a + b + c.x + c.y) != Infinity && !isNaN(a + b + c.x + c.y))) { //hide your erorrs
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

    overlapMove(b0, b1, dist) { //move overlapping particles away from their midpoint
        let x = b0.x - b1.x;
        let y = b0.y - b1.y;
        // let dist = Math.sqrt(x ** 2 + y ** 2);
        // let angle = Math.atan2(y, x);
        let angle = fastAtan2(y, x);
        let distX = Math.cos(angle) * r;
        let distY = Math.sin(angle) * r;
        let midPointX = b0.x - Math.cos(angle) * dist / 2;
        let midPointY = b0.y - Math.sin(angle) * dist / 2;
        b0.x = midPointX + distX;
        b0.y = midPointY + distY;
        b1.x = midPointX - distX;
        b1.y = midPointY - distY;
    }
}