

function inf(num) {
    return (num == Infinity ? true : false);
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

function makePixels(w_, h_) {
    for (let y = 0; y < h_; y++) {
        pixels.push([]);
        for (let x = 0; x < w_; x++) {
            pixels[y].push(new Pixel(x, y, 255 * Math.random()));
        }
    }
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    if (c > 255) c = 255;
    if (c < 0) c = 0;
    var hex = Math.floor(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}