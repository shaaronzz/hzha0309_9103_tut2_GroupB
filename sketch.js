let positions = [] // Array to store the positions of the big circles
let CirBgColor = [] // Array to store the background colors of the big circles
let ShapeColor = [] // Array to store the shape colors inside the big circles
let RingColor = []
// Array to store points for ZipLines
let curve_40 = []
let curve_25 = []
// Scaling factor for axis
let rateX = 1;
let rateY = 1;
// Variables to control user-drawn circles
let circleFilling = false;
let circleSizes = [0, 0, 0, 0, 0, 0];
let circleColors = [];
const numCircles = 6;
const circleSizeRatios = [150, 85, 45, 25, 17, 9];
// Array to store information about circles drawn by the user
const circles = [];
let circolor;
// Background colors and color variables
let bgColors, FirstColor, secondColor, thirdColor, fifthColor, smallestColor;
let circleX;
let circleY;
let circleSize;
let rKeyPressed = false;
let expansionFactor = 3; // Initial expansion factor

function setup() {
  // Create a canvas that fills the window
  createCanvas(windowHeight, windowHeight)
  // Set scaling factors based on canvas size
  rateX = width / 550.0;
  rateY = height / 550.0;

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
  //get ring colors
  for (let i = 0; i < ShapeColor.length; i++) {
    RingColor.push(ShapeColor[i].Mid);
  }
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

  drawCircle();
  drawRing();
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

function keyPressed() {
  if (key === 'r' || key === 'R') {
    rKeyPressed = true;
    circleX = mouseX;
    circleY = mouseY;
    circleSize = 0;
    expansionFactor = 3; // Reset expansion factor
  }
}

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

//draw zip lines in the big circle
function drawZipLine() {
  for (let i = 0; i < xPos.length; i++) {
    //draw lines at outer circle of the big circle
    if (i == 1 || i == 8 || i == 14) {
      let numCircles = 5;
      let curve_70 = [];
      let curve_35 = [];
      for (let j = 0; j < numCircles; j++) {
        let numDot = (j + 3.5) * 10;
        angleMode(DEGREES);
        let angle = 360 / numDot;
        noFill();
        stroke('#ef1e1e');

        for (let k = 0; k < numDot; k++) {
          let x = xPos[i] + cos(angle * k) * (j * 7 + 45);
          let y = yPos[i] + sin(angle * k) * (j * 7 + 45);
          if (numDot > 70) {
            curve_70.push({ "x": x, "y": y });
          } else if (numDot == 35) {
            curve_35.push({ "x": x, "y": y });
          }
        }

        if (curve_70.length > 0 && curve_35.length > 0) {
          for (var qw = 0; qw < curve_70.length; qw++) {
            var num = qw / 2;
            num = Math.round(num);
            if (num >= (curve_35.length - 1)) {
              num = curve_35.length - 1;
            }
            line(curve_70[qw].x, curve_70[qw].y, curve_35[num].x, curve_35[num].y);
          }
        }
      }
    }

    if (curve_40.length > 0 && curve_25.length > 0) {
      for (var qw = 0; qw < curve_40.length; qw++) {
        var num = qw / 2;
        num = Math.round(num);
        if (num >= (curve_25.length - 1)) {
          num = curve_25.length - 1;
        }
        line(curve_40[qw].x, curve_40[qw].y, curve_25[num].x, curve_25[num].y);
      }
    }

    //draw lines at mid circle of the big cirlce
    if (i == 9 && curve_40.length == 0) {
      let numCircles = 3;
      for (let j = 0; j < numCircles; j++) {
        let numDot = (j + 2.5) * 10;
        angleMode(DEGREES);
        let angle = 360 / numDot;
        for (let k = 0; k < numDot; k++) {
          let x = xPos[i] + cos(angle * k) * (j * 7 + 25);
          let y = yPos[i] + sin(angle * k) * (j * 7 + 25);
          fill(ShapeColor[i].Mid);
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
function drawDotsIn() {
  for (let i = 0; i < xPos.length; i++) {
    //outer circle
    if (i !== 1 && i !== 8 && i !== 14) {
      let numCircles = 5;
      for (let j = 0; j < numCircles; j++) {
        let numDot = (j + 3.5) * 10;
        let DotRadius = 5;
        angleMode(DEGREES);
        let angle = 360 / numDot;
        for (let k = 0; k < numDot; k++) {
          let x = xPos[i] + cos(angle * k) * (j * 7 + 45);
          let y = yPos[i] + sin(angle * k) * (j * 7 + 45);
          fill(ShapeColor[i].Out);
          ellipse(x, y, DotRadius, DotRadius);
        }
      }
    }

    //mid circle
    if (i === 1 || i === 3 || i === 6 || i === 8 || i === 15) {
      let numCircles = 3;
      for (let j = 0; j < numCircles; j++) {
        let numDot = (j + 2.5) * 10;
        let DotRadius = 5;
        angleMode(DEGREES);
        let angle = 360 / numDot;
        for (let k = 0; k < numDot; k++) {
          let x = xPos[i] + cos(angle * k) * (j * 7 + 25);
          let y = yPos[i] + sin(angle * k) * (j * 7 + 25);
          fill(ShapeColor[i].Mid);
          ellipse(x, y, DotRadius, DotRadius);
        }
      }
    }
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
        let radius = (j + expansionFactor) * 30;
        noFill();
        let ring = random(RingColor)
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

//draw chain of small circles
function drawHexagons() {
  for (let i = 0; i < xPos.length; i++) {
    let hexagonRadius = 90;
    let hexagonX = xPos[i];
    let hexagonY = yPos[i];

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

function drawCurves() {
  noFill();
  stroke('#E93468');
  strokeWeight(5);

  let curve1 = [
    { x: 75, y: 75 },
    { x: 67, y: 92 },
    { x: 64, y: 120 },
    { x: 75, y: 145 },
    { x: 95, y: 160 },
    { x: 110, y: 162 },
  ];

  let curve2 = [
    { x: 188, y: 185 },
    { x: 193, y: 172 },
    { x: 208, y: 150 },
    { x: 250, y: 125 },
    { x: 260, y: 130 },
  ];

  let curve3 = [
    { x: 415, y: -5 },
    { x: 420, y: 20 },
    { x: 440, y: 40 },
    { x: 470, y: 45 },
    { x: 495, y: 35 },
  ];

  let curve4 = [
    { x: -35, y: 375 },
    { x: -2.5, y: 360 },
    { x: 20, y: 340 },
    { x: 47, y: 325 },
    { x: 55, y: 327 },
  ];

  let curve5 = [
    { x: 305, y: 295 },
    { x: 325, y: 280 },
    { x: 350, y: 275 },
    { x: 375, y: 275 },
    { x: 405, y: 300 },
    { x: 410, y: 315 },
  ];

  let curve6 = [
    { x: 475, y: 255 },
    { x: 477, y: 240 },
    { x: 485, y: 225 },
    { x: 500, y: 212 },
    { x: 510, y: 205 },
    { x: 530, y: 200 },
    { x: 550, y: 195 },
  ];

  let curve7 = [
    { x: 85, y: 485 },
    { x: 105, y: 510 },
    { x: 130, y: 525 },
    { x: 150, y: 530 },
    { x: 170, y: 528 },
    { x: 190, y: 523 },
    { x: 195, y: 520 },
  ];

  const arr = [curve1, curve2, curve3, curve4, curve5, curve6, curve7];
  arr.forEach((curve) => {
    drawSmoothCurve(curve);
  })
}

//draw straight line
function drawStraightLine(x1, y1, x2, y2) {
  stroke(255, 28, 0);
  strokeWeight(2);
  line(x1, y1, x2, y2);
}