let bgColor = 20; // A slightly lighter gray than black
let gridSize = 10; // Default size for each square in the grid
let gridOpacity = 255; // Full opacity
let gridScale = 0.46; // Grid scale (80%)
let arcInfo = []; // Array to store information for drawing arcs

// Define an array to hold grid configurations
let grids = [
  { pct: 0.25, color: [255, 0, 0, gridOpacity], lineWidth: 2, yOffset: 0 }, // Red grid
  { pct: 0.5, color: [0, 255, 0, gridOpacity], lineWidth: 2, yOffset: 0 }, // Green grid
  { pct: 0.75, color: [0, 0, 255, gridOpacity], lineWidth: 2, yOffset: 0 }, // Blue grid
];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight); // Set canvas to full window size
  canvas.parent("sketch-holder"); // Attach the canvas to the sketch-holder div
  background(bgColor);

  blendMode(ADD); // Set blend mode to ADD for color blending

  setupSlider(); // Initialize sliders
  setupOffCenterSlider();
  setupCellCountSlider();
  setupGridSizeSlider();
  setupLineThicknessSlider();
  setupOpacitySlider();

  noLoop(); // Draw only once and update on slider input

  const generateBtn = document.getElementById("generate-btn");
  generateBtn.addEventListener("click", generateSculpture);
}

function draw() {
  background(bgColor); // Clear the canvas with the background color

  blendMode(ADD); // Use additive blending for color effects

  grids.forEach(drawGrid); // Draw each grid, now including the arcs within the cells

  blendMode(BLEND); // Reset blend mode after drawing
}

function drawGrid(grid) {
  push(); // Save the current drawing state
  let gridDimension = min(width, height) * gridScale;
  let startX = width * grid.pct - gridDimension / 2;
  let startY = (height - gridDimension) / 2;
  translate(startX, startY + grid.yOffset);

  let cellSize = gridDimension / gridSize;

  stroke(grid.color);
  strokeWeight(grid.lineWidth);

  // Draw grid lines
  for (let col = 0; col <= gridSize; col++) {
    let x = col * cellSize;
    line(x, 0, x, gridDimension);
  }
  for (let row = 0; row <= gridSize; row++) {
    let y = row * cellSize;
    line(0, y, gridDimension, y);
  }

  // Draw arcs for each cell based on stored angles in arcInfo
  arcInfo.forEach((info) => {
    let cellCenterX = info.col * cellSize + cellSize / 2;
    let cellCenterY = info.row * cellSize + cellSize / 2;

    push();
    translate(cellCenterX, cellCenterY);
    rotate(info.angle);
    noFill();
    // Ensure arc spans from one corner to the opposite corner of the cell
    arc(
      -cellSize / 2,
      -cellSize / 2,
      sqrt(2) * cellSize,
      sqrt(2) * cellSize,
      0,
      PI / 2
    );
    pop();
  });

  pop(); // Restore original drawing state
}

function generateSculpture() {
  arcInfo = []; // Clear existing arc information

  for (let col = 0; col < gridSize; col++) {
    for (let row = 0; row < gridSize; row++) {
      let angle = (PI / 2) * floor(random(1, 5)); // Random angle, multiple of PI/2
      arcInfo.push({ col, row, angle });
    }
  }

  redraw(); // Trigger a redraw to show the new arcs
}

function setupSlider() {
  const gridSlider = document.getElementById("grid-slider");
  const gridSliderValue = document.getElementById("grid-slider-value"); // Get the display element for the grid slider value

  gridSlider.addEventListener("input", () => {
    const sliderValue = gridSlider.value; // Get the current value of the slider
    gridSliderValue.textContent = sliderValue; // Update the display element with the current slider value

    let adjustment = Math.abs(50 - sliderValue) / 50; // Calculate the adjustment factor
    grids[0].pct = 0.25 + 0.25 * (1 - adjustment); // Adjust grid 1 position
    grids[2].pct = 0.75 - 0.25 * (1 - adjustment); // Adjust grid 3 position

    redraw(); // Redraw the canvas with updated grid positions
  });
}

function setupOffCenterSlider() {
  const offCenterSlider = document.getElementById("off-center-slider");
  const offCenterSliderValue = document.getElementById(
    "off-center-slider-value"
  ); // Get the display element for the off-center slider value

  offCenterSlider.addEventListener("input", () => {
    const offset = int(offCenterSlider.value); // Convert the value to an integer
    offCenterSliderValue.textContent = offset; // Update the display element with the current slider value

    // Adjust the y positions of grids 1 and 3
    grids[0].yOffset = -offset; // Move grid 1 up
    grids[2].yOffset = offset; // Move grid 3 down

    redraw(); // Redraw the canvas with updated positions
  });
}

function setupCellCountSlider() {
  const cellCountSlider = document.getElementById("cell-count-slider");
  const cellCountValue = document.getElementById("cell-count-value");

  cellCountSlider.addEventListener("input", () => {
    gridSize = parseInt(cellCountSlider.value); // Now controls the number of cells
    cellCountValue.textContent = gridSize;
    redraw(); // Redraw the canvas with the updated cell count
  });
}

function setupGridSizeSlider() {
  const gridSizeSlider = document.getElementById("grid-size-slider");
  const gridSizeValue = document.getElementById("grid-size-value");

  gridSizeSlider.addEventListener("input", () => {
    gridScale = parseInt(gridSizeSlider.value) / 100; // Converts value to a scale factor
    gridSizeValue.textContent = gridSizeSlider.value + "%"; // Display the percentage
    redraw(); // Redraw the canvas with the updated grid size
  });
}

function setupLineThicknessSlider() {
  const lineThicknessSlider = document.getElementById("line-thickness-slider");
  const lineThicknessValue = document.getElementById("line-thickness-value");

  lineThicknessSlider.addEventListener("input", () => {
    grids.forEach(
      (grid) => (grid.lineWidth = parseInt(lineThicknessSlider.value))
    );
    lineThicknessValue.textContent = lineThicknessSlider.value;
    redraw(); // Redraw the canvas with the updated line thickness
  });
}

function setupOpacitySlider() {
  const opacitySlider = document.getElementById("opacity-slider");
  const opacityValue = document.getElementById("opacity-value");

  opacitySlider.addEventListener("input", () => {
    gridOpacity = parseInt(opacitySlider.value);
    opacityValue.textContent = gridOpacity;
    grids.forEach((grid) => (grid.color[3] = gridOpacity)); // Update the opacity component of each grid's color
    redraw(); // Redraw the canvas with the updated opacity
  });
}

// Add yOffset property to each grid object in the grids array
grids.forEach((grid) => (grid.yOffset = 0));

// Add event listener for the button
document
  .getElementById("generate-btn")
  .addEventListener("click", generateSculpture);

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize canvas to new window dimensions
  background(bgColor); // Redraw background when window is resized
}
