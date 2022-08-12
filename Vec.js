class Vec {
    constructor(x_, y_) {
        this.x = x_;
        this.y = y_;
    }

    sub(vv1, vv2) {
        return {
            x: vv1.x - vv2.x,
            y: vv1.y - vv2.y
        }
    }

    add(vv1, vv2) {
        return {
            x: vv1.x + vv2.x,
            y: vv1.y + vv2.y
        }
    }

    mult(vv, n) {
        return {
            x: vv.x * n,
            y: vv.y * n
        }
    }

    dot(vv1, vv2) {
        return vv1.x * vv2.x + vv1.y * vv2.y;
    }

    mag(vv) {
        return (Math.sqrt(vv.x ** 2 + vv.y ** 2));
    }

    dist(vv1, vv2) {
        return (Math.sqrt((vv1.x - vv2.x) ** 2 + (vv1.y - vv2.y) ** 2));
    }
}