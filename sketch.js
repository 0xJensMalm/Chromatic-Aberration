let currentStructure; // Holds the currently selected structure
let structureType = "line"; // Default structure type is 'line'
let structures = []; // Array to hold the three structure instances
let thicknessSlider;
let offsetSlider;

let rotationSlider;
let rotationSpeedSlider;
let playButton;
let isPlaying = false;
let currentRotationAngle = 0; // Global variable to track the rotation angle

let bgColor = 20;
let lineThickness = 2; // Default line thickness

function setup() {
  createCanvas(windowWidth, windowHeight); // Ensure the canvas fills the body

  // Select the control panel div
  const controlPanel = select("#control-panel");

  // Create and append the structure type dropdown to the control panel
  const structureDropdown = createSelect().parent(controlPanel);
  structureDropdown.option("Line Grid", "line");
  structureDropdown.option("Circles", "circle");
  structureDropdown.option("Diagonal Lines", "diagonal");
  structureDropdown.selected("line");
  structureDropdown.changed(onStructureChange);

  // Create and append the reset button to the control panel
  const resetButton = createButton("Reset").parent(controlPanel);
  resetButton.mousePressed(resetValues);

  // Create and append sliders to the control panel
  positionSlider = createSlider(0, 100, 0).parent(controlPanel);
  scaleSlider = createSlider(0.5, 2, 0.8, 0.01).parent(controlPanel);
  thicknessSlider = createSlider(1, 10, 2).parent(controlPanel);
  offsetSlider = createSlider(-0.02, 0.02, 0, 0.001).parent(controlPanel);
  rotationSlider = createSlider(1, 100, 50, 0.01).parent(controlPanel); // Initialize with a default value of 50
  rotationSpeedSlider = createSlider(0, 100, 50).parent(controlPanel); // Default speed set to mid-range

  // Add input listeners to redraw the sketch when sliders are adjusted
  positionSlider.input(() => redraw());
  scaleSlider.input(() => redraw());
  thicknessSlider.input(() => redraw());
  offsetSlider.input(() => redraw());
  rotationSlider.input(() => redraw());
  rotationSpeedSlider.input(() => redraw()); // Optional: Redraw when speed is adjusted

  playButton = createButton("Play").parent(controlPanel);
  playButton.mousePressed(togglePlayPause); // Function to toggle play/pause state

  // Initialize structures
  updateStructure();
}

function draw() {
  background(bgColor);
  blendMode(ADD);

  if (isPlaying) {
    let speed = map(rotationSpeedSlider.value(), 0, 100, 0, TWO_PI / 60); // Full rotation over 60 frames at max speed
    currentRotationAngle += speed;

    // Update rotationSlider's value based on currentRotationAngle
    let sliderValue = map(currentRotationAngle % TWO_PI, 0, TWO_PI, 1, 100);
    rotationSlider.value(sliderValue);
  }

  structures.forEach((structure) => {
    structure.draw();
  });

  blendMode(BLEND);
  updateSliderValues();
}

function onStructureChange() {
  structureType = this.value(); // Update the structure type based on the dropdown selection
  updateStructure();
  redraw(); // Redraw the canvas with the new structures
}

let positionSlider, scaleSlider; // Sliders
let positionOffset = 0,
  cellScale = 1; // Default values for slider-controlled properties

function updateStructure() {
  structures = []; // Clear existing structures
  const baseCellSize = 40; // Base cell size before scaling
  const cellSize = baseCellSize * cellScale; // Apply scale to cell size
  const cellCount = 10;
  const yOffset = offsetSlider.value(); // Get the current value from the offset slider

  let sliderValue = positionSlider.value();
  let pct1 = map(sliderValue, 0, 100, 0.25, 0.75); // From 25% to 75%
  let pct3 = map(sliderValue, 0, 100, 0.75, 0.25); // From 75% to 25%
  let positions = [pct1, 0.5, pct3]; // Middle structure always at 50%

  positions.forEach((posX, index) => {
    const x = width * posX - (cellSize * cellCount) / 2;
    let y = height / 2 - (cellSize * cellCount) / 2; // Default vertical position

    // Apply vertical offset to the first and third structures
    if (index === 0) y -= height * yOffset; // Move first structure up
    if (index === 2) y += height * yOffset; // Move third structure down

    const color = [
      "rgba(255, 0, 0, 100)",
      "rgba(0, 255, 0, 100)",
      "rgba(0, 0, 255, 100)",
    ][index];

    // Create the structure based on the selected type
    if (structureType === "line") {
      structures.push(
        new LineStructure(x, y, cellSize, cellCount, color, index)
      );
    } else if (structureType === "circle") {
      structures.push(
        new CircleStructure(x, y, cellSize, cellCount, color, index)
      );
    } else if (structureType === "diagonal") {
      structures.push(
        new DiagonalLineStructure(x, y, cellSize, cellCount, color, index)
      );
    }
  });
}
function updateSliderValues() {
  positionOffset = positionSlider.value();
  cellScale = scaleSlider.value();

  // Display slider values
  fill(255);
  noStroke();
  textSize(12);
  text(
    `Position: ${positionOffset}`,
    positionSlider.x + positionSlider.width + 10,
    positionSlider.y + 10
  );
  text(
    `Scale: ${cellScale.toFixed(2)}`,
    scaleSlider.x + scaleSlider.width + 10,
    scaleSlider.y + 10
  ); // Use toFixed(2) for precision display

  // Display line thickness slider value
  lineThickness = thicknessSlider.value();
  text(
    `Line Thickness: ${lineThickness}`,
    thicknessSlider.x + thicknessSlider.width + 10,
    thicknessSlider.y + 10
  );
  // Display offset slider value
  text(
    `Vertical Offset: ${offsetSlider.value().toFixed(3)}`,
    offsetSlider.x + offsetSlider.width + 10,
    offsetSlider.y + 10
  ); // Use toFixed(3) for precision

  // Re-calculate structure positions and cell sizes
  updateStructure();
}

function resetValues() {
  // Reset sliders to default values
  positionSlider.value(0); // Default position
  scaleSlider.value(0.8); // Default scale
  thicknessSlider.value(2); // Default line thickness
  offsetSlider.value(0); // Default vertical offset

  // Reset any other settings if needed
  // For example, resetting the selected structure type to 'line'
  structureType = "line";
  const structureDropdown = select("#pattern-chooser"); // Assuming your dropdown has an id 'pattern-chooser'
  structureDropdown.selected("line");

  // Redraw the canvas to reflect the reset state
  redraw();
}

function togglePlayPause() {
  isPlaying = !isPlaying; // Toggle the play state
  playButton.html(isPlaying ? "Pause" : "Play"); // Update button text based on state

  if (isPlaying) {
    loop(); // Resume the draw loop if playing
    rotationSlider.attribute("disabled", ""); // Disable the rotation slider
    rotationSlider.style("background-color", "#ccc"); // Change to grey color
  } else {
    noLoop(); // Stop the draw loop if paused
    rotationSlider.removeAttribute("disabled"); // Enable the rotation slider
    rotationSlider.style("background-color", ""); // Reset background color
  }
}
