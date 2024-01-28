let bgColor = 50; // A slightly lighter gray than black
let gridSize = 20; // Base size for each square in the grid
let gridOpacity = 255; // halfway between transparent and opaque

let grids = [
  { pct: 0.25, color: [255, 0, 0, gridOpacity], lineWidth: 2 }, // Red grid with opacity
  { pct: 0.5, color: [0, 255, 0, gridOpacity], lineWidth: 2 }, // Green grid with opacity
  { pct: 0.75, color: [0, 0, 255, gridOpacity], lineWidth: 2 }, // Blue grid with opacity
];

function setup() {
  let canvas = createCanvas(windowWidth * 0.8, windowHeight * 0.8);
  canvas.parent("sketch-holder");
  background(bgColor);

  blendMode(ADD); //additive

  setupSlider(); // Initialize the main slider
  setupOffCenterSlider(); // Initialize the off-center slider
  setupGridSizeSlider();
  setupLineThicknessSlider();
  setupOpacitySlider();

  noLoop(); // No continuous drawing
}

function draw() {
  blendMode(BLEND); // Use default blend mode to clear the canvas properly
  background(bgColor); // Clear the canvas with the background color

  blendMode(ADD); // Switch to additive blend mode for drawing grids
  grids.forEach(drawGrid); // Draw each grid
  blendMode(BLEND); // Switch back to default blend mode after drawing
}

function drawGrid(grid, index) {
  push(); // Start a new drawing state
  let xPos = width * grid.pct; // Calculate x position based on percentage
  let yPos = height / 2 + grid.yOffset; // Apply the yOffset to vertically center
  translate(xPos, yPos);
  stroke(grid.color); // Set the grid color including opacity
  strokeWeight(grid.lineWidth); // Set the line width
  noFill(); // Don't fill the squares

  for (let i = 0; i < 10; i++) {
    let size = gridSize * (i + 1); // Use gridSize to determine the size of each square
    rect(-size / 2, -size / 2, size, size); // Draw square centered at the current position
  }
  pop(); // Restore original drawing state
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
    gridSize = parseInt(gridSizeSlider.value);
    gridSizeValue.textContent = gridSize;
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
  resizeCanvas(windowWidth * 0.8, windowHeight * 0.8);
  background(bgColor); // Ensure the background is redrawn correctly after resizing
}
