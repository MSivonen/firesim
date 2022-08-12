class QuadTree {
    constructor(boundary_, cap_) {
        this.boundary = boundary_;
        this.capacity = cap_;
        this.points = [];
        this.divided = false;
    }

    insert(point) {
        if (!this.boundary.contains(point)) return;
        if (this.points.length < this.capacity) {
            this.points.push(point);
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            //for (const d of [this.ne, this.nw, this.se, this.sw])
            this.ne.insert(point);
            this.nw.insert(point);
            this.se.insert(point);
            this.sw.insert(point);
        }
    }

    query(area, found = []) {
        if (!this.boundary.intersects(area)) return found;
        for (const p of this.points)
            if (area.contains(p))
                found.push(p);
        if (this.divided) {
            this.nw.query(area, found);
            this.ne.query(area, found);
            this.sw.query(area, found);
            this.se.query(area, found);
        }
        return found;
    }

    subdivide() {
        let x = this.boundary.x,
            y = this.boundary.y,
            w = this.boundary.w,
            h = this.boundary.h;
        this.nw = new QuadTree(new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2), this.capacity);
        this.ne = new QuadTree(new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2), this.capacity);
        this.sw = new QuadTree(new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2), this.capacity);
        this.se = new QuadTree(new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2), this.capacity);
        this.divided = true;
    }

    show() {
        stroke(40);
        strokeWeight(1);
        noFill();
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
        if (this.divided)
            for (const d of [this.ne, this.nw, this.se, this.sw])
                d.show();
    }
}

class Rectangle {
    constructor(x_, y_, w_, h_) {
        this.x = x_;
        this.y = y_;
        this.w = w_;
        this.h = h_;
    }

    contains(point) {
        return (point.pos.x >= this.x - this.w &&
            point.pos.x <= this.x + this.w &&
            point.pos.y >= this.y - this.h &&
            point.pos.y <= this.y + this.h);
    }

    intersects(area) {
        return !(area.x - area.w > this.x + this.w ||
            area.x + area.w < this.x - this.w ||
            area.y - area.h > this.y + this.h ||
            area.y + area.h < this.y - this.h);
    }
}

class Circle {
    constructor(x_, y_, r_) {
        this.x = x_;
        this.y = y_;
        this.r = r_;
    }

    contains(point) {
        let x = this.x - point.pos.x;
        let y = this.y - point.pos.y;
        return (Math.sqrt(x ** 2 + y ** 2) < this.r);
    }

    intersects(area) {
        return !(area.x - area.w > this.x + this.w ||
            area.x + area.w < this.x - this.w ||
            area.y - area.h > this.y + this.h ||
            area.y + area.h < this.y - this.h);
    }
}