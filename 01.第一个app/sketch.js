function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(255);
  noLoop();
}

function draw() {
  background(0);
  translate(width/2, height);
  drawFractal(0, 100, 8);
}

function drawFractal(angle, len, depth) {
  if (depth === 0) return;
  
  strokeWeight(map(depth, 0, 8, 1, 5));
  stroke(30, 100 - depth*10, 60);
  
  line(0, 0, 0, -len);
  translate(0, -len);
  
  push();
  rotate(radians(-angle));
  drawFractal(angle * 0.7, len * 0.8, depth-1);
  pop();
  
  push();
  rotate(radians(angle));
  drawFractal(angle * 0.7, len * 0.8, depth-1);
  pop();
}

function mouseMoved() {
  let newAngle = map(mouseX, 0, width, 0, 45);
  let newDepth = map(mouseY, 0, height, 2, 12);
  drawFractal(newAngle, 100, floor(newDepth));
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}