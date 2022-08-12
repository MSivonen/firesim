

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

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    if (c > 255) c = 255;
    if (c < 0) c = 0;
    var hex = Math.floor(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}