//basic original element
let bgColors = [] // Array to store the background colors of the big circles
let ShapeColor = [] // Array to store the shape colors inside the big circles
// Array to store points for ZipLines
let curve_40 = []
let curve_25 = []
// Scaling factor for axis
let rateX = 1;
let rateY = 1;

// Variables to control ripple
let circleFilling = false;
let circleSizes = [0, 0, 0, 0, 0, 0];
let circleColors = [];
const numCircles = 6;
const circleSizeRatios = [150, 85, 45, 25, 17, 9];
// Array to store information about circles drawn by the user
const circles = [];
let circolor;
// Background colors and color variables
let FirstColor, secondColor, thirdColor, fifthColor, smallestColor;
let circleX;
let circleY;
let circleSize;
let RingColor = [] // Array to store the color of ripple
let rKeyPressed = false;
let expansionFactor = 3; // Initial expansion factor

// Flag to control the complete artwork drawing
let cKeyPressed = false;

// Array to store particles for the fireworks
let particles = [];
const gravity = 0.25;
let fireColor = []
let endColor;

function setup() {
  // Create a canvas that fills the window
  createCanvas(windowHeight, windowHeight)
  // Set scaling factors based on canvas size
  rateX = width / 550.0;
  rateY = height / 550.0;

  // Set text color and size
  textSize(16);
  fill(255);

  // Define an array of background colors
  bgColors = [
    color(200, 230, 241), color(250, 158, 7), color(252, 238, 242),
    color(252, 191, 49), color(207, 241, 242), color(248, 197, 56), color(252, 191, 49),
    color(221, 254, 254), color(250, 158, 7), color(252, 238, 242), color(254, 247, 243),
    color(252, 238, 242), color(252, 191, 49), color(241, 224, 76), color(250, 158, 7),
    color(252, 238, 242), color(207, 241, 242)
  ];

  //colors for six circles of the big circle
  FirstColor = random(bgColors); // Pick a random color from bgColors
  // Define other colors
  secondColor = color(181, 77, 162);
  thirdColor = color(71, 83, 63);
  fifthColor = random() > 0.5 ? color(34, 151, 66) : color(240, 67, 32);
  smallestColor = color(183, 190, 189);

  //Shape colors inside each big circle
  ShapeColor = [
    //line #1
    { Out: color(15, 8, 104), Mid: color(12, 102, 50) }, { Out: color(227, 13, 2), Mid: color(249, 81, 8) },
    { Out: color(245, 20, 2), Mid: color(12, 102, 50) },
    //line #2
    { Out: color(21, 95, 151), Mid: color(251, 85, 63) }, { Out: color(15, 133, 52), Mid: color(251, 85, 63) },
    { Out: color(213, 153, 217), Mid: color(60, 146, 195) }, { Out: color(21, 95, 151), Mid: color(249, 209, 244) },
    //line #3
    { Out: color(0, 150, 145), Mid: color(12, 102, 50) }, { Out: color(227, 13, 2), Mid: color(243, 7, 11) },
    { Out: color(245, 20, 2), Mid: color(251, 85, 63) }, { Out: color(243, 110, 9), Mid: color(12, 102, 50) },
    //line #4
    { Out: color(245, 20, 2), Mid: color(60, 146, 195) }, { Out: color(196, 21, 90), Mid: color(12, 102, 50) },
    { Out: color(20, 112, 185), Mid: color(251, 85, 63) }, { Out: color(227, 13, 2), Mid: color(12, 102, 50) },
    //line #5
    { Out: color(245, 20, 2), Mid: color(117, 194, 116) }, { Out: color(15, 133, 52), Mid: color(12, 102, 50) }
  ];

  // Initialize colors for the ripple and firework
  for (let i = 0; i < ShapeColor.length; i++) {
    RingColor.push(ShapeColor[i].Mid);
  }
  for (let j = 0; j < ShapeColor.length; j++) {
    fireColor.push(ShapeColor[j].Out);
  }

  pixelDensity(1);
  endColor = color(64, 0);
}

// Function to handle window resizing
function windowResized() {
  // Resize the canvas to match the new window dimensions
  resizeCanvas(windowHeight, windowHeight);
  // Update the canvas width and height variables
  rateX = width / 550.0;
  rateY = height / 550.0;
}

function draw() {
  background(60, 80, 110);
  // Scale the drawing to fit the canvas size
  push();
  scale(rateX, rateY);
  pop();

  //text for user instruction
  text("Step1: mousepress - generate circles", 20, 20);
  text("Step2: press\"c\" - generate complete artwork", 20, 40);
  text("or press\"r\" - ripple", 20, 60);
  text("or press\"f\" - firework", 20, 80);

  // Call functions to draw various elements
  drawCircle();
  drawRing();
  drawArtwork();

  // Update and draw particles for fireworks
  particles.forEach((p) => {
    p.step();
    p.draw();
  });
  particles = particles.filter((p) => p.isAlive);
}

function drawCircle() {
  //draw six circles based on the color and ratio, increased by 2
  for (let i = 0; i < numCircles; i++) {
    if (circleFilling && circleSizes[i] < circleSizeRatios[i]) {
      circleSizes[i] += 2;
    }
  }

  // Check for overlapping circles and handle drawing
  // if overlap, the old circle will be deleted
  for (let i = 0; i < numCircles; i++) {
    if (circleFilling) {
      const overlappingCircle = getOverlappingCircle(i);
      if (overlappingCircle) {
        circleFilling = false;
        circles.splice(circles.indexOf(overlappingCircle), 1);
      }

      // Set the fill color based on the circle index
      if (i === 0) {
        fill(FirstColor);
      } else if (i === 1) {
        fill(secondColor);
      } else if (i === 2) {
        fill(thirdColor);
      } else if (i === 3) {
        fill(color(0)); // Black
      } else if (i === 4) {
        fill(fifthColor);
      } else if (i === 5) {
        fill(smallestColor);
      }
      // Draw the circle at the mouse position
      circle(mouseX, mouseY, circleSizes[i]);

    }
  }

  // Draw user-drawn circles stored in the 'circles' array
  for (const c of circles) {
    c.draw();
  }
}

function drawRing() {
  // Loop through each circle in the 'circles' array
  for (let i = 0; i < circles.length; i++) {
    if (rKeyPressed) {
      push(); // Save the current drawing settings
      // Increase the 'circleSize' variable by 3
      circleSize += 3;
      // Loop three times to create concentric rings
      for (let j = 0; j < 3; j++) {
        // Calculate the radius of the current ring
        let radius = (j + expansionFactor) * 10;
        noFill();
        let ring = random(RingColor);
        stroke(ring);
        strokeWeight(3);
        // Draw an ellipse (circle) with the calculated radius, centered at the position of the current circle
        ellipse(circles[i].x, circles[i].y, radius * 2, radius * 2);
        noStroke();
      }
      expansionFactor += 0.02; // Increase the 'expansionFactor' to create larger rings
      pop(); // Restore the original drawing settings
    }
  }
}

//draw zip lines in the big circle
function drawZipLine(i) {
  for (let i = 0; i < circles.length; i++) {
    //draw lines at mid circle of the big cirlce
    if (curve_40.length == 0) {
      let numCircles = 3;
      for (let j = 0; j < numCircles; j++) {
        let numDot = (j + 2.5) * 10;
        angleMode(DEGREES);
        let angle = 360 / numDot;
        for (let k = 0; k < numDot; k++) {
          let x = circles[i].x + cos(angle * k) * (j * 7 + 25);
          let y = circles[i].y + sin(angle * k) * (j * 7 + 25);
          fill(251, 85, 63);
          if (numDot == 25) {
            curve_25.push({ "x": x, "y": y });
          }
          if (numDot >= 40) {
            curve_40.push({ "x": x, "y": y });
          }
        }
      }
    }
  }
}

//draw dots inside of the big circle
function drawDotsIn(i) {
  push()
  for (let i = 0; i < circles.length; i++) {
    //outer circle
    let numCircles = 5;
    for (let j = 0; j < numCircles; j++) {
      let numDot = (j + 3.5) * 10;
      let DotRadius = 5;
      angleMode(DEGREES);
      let angle = 360 / numDot;
      for (let k = 0; k < numDot; k++) {
        let x = circles[i].x + cos(angle * k) * (j * 7 + 45);
        let y = circles[i].y + sin(angle * k) * (j * 7 + 45);
        fill(ShapeColor[i].Out);
        ellipse(x, y, DotRadius, DotRadius);
      }
    }
  }
  pop()
}

//draw chain of small circles
function drawHexagons(i) {
  push()
  for (let i = 0; i < circles.length; i++) {
    let hexagonRadius = 90;
    let hexagonX = circles[i].x;
    let hexagonY = circles[i].y;

    for (let j = 0; j < 6; j++) {
      let angle = 360 / 6 * j;
      let x = hexagonX + hexagonRadius * cos(angle);
      let y = hexagonY + hexagonRadius * sin(angle);

      fill(0);
      stroke(221, 97, 40);
      strokeWeight(2);
      ellipse(x, y, 7.5, 7.5);
    }

    for (let j = 0; j < 6; j++) {
      let angle1 = 360 / 6 * j;
      let angle2 = 360 / 6 * ((j + 1) % 6); // Next vertex
      for (let k = 0; k < 4; k++) {
        let fraction = k / 4;
        let x = lerp(hexagonX + hexagonRadius * cos(angle1), hexagonX + hexagonRadius * cos(angle2), fraction);
        let y = lerp(hexagonY + hexagonRadius * sin(angle1), hexagonY + hexagonRadius * sin(angle2), fraction);

        fill(0);
        stroke(221, 97, 40);
        strokeWeight(2);
        ellipse(x, y, 7.5, 7.5);
      }
    }

    for (let j = 0; j < 6; j++) {
      let angle = 360 / 6 * j;
      let x = hexagonX + hexagonRadius * cos(angle);
      let y = hexagonY + hexagonRadius * sin(angle);

      //draw a white inner circle inside the small circle
      fill(255);
      stroke(0);
      ellipse(x, y, 6.5, 6.5);
    }
  }
  pop()
}

function drawSmoothCurve(points) {
  beginShape();
  // First point
  vertex(points[0].x, points[0].y);

  // Use bezierVertex to connect other points
  for (let i = 1; i < points.length - 2; i++) {
    let xc = (points[i].x + points[i + 1].x) / 2;
    let yc = (points[i].y + points[i + 1].y) / 2;
    bezierVertex(points[i].x, points[i].y, xc, yc, xc, yc);
  }

  // End point
  vertex(points[points.length - 1].x, points[points.length - 1].y);

  endShape();
}

function drawCurves(i) {
  noFill();
  // Save the current stroke settings
  push();
  stroke('#E93468');
  strokeWeight(5);
  for (let i = 0; i < circles.length; i++) {
    curve = [
      { x: circles[i].x, y: circles[i].y },
      { x: circles[i].x - 8, y: circles[i].y + 17 },
      { x: circles[i].x - 11, y: circles[i].y + 45 },
      { x: circles[i].x, y: circles[i].y + 70 },
      { x: circles[i].x + 20, y: circles[i].y + 85 },
      { x: circles[i].x + 35, y: circles[i].y + 87 },
    ];
  }
  drawSmoothCurve(curve);
  // Restore the previous stroke settings
  pop();
}

// draw artwork elements
function drawArtwork() {
  push()
  for (let i = 0; i < circles.length; i++) {
    if (cKeyPressed) {
      drawZipLine(i);
      drawDotsIn(i);
      drawHexagons(i);
      drawCurves(i);
    }
  }
  pop()
}

// Function to check for overlapping circles with a newly drawn circle
function getOverlappingCircle(index) {
  for (let i = circles.length - 1; i >= 0; i--) {
    const c = circles[i];
    if (dist(c.x, c.y, mouseX, mouseY) < circleSizes[index] / 2 + c.size / 2 + 2) {
      circles.splice(i, 1); //delete old circle
    }
  }
  return undefined; // No overlapping circle found
}

function mousePressed() {
  // Reset circle sizes and colors arrays
  circleSizes = [0, 0, 0, 0, 0, 0];
  circleColors = [];
  // Determine the fill color based on the circle index
  for (let i = 0; i < numCircles; i++) {
    if (i === 0) {
      fill(FirstColor);
      circolor = FirstColor;
    } else if (i === 1) {
      fill(secondColor);
      circolor = secondColor;
    } else if (i === 2) {
      fill(thirdColor);
      circolor = thirdColor;
    } else if (i === 3) {
      fill(color(0)); // Black
      circolor = color(0);
    } else if (i === 4) {
      fill(fifthColor);
      circolor = fifthColor;
    } else if (i === 5) {
      fill(smallestColor);
      circolor = smallestColor;
    }
    // Store the selected color in the 'circleColors' array
    circleColors.push(circolor);
  }
  // Set the flag to start filling circles
  circleFilling = true;
}

function mouseReleased() {
  if (circleFilling) {
    // Create Circle objects and add them to the 'circles' array
    for (let i = 0; i < numCircles; i++) {
      circles.push(new Circle(mouseX, mouseY, circleSizes[i], circleColors[i]));
    }
  }
  // Reset the flag
  circleFilling = false;
}

// control key input
function keyPressed() {
  // draw ripple
  if (key === 'r' || key === 'R') {
    rKeyPressed = true;
    circleSize = 0;
    expansionFactor = 3; // Reset expansion factor
  }
  // draw artwork
  else if (key === 'c' || key === 'C') {
    cKeyPressed = true;
  }
  //draw firwork
  else if (key === 'f' || key === 'F') {
    if (particles.length === 0) {
      for (let i = 0; i < circles.length; i++) {
        particles.push(new Firework(circles[i].x, circles[i].y));
      }
    }
  }
}

// stop ripple
function keyReleased() {
  if (key === 'r' || key === 'R') {
    rKeyPressed = false;
  }
}

// Class representing a user-drawn circle
class Circle {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  // Draw the circle with its specified properties
  draw() {
    fill(this.color);
    circle(this.x, this.y, this.size);
  }
}

// Class representing a particle for fireworks
class Particle {
  constructor(x, y, xSpeed, ySpeed, pColor, size) {
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed; // Horizontal velocity of the particle
    this.ySpeed = ySpeed; // Vertical velocity of the particle
    this.color = pColor; // Color of the particle
    this.size = size; // Size of the particle
    this.isAlive = true; // A flag to determine if the particle is alive
    this.trail = []; // An array to store the particle's trail
    this.trailIndex = 0; // Index for tracking the trail
  }

  step() {
    // updates the particle's position and trail
    this.trail[this.trailIndex] = createVector(this.x, this.y);
    this.trailIndex++;
    if (this.trailIndex > 10) {
      this.trailIndex = 0;
    }
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Apply gravity to the particle's vertical speed
    this.ySpeed += gravity;

    // If the particle reaches the bottom of the canvas,
    // mark it as not alive
    if (this.y > height) {
      this.isAlive = false;
    }
  }

  // draws the particle and its trail
  draw() {
    this.drawTrail();
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }

  // draws the particle's trail
  drawTrail() {
    let index = 0;

    for (let i = this.trailIndex - 1; i >= 0; i--) {
      const tColor = lerpColor(color(this.color), endColor, index / this.trail.length);
      fill(tColor);
      noStroke();
      ellipse(this.trail[i].x, this.trail[i].y, this.size, this.size);
      index++;
    }

    for (let i = this.trail.length - 1; i >= this.trailIndex; i--) {
      const tColor = lerpColor(color(this.color), endColor, index / this.trail.length);
      fill(tColor);
      noStroke();
      ellipse(this.trail[i].x, this.trail[i].y, this.size, this.size);
      index++;
    }
  }
}

// Class representing a firework particle
class Firework extends Particle {
  constructor(x, y) {
    super(x, y, random(-2, 2), random(-10, -15), random(fireColor), 5);
    this.countdown = random(30, 60);
  }

  // updates the firework particle's position and behavior
  step() {
    super.step();
    this.countdown--;
    if (this.countdown <= 0) {
      // When the countdown reaches zero, create an explosion of smaller particles
      const explosionSize = random(20, 50);
      for (let i = 0; i < explosionSize; i++) {
        // Generate smaller particles with random velocities and colors
        const speed = random(5, 10);
        const angle = random(TWO_PI);
        const xSpeed = cos(angle) * speed;
        const ySpeed = sin(angle) * speed;

        // Add the smaller particles to the 'particles' array
        particles.push(new Particle(this.x, this.y, xSpeed, ySpeed, this.color, 5));
      }
      this.isAlive = false; // Mark the firework particle as not alive after the explosion
    }
  }
}