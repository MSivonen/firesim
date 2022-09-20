let fpsText;

function makeSliders() {
    let sliderpos = height + 25;

    createP("Wind").position(250, sliderpos + 9);
    windSlider = createSlider(-0.15, 0.15, wind, 0.01);
    windSlider.position(20, sliderpos += 25); //notice the += here
    windSlider.style("width", "200px");


    createP("Max temp").position(250, sliderpos + 9);
    maxTempSlider = createSlider(1, 20, maxTemp, 0.1);
    maxTempSlider.position(20, sliderpos += 25); //notice the += here
    maxTempSlider.style("width", "200px");

    createP("Min temp").position(250, sliderpos + 9);
    minTempSlider = createSlider(0.1, 3, minTemp, 0.1);
    minTempSlider.position(20, sliderpos += 25);
    minTempSlider.style("width", "200px");

    createP("Temperature decay").position(250, sliderpos + 9);
    tempDecaySlider = createSlider(0.01, 0.2, tempDecay, 0.002);
    tempDecaySlider.position(20, sliderpos += 25);
    tempDecaySlider.style("width", "200px");

    createP("Temp conduction speed").position(250, sliderpos + 9);
    tempConductionSpeedSlider = createSlider(0.1, 15, tempConductionSpeed, 0.1);
    tempConductionSpeedSlider.position(20, sliderpos += 25);
    tempConductionSpeedSlider.style("width", "200px");

    createP("Temp gravity mult").position(250, sliderpos + 9);
    tempGravityMultSlider = createSlider(0.1, 3, tempGravityMult, 0.1);
    tempGravityMultSlider.position(20, sliderpos += 25);
    tempGravityMultSlider.style("width", "200px");

    createP("Spark temp").position(250, sliderpos + 9);
    sparksSlider = createSlider(minTemp, maxTemp, sparkTemp, 0.05);
    sparksSlider.position(20, sliderpos += 25);
    sparksSlider.style("width", "200px");

    createP("Heater width").position(250, sliderpos + 9);
    heatWidthSlider = createSlider(-1, -.05, -heatWidth, 0.01);
    heatWidthSlider.position(20, sliderpos += 25);
    heatWidthSlider.style("width", "200px");

    createP("Heater power").position(250, sliderpos + 9);
    heatAmountSlider = createSlider(0.005, 1, heatAmount, 0.001);
    heatAmountSlider.position(20, sliderpos += 25);
    heatAmountSlider.style("width", "200px");

    createP("Blur amount").position(250, sliderpos + 9);
    blurAmountSlider = createSlider(0.1, 20, blurAmount, 0.1);
    blurAmountSlider.position(20, sliderpos += 25);
    blurAmountSlider.style("width", "200px");

    blurRadio = createRadio().position(20, sliderpos += 25);;
    blurRadio.option("Blur on");
    blurRadio.option("Blur off");
    blurRadio.selected(blurOn);

    saveButton = createButton("Output settings to log").position(20, sliderpos += 25);
    saveButton.mousePressed(saveSettings);

    fpsText = createP("FPS").position(250, sliderpos + 9);

}

function saveSettings() {
    console.log(
        "wind = " + wind + ",\n" +
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
    wind = windSlider.value();
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
    fpsText.html("FPS: " + frameRate().toFixed(0));
    stroke(255);
    let tempY = 5;
    /*     text("MaxTemp: " + maxTemp, 10, tempY += 10);
        text("MinTemp: " + minTemp, 10, tempY += 10);
        text("TempDecay: " + tempDecay, 10, tempY += 10);
        text("TempCondunction: " + tempConductionSpeed, 10, tempY += 10);
        text("Temp gravity mult: " + tempGravityMult, 10, tempY += 10);
        text("Spark temp: " + sparkTemp, 10, tempY += 10);
        text(`Heater width: ${(1 - heatWidth).toFixed(2)}`, 10, tempY += 10);
        text("Heater power: " + heatAmount, 10, tempY += 10);
        text("Blur amount: " + blurAmount, 10, tempY += 10); */
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