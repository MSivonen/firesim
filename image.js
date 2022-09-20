class Pixel {
    constructor(x_, y_, col_) {
        this.pos = new Vec(x_, y_);
        this.col = [0, col_, 0, 1];
    }

    draw(index) {
        let tempCol = this.updateColor();
        let [r, g, b] = [
            //Math.min(65, tempCol < 255 ? 0 : tempCol > 512 ? 255 : tempCol - 255),
            tempCol < 255 ? tempCol : 255,
            tempCol / 2,
            tempCol / 4
            //            Math.min(50, tempCol < 255 ? 0 : tempCol > 512 ? 255 : tempCol - 255)
        ]
        this.col = [r, g, b, 255];
        img.data[index] = this.col[0];
        img.data[index + 1] = this.col[1];
        img.data[index + 2] = this.col[2];
        img.data[index + 3] = this.col[3];
    }

    updateColor() {
        let sum = 0;
        const mult = 40000;
        const d = 40;
        for (const b of balls) {
            if (b.pos.x < this.pos.x + d &&
                b.pos.x > this.pos.x - d &&
                b.pos.y < this.pos.y + d &&
                b.pos.y > this.pos.y - d &&
                b.temp > 0.7)
                sum += (1 / (this.dist(this.pos, b.pos) * balls.length)) * b.temp;
            // if (mult * sum >= 355) return 355;
        }
        return (mult * sum) ** 2;
    }

    dist(v1, v2) {
        return (v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2;
    }

}