let artwork // Variable to store the artwork
let positions = [] // Array to store the positions of the big circles
let CirBgColor = [] // Array to store the background colors of the big circles
let ShapeColor = [] // Array to store the shape colors inside the big circles
// Array to store points for ZipLines
let curve_40 = []
let curve_25 = []
// Scaling factor for axis
let rateX = 1;
let rateY = 1;

let circleFilling = false;
let circleSizes = [0, 0, 0, 0, 0, 0];
let circleColors = [];
const numCircles = 6;
const circleSizeRatios = [150, 85, 45, 25, 17, 9];

const circles = [];
let circolor;
let bgColors, FirstColor, secondColor, thirdColor, fifthColor, smallestColor;

function setup() {
  createCanvas(windowWidth, windowHeight)
  rateX = width / 550.0;
  rateY = height / 550.0;
  background(60, 80, 110)

  bgColors = [
    color(200, 230, 241), color(250, 158, 7), color(252, 238, 242),
    color(252, 191, 49), color(207, 241, 242), color(248, 197, 56), color(252, 191, 49),
    color(221, 254, 254), color(250, 158, 7), color(252, 238, 242), color(254, 247, 243),
    color(252, 238, 242), color(252, 191, 49), color(241, 224, 76), color(250, 158, 7),
    color(252, 238, 242), color(207, 241, 242)
  ];

  FirstColor = random(bgColors); // Pick a random color from bgColors
  secondColor = color(181, 77, 162);
  thirdColor = color(71, 83, 63);
  fifthColor = random() > 0.5 ? color(34, 151, 66) : color(240, 67, 32);
  smallestColor = color(183, 190, 189);

  artwork = new Artwork(positions, CirBgColor, ShapeColor)
}

// Function to handle window resizing
function windowResized() {
  // Resize the canvas to match the new window dimensions
  resizeCanvas(windowWidth, windowHeight);
  // Update the canvas width and height variables
  rateX = width / 550.0;
  rateY = height / 550.0;
}

function draw() {
  background(60, 80, 110);

  push();
  scale(rateX, rateY);
  artwork.display()
  pop();

  for (let i = 0; i < numCircles; i++) {
    if (circleFilling && circleSizes[i] < circleSizeRatios[i]) {
      circleSizes[i] += 2;
    }
  }

  for (let i = 0; i < numCircles; i++) {
    if (circleFilling) {
      const overlappingCircle = getOverlappingCircle(i);
      if (overlappingCircle) {
        circleFilling = false;
        circles.splice(circles.indexOf(overlappingCircle), 1);
      }

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
      circle(mouseX, mouseY, circleSizes[i]);
    }
  }

  for (const c of circles) {
    c.draw();
  }
}

function getOverlappingCircle(index) {
  for (let i = circles.length - 1; i >= 0; i--) {
    const c = circles[i];
    if (dist(c.x, c.y, mouseX, mouseY) < circleSizes[index] / 2 + c.size / 2 + 2) {
      circles.splice(i, 1); // 删除旧圆
    }
  }
  return undefined; // 不返回任何重叠的圆
}

function mousePressed() {
  circleSizes = [0, 0, 0, 0, 0, 0];
  circleColors = [];
  for (let i = 0; i < numCircles; i++) {
    if (i === 0) {
      fill(FirstColor);
      circolor=FirstColor;
    } else if (i === 1) {
      fill(secondColor);
      circolor=secondColor;
    } else if (i === 2) {
      fill(thirdColor);
      circolor=thirdColor;
    } else if (i === 3) {
      fill(color(0)); // Black
      circolor=color(0);
    } else if (i === 4) {
      fill(fifthColor);
      circolor=fifthColor;
    } else if (i === 5) {
      fill(smallestColor);
      circolor=smallestColor;
    }
    
  circleColors.push(circolor);
  }
  circleFilling = true;
}

function mouseReleased() {
  if (circleFilling) {
    for (let i = 0; i < numCircles; i++) {
      circles.push(new Circle(mouseX, mouseY, circleSizes[i], circleColors[i]));
    }
  }
  circleFilling = false;
}

class Circle {

  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  draw() {
    fill(this.color);
    circle(this.x, this.y, this.size);
  }
}

// defines an Artwork class. This class is responsible for generating 
//the visual elements of the artwork.
class Artwork {
  constructor(positions, CirBgColor, ShapeColor) {
    this.positions = positions;
    this.CirBgColor = CirBgColor;
    this.ShapeColor = ShapeColor;

    this.circleId = [0, 1, 4, 9, 10, 11];
    this.dotId = [1, 8, 14];
    this.dotId1 = [1, 3, 6, 8, 15];
    this.ringId = [0, 4, 5, 10, 11, 13];
    this.zipId = [1, 8, 14];
    this.zipId1 = [9];
  }

  //display these components of the artwork
  display() {
    for (let i = 0; i < this.positions.length; i++) {
      let x = this.positions[i].xPos;
      let y = this.positions[i].yPos;
      //this.drawCircle(x, y, i); //draw circles at the positions specified by the positions array
      this.drawDotsIn(x, y, i); //draw dots inside the circles
      this.drawRings(x, y, i); //draws rings inside the circles
      this.drawZipLine(x, y, i); //draws lines connecting various points
      this.drawHexagons(x, y, i); //draws a chain of small circles in a hexagonal pattern
      this.drawCurves(x, y, i);//draws smooth curves based on predefined control points
    }
    //draws straight lines between two specified points
    this.drawStraightLine(188, 85, 285, 0);
    this.drawStraightLine(193, 488, 315, 405);
  }

  //draw big circles
  drawCircle(x, y, i) {
    // Draw big circles and various smaller circles inside them with different colors
    // and sizes based on their positions.
    fill(this.CirBgColor[i].Out);
    noStroke();
    ellipse(x, y, 150, 150);
    fill(181, 77, 162);
    ellipse(x, y, 85, 85);
    fill(71, 83, 63);
    ellipse(x, y, 45, 45);
    fill(0);
    ellipse(x, y, 25, 25);
    if (this.circleId.indexOf(i) !== -1) {
      fill(34, 151, 66);
      ellipse(x, y, 17, 17);
    } else {
      fill(240, 67, 32);
      ellipse(x, y, 17, 17);
    }
    fill(183, 190, 189);
    ellipse(x, y, 9, 9);
  }

  //draw dots inside of the big circle, with different patterns and colors.
  drawDotsIn(x, y, i) {
    //outer circle
    if (i !== 1 && i !== 8 && i !== 14) {
      let numCircles = 5;
      for (let j = 0; j < numCircles; j++) {
        let numDot = (j + 3.5) * 10;
        let DotRadius = 5;
        angleMode(DEGREES);
        let angle = 360 / numDot;
        for (let k = 0; k < numDot; k++) {
          let dotX = x + cos(angle * k) * (j * 7 + 45);
          let dotY = y + sin(angle * k) * (j * 7 + 45);
          fill(this.ShapeColor[i].Out);
          ellipse(dotX, dotY, DotRadius, DotRadius);
        }
      }
    }

    //mid circle
    if (this.dotId1.indexOf(i) !== -1) {
      let numCircles = 3;
      for (let j = 0; j < numCircles; j++) {
        let numDot = (j + 2.5) * 10;
        let DotRadius = 5;
        angleMode(DEGREES);
        let angle = 360 / numDot;
        for (let k = 0; k < numDot; k++) {
          let dotX = x + cos(angle * k) * (j * 7 + 25);
          let dotY = y + sin(angle * k) * (j * 7 + 25);
          fill(this.ShapeColor[i].Mid);
          ellipse(dotX, dotY, DotRadius, DotRadius);
        }
      }
    }
  }

  //draw rings inside the big circle
  //draw rings inside the big circle
  drawRings(x, y, i) {
    //draw rings at mid circle of the big circle
    if (this.ringId.indexOf(i) != -1) {
      print(i)
      for (let j = 0; j < 3; j++) {
        let radius = (j + 3) * 8;
        noFill();
        stroke(this.ShapeColor[i].Mid);
        strokeWeight(3); // Set the stroke weight to make the outer circle thicker
        ellipse(x, y, radius * 2, radius * 2);
        noStroke(); // Reset the stroke settings to their default values
      }
    }

    //draw rings at inner circle of the big circle
    for (let j = 0; j < 2; j++) {
      let radius = (j + 2.5) * 6;
      noFill();
      stroke(157, 165, 163);
      strokeWeight(3); // Set the stroke weight to make the outer circle thicker
      ellipse(x, y, radius * 2, radius * 2);
      noStroke(); // Reset the stroke settings to their default values
    }
  }

  //draw zip lines in the big circle
  drawZipLine(x, y, i) {
    //draw lines at outer circle of the big circle
    if (this.zipId.indexOf(i) !== -1) {
      let numCircles = 5;
      let curve_70 = [];
      let curve_35 = [];
      for (let j = 0; j < numCircles; j++) {
        let numDot = (j + 3.5) * 10;
        // angleMode(DEGREES);
        let angle = 360 / numDot;
        noFill();
        stroke("#ef1e1e");

        for (let k = 0; k < numDot; k++) {
          let zx = x + cos(angle * k) * (j * 7 + 45);
          let zy = y + sin(angle * k) * (j * 7 + 45);
          if (numDot > 70) {
            curve_70.push({ x: zx, y: zy });
          } else if (numDot == 35) {
            curve_35.push({ x: zx, y: zy });
          }
        }

        if (curve_70.length > 0 && curve_35.length > 0) {
          for (var qw = 0; qw < curve_70.length; qw++) {
            var num = qw / 2;
            num = Math.round(num);
            if (num >= curve_35.length - 1) {
              num = curve_35.length - 1;
            }
            line(
              curve_70[qw].x,
              curve_70[qw].y,
              curve_35[num].x,
              curve_35[num].y
            );
          }
        }
      }
    }

    if (curve_40.length > 0 && curve_25.length > 0) {
      for (var qw = 0; qw < curve_40.length; qw++) {
        var num = qw / 2;
        num = Math.round(num);
        if (num >= curve_25.length - 1) {
          num = curve_25.length - 1;
        }
        line(curve_40[qw].x, curve_40[qw].y, curve_25[num].x, curve_25[num].y);
      }
    }

    //draw lines at mid circle of the big cirlce
    if (this.zipId1.indexOf(i) !== -1 && curve_40.length == 0) {
      let numCircles = 3;

      for (let j = 0; j < numCircles; j++) {
        let numDot = (j + 2.5) * 10;
        let DotRadius = 5;
        angleMode(DEGREES);
        let angle = 360 / numDot;
        for (let k = 0; k < numDot; k++) {
          let zx = x + cos(angle * k) * (j * 7 + 25);
          let zy = y + sin(angle * k) * (j * 7 + 25);
          fill(this.ShapeColor[i].Mid);
          if (numDot == 25) {
            curve_25.push({ x: zx, y: zy });
          }
          if (numDot >= 40) {
            curve_40.push({ x: zx, y: zy });
          }
        }
      }
    }
  }

  //draw chain of small circles arranged in a hexagonal pattern.
  drawHexagons(x, y, i) {
    let hexagonRadius = 90;
    let hexagonX = x;
    let hexagonY = y;

    for (let j = 0; j < 6; j++) {
      let angle = (360 / 6) * j;
      let hx = hexagonX + hexagonRadius * cos(angle);
      let hy = hexagonY + hexagonRadius * sin(angle);

      fill(0);
      stroke(221, 97, 40);
      strokeWeight(2);
      ellipse(hx, hy, 7.5, 7.5);
    }

    for (let j = 0; j < 6; j++) {
      let angle1 = (360 / 6) * j;
      let angle2 = (360 / 6) * ((j + 1) % 6); // Next vertex
      for (let k = 0; k < 4; k++) {
        let fraction = k / 4;
        let x = lerp(
          hexagonX + hexagonRadius * cos(angle1),
          hexagonX + hexagonRadius * cos(angle2),
          fraction
        );
        let y = lerp(
          hexagonY + hexagonRadius * sin(angle1),
          hexagonY + hexagonRadius * sin(angle2),
          fraction
        );

        fill(0);
        stroke(221, 97, 40);
        strokeWeight(2);
        ellipse(x, y, 7.5, 7.5);
      }
    }

    for (let j = 0; j < 6; j++) {
      let angle = (360 / 6) * j;
      let x = hexagonX + hexagonRadius * cos(angle);
      let y = hexagonY + hexagonRadius * sin(angle);

      //draw a white inner circle inside the small circle
      fill(255);
      stroke(0);
      ellipse(x, y, 6.5, 6.5);
    }
  }

  // Draw smooth curves using given points for each curve.
  drawCurves(x, y, i) {
    noFill();
    stroke("#E93468");
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
      this.drawSmoothCurve(curve);
    });
  }

  // Draw a smooth curve connecting a series of points using bezierVertex.
  drawSmoothCurve(points) {
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

  //// Draw a straight line between two points.
  drawStraightLine(x1, y1, x2, y2) {
    stroke(255, 28, 0);
    strokeWeight(2);
    line(x1, y1, x2, y2);
  }
}

// Initialize positions, background colors, and shape colors for the big circles.
function initArtworkData() {
  //position of each big circle
  positions = [
    //redius: 75, space-between_horizontal: 20, space-between_vertical: 0
    { xPos: 75, yPos: 75 },
    { xPos: 245, yPos: 35 },
    { xPos: 415, yPos: -5 },
    { xPos: 18, yPos: 225 },
    { xPos: 188, yPos: 185 },
    { xPos: 358, yPos: 145 },
    { xPos: 528, yPos: 105 },
    { xPos: -35, yPos: 375 },
    { xPos: 135, yPos: 335 },
    { xPos: 305, yPos: 295 },
    { xPos: 475, yPos: 255 },
    { xPos: 85, yPos: 485 },
    { xPos: 255, yPos: 445 },
    { xPos: 425, yPos: 405 },
    { xPos: 595, yPos: 365 },
    { xPos: 368, yPos: 555 },
    { xPos: 538, yPos: 515 }
  ]

  //Background colors inside each big circle
  CirBgColor = [
    { Out: color(200, 230, 241) },
    { Out: color(250, 158, 7) },
    { Out: color(252, 238, 242) },
    { Out: color(252, 191, 49) },
    { Out: color(207, 241, 242) },
    { Out: color(248, 197, 56) },
    { Out: color(252, 191, 49) },
    { Out: color(221, 254, 254) },
    { Out: color(250, 158, 7) },
    { Out: color(252, 238, 242) },
    { Out: color(254, 247, 243) },
    { Out: color(252, 238, 242) },
    { Out: color(252, 191, 49) },
    { Out: color(241, 224, 76) },
    { Out: color(250, 158, 7) },
    { Out: color(252, 238, 242) },
    { Out: color(207, 241, 242) }
  ]

  //Shape colors inside each big circle
  ShapeColor = [
    //line #1
    { Out: color(15, 8, 104), Mid: color(12, 102, 50) },
    { Out: color(227, 13, 2), Mid: color(249, 81, 8) },
    { Out: color(245, 20, 2) },
    //line #2
    { Out: color(21, 95, 151), Mid: color(251, 85, 63) },
    { Out: color(15, 133, 52), Mid: color(251, 85, 63) },
    { Out: color(213, 153, 217), Mid: color(60, 146, 195) },
    { Out: color(21, 95, 151), Mid: color(249, 209, 244) },
    //line #3
    { Out: color(0, 150, 145) },
    { Out: color(227, 13, 2), Mid: color(243, 7, 11) },
    { Out: color(245, 20, 2), Mid: color(251, 85, 63) },
    { Out: color(243, 110, 9), Mid: color(12, 102, 50) },
    //line #4
    { Out: color(245, 20, 2), Mid: color(60, 146, 195) },
    { Out: color(196, 21, 90) },
    { Out: color(20, 112, 185), Mid: color(251, 85, 63) },
    { Out: color(227, 13, 2) },
    //line #5
    { Out: color(245, 20, 2), Mid: color(117, 194, 116) },
    { Out: color(15, 133, 52) }
  ]
}