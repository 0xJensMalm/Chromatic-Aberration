let currentStructure; // Holds the currently selected structure
let structureType = "line"; // Default structure type is 'line'
let structures = []; // Array to hold the three structure instances
let thicknessSlider;
let offsetSlider;

let bgColor = 20;
let lineThickness = 2; // Default line thickness

function setup() {
  createCanvas(windowWidth, windowHeight); // Set canvas size to fill the screen
  noLoop(); // Draw only once and update on dropdown change

  // Dropdown menu for selecting the structure type
  const structureDropdown = createSelect();
  structureDropdown.position(10, 10);
  structureDropdown.option("Line Grid", "line");
  structureDropdown.option("Circles", "circle");
  structureDropdown.option("Diagonal Lines", "diagonal");

  structureDropdown.selected("line"); // Set 'line' as the default selected value
  structureDropdown.changed(onStructureChange);

  // Position Slider
  positionSlider = createSlider(0, 100, 0); // Start at 0, range up to 100
  positionSlider.position(10, 40);
  positionSlider.input(() => redraw()); // Redraw when the slider is moved

  // Scale Slider
  // Scale Slider
  scaleSlider = createSlider(0.5, 2, 0.8, 0.01); //
  scaleSlider.position(10, 80);
  scaleSlider.input(() => redraw()); // Redraw when the slider is moved

  // Line Thickness Slider
  thicknessSlider = createSlider(1, 10, 2); // Range from 1 to 10, default at 2
  thicknessSlider.position(10, 120);
  thicknessSlider.input(() => {
    lineThickness = thicknessSlider.value();
    redraw(); // Redraw when the slider is moved
  });

  // Offset Slider
  offsetSlider = createSlider(-0.02, 0.02, 0, 0.001); // Range with a small step for precise control
  offsetSlider.position(10, 160); // Adjust the position as needed
  offsetSlider.input(() => redraw()); // Redraw when the slider is moved

  updateStructure(); // Initialize structures
}

function draw() {
  background(bgColor);
  blendMode(ADD);
  updateSliderValues();
  structures.forEach((structure) => {
    structure.draw(); // Draw each structure in the array
  });

  blendMode(BLEND); // Reset blend mode to default
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
      structures.push(new LineStructure(x, y, cellSize, cellCount, color));
    } else if (structureType === "circle") {
      structures.push(new CircleStructure(x, y, cellSize, cellCount, color));
    } else if (structureType === "diagonal") {
      structures.push(
        new DiagonalLineStructure(x, y, cellSize, cellCount, color)
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
