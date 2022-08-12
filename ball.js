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
            map(this.temp, minTemp, maxTemp / 1.6, -30, 255), //r
            map(this.temp, minTemp, maxTemp, -100, 255), //g
            0 //b
        ];
        if (this.temp < sparkTemp + 0.1 && this.temp > sparkTemp - 0.1) {
            this.col[0] += 50 + Math.random() * 20;
            this.col[1] += 50 + Math.random() * 20;
        }
        ctx.fillStyle = rgbToHex(...this.col);
        if (blurOn == "Blur on") {
            drawingContext.shadowBlur = blurAmount;
            drawingContext.shadowColor = color(...this.col);
        }
        ctx.fillRect(this.pos.x - this.r, this.pos.y - this.r, this.r * 2, this.r * 2);
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
        this.mass = map(this.temp, minTemp, maxTemp, 2, -1);
    }

    reset() {
        this.pos.y = this.r + Math.random() * (height - this.r * 2);
        this.pos.x = this.r + Math.random() * (width - this.r * 2);
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
        let distance = calc.dist(this.pos, ball.pos);

        if (distance < this.r + ball.r) {
            this.conduction(this, ball, distance)

            this.overlapMove(this.pos, ball.pos, distance);


            //https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects
            //https://wikimedia.org/api/rest_v1/media/math/render/svg/14d5feb68844edae9e31c9cb4a2197ee922e409c
            let x1 = new Vec(this.pos.x, this.pos.y),
                x2 = new Vec(ball.pos.x, ball.pos.y),
                v1 = new Vec(this.vel.x, this.vel.y),
                v2 = new Vec(ball.vel.x, ball.vel.y),
                m1 = this.mass,
                m2 = ball.mass;
            let a = m2 * 2 / (m1 + m2);
            let b = calc.dot(calc.sub(v1, v2), calc.sub(x1, x2));
            b /= (calc.mag(calc.sub(x1, x2))) ** 2;
            let c = calc.sub(x1, x2);

            if (((a + b + c.x + c.y) != Infinity && !isNaN(a + b + c.x + c.y))) { //hide your erorrs
                let v_1 = calc.mult(calc.mult(c, b), a);
                v_1 = calc.sub(v1, v_1);
                this.vel.x = v_1.x;
                this.vel.y = v_1.y;

                a = m1 * 2 / (m1 + m2);
                b = calc.dot(calc.sub(v2, v1), calc.sub(x2, x1));
                b /= pow(calc.mag(calc.sub(x2, x1)), 2);
                c = calc.sub(x2, x1);

                let v_2 = calc.mult(calc.mult(c, b), a);
                v_2 = calc.sub(v2, v_2);
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
        let angle = Math.atan2(y, x);
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