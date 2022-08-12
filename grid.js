function sfillGrid() {
    for (const ball of balls) {
        for (const ball2 of balls) {
            if (ball.pos.x > ball2.pos.x - ball2.r * 2.1 &&
                ball.pos.x < ball2.pos.x + ball2.r * 2.1 &&
                ball.pos.y > ball2.pos.y - ball2.r * 2.1 &&
                ball.pos.y < ball2.pos.y + ball2.r * 2.1) {
                ball.collision(ball2);
            }
        }
    }
}

function fillGrid() {
    for (const ball of balls) {
        let indexes = ball.setGrid();               //returns position in 2d array [y, x]
        grid[indexes[0]][indexes[1]].push(ball);
    };
    const n = 1;                                    //neighbour distance
    for (let y = 0; y < grid[0].length; y++) {      //iter Y
        for (let x = 0; x < grid.length; x++) {     //iter X
            for (const ball1 of grid[y][x]) {       //grab every ball1 from cell
                for (let i = -n; i <= n; i++) {     //y neighbours
                    for (let j = -n; j <= n; j++) { //x neighbours
                        if (//i != j &&             //test that must remain available
                            y + i >= 0 &&           //over array bounds? -> nope tf outta here
                            x + j >= 0 &&
                            y + i < grid.length &&
                            x + j < grid[0].length) {
                            for (const ball2 of grid[y + i][x + j]) { //grab ball2 from this cell and neighbours
                                ball1.collision(ball2); //balls are touching?
                            }
                        }
                    }
                }
            }
        }
    }
}