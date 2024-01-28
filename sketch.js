let bgColor = 50; // A slightly lighter gray than black
let gridSize = 20; // Base size for each square in the grid
let gridOpacity = 255; // Full opacity

// Define an array to hold grid configurations
let grids = [
  { pct: 0.25, color: [255, 0, 0, gridOpacity], lineWidth: 2, yOffset: 0 }, // Red grid
  { pct: 0.5, color: [0, 255, 0, gridOpacity], lineWidth: 2, yOffset: 0 }, // Green grid
  { pct: 0.75, color: [0, 0, 255, gridOpacity], lineWidth: 2, yOffset: 0 }, // Blue grid
];

function setup() {
  let canvas = createCanvas(windowWidth * 0.8, windowHeight * 0.8);
  canvas.parent("sketch-holder");
  background(bgColor);

  blendMode(ADD); // Set blend mode to ADD for color blending

  setupSlider(); // Initialize sliders
  setupOffCenterSlider();
  setupGridSizeSlider();
  setupLineThicknessSlider();
  setupOpacitySlider();

  noLoop(); // Draw only once and update on slider input
}

function draw() {
  background(bgColor); // Clear the canvas
  blendMode(ADD); // Set blend mode to ADD for color blending
  grids.forEach(drawGrid); // Draw each grid based on its configuration
  blendMode(BLEND); // Reset blend mode
}

function drawGrid(grid) {
  push(); // Save the current drawing style settings and transformations
  let gridWidth = width * 0.8; // Adjust the grid width if necessary
  let gridHeight = height * 0.8; // Adjust the grid height if necessary
  let startX = width * grid.pct - gridWidth / 2; // Calculate the starting X position
  translate(startX, height / 2 + grid.yOffset); // Position the grid

  let numCols = gridSize; // Use gridSize for the number of columns
  let numRows = gridSize; // Use gridSize for the number of rows
  let cellWidth = gridWidth / numCols; // Width of each cell
  let cellHeight = gridHeight / numRows; // Height of each cell

  stroke(grid.color); // Set grid color
  strokeWeight(grid.lineWidth); // Set line width

  // Draw columns
  for (let col = 0; col <= numCols; col++) {
    let x = col * cellWidth;
    line(x, 0, x, gridHeight); // Draw vertical line within the grid height
  }

  // Draw rows
  for (let row = 0; row <= numRows; row++) {
    let y = row * cellHeight;
    line(0, y, gridWidth, y); // Draw horizontal line within the grid width
  }

  pop(); // Restore the settings
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

function setupGridSizeSlider() {
  const gridSizeSlider = document.getElementById("grid-size-slider");
  const gridSizeValue = document.getElementById("grid-size-value");

  gridSizeSlider.addEventListener("input", () => {
    gridSize = parseInt(gridSizeSlider.value); // Update gridSize to control the number of rows and columns
    gridSizeValue.textContent = gridSize;
    redraw(); // Redraw the canvas with the updated grid structure
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
  resizeCanvas(windowWidth * 0.8, windowHeight * 0.8);
  background(bgColor); // Ensure the background is redrawn correctly after resizing
}
