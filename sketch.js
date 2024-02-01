const config = {
  bgColor: 20,
  baseCellSize: 40,
  cellCount: 10, // This now becomes the default starting cell count
  maxCellCount: 100, // New attribute to define the maximum cell count
  structureTypes: ["line", "circle", "diagonal", "sineWave"],
  defaultValues: {
    structureType: "circle",
    position: 0,
    scale: 0.8,
    lineThickness: 2,
    yOffset: 0,
    rotation: 0,
    cellCount: 10, // Default value for the new cell count slider
  },
};

let structures = [];
let sliders = {};
let isPlaying = false;
let rotationSpeed = 1; // Default speed

function setup() {
  createCanvas(windowWidth, windowHeight);
  createControlPanel();
  updateStructure();
}

function draw() {
  background(config.bgColor);
  blendMode(ADD);
  structures.forEach(({ structure, centerX, centerY, rotationAngle }) => {
    push();
    translate(centerX, centerY);
    rotate(rotationAngle);
    structure.draw();
    pop();
  });
  blendMode(BLEND);

  // Rotate automation
  if (sliders.rotationAutomation && sliders.rotationAutomation.isPlaying) {
    let automation = sliders.rotationAutomation;
    let speedPercent = parseFloat(automation.speedInput.value()) / 100;
    let speed = 3 * speedPercent; // 100% speed corresponds to the previous 3
    let value = parseFloat(sliders.rotation.value());
    value += speed; // Continuous increment
    value %= 360; // Ensure value stays within 0-360 degrees
    sliders.rotation.value(
      constrain(value, sliders.rotation.elt.min, sliders.rotation.elt.max)
    ); // Update slider value within bounds
    updateStructure(); // Reflect changes
  }
}

function createControlPanel() {
  const controlPanel = select("#control-panel");
  const slidersContainer = createDiv()
    .parent(controlPanel)
    .id("sliders-container");

  // Structure Dropdown
  const structureDropdown = createSelect().parent(controlPanel);
  config.structureTypes.forEach((type) => {
    const optionName = type.charAt(0).toUpperCase() + type.slice(1);
    structureDropdown.option(optionName, type);
  });
  structureDropdown.selected(config.defaultValues.structureType);
  structureDropdown.changed(onStructureChange);

  // Sliders
  const sliderData = [
    { id: "position", min: 0, max: 100, step: 1, label: "Position" },
    { id: "scale", min: 0.5, max: 2, step: 0.01, label: "Scale" },
    { id: "lineThickness", min: 1, max: 10, step: 0.1, label: "Thickness" },
    { id: "yOffset", min: -0.02, max: 0.02, step: 0.001, label: "Offset" },
    { id: "rotation", min: 0, max: 360, step: 0.01, label: "Rotation" },
  ];

  sliderData.forEach(({ id, min, max, step, label }) => {
    let sliderContainer = createDiv()
      .parent(controlPanel)
      .class("slider-container");
    createDiv(label + ": ")
      .parent(sliderContainer)
      .class("slider-label");
    let slider = createSlider(min, max, config.defaultValues[id], step).parent(
      sliderContainer
    );
    sliders[id] = slider;
    slider.input(() => updateStructure());

    let valueSpan = createSpan(config.defaultValues[id])
      .parent(sliderContainer)
      .class("slider-value");
    slider.input(() => {
      valueSpan.html(slider.value());
      updateStructure();
    });

    if (id === "rotation") {
      // Add automation controls only next to the rotation slider
      createAutomationControls(sliderContainer, id);
    }
  });
  // New Cell Count Slider
  let cellCountContainer = createDiv()
    .parent(slidersContainer)
    .class("slider-container");
  createDiv("Cell Count: ").parent(cellCountContainer).class("slider-label");
  let cellCountSlider = createSlider(
    10,
    config.maxCellCount,
    config.defaultValues.cellCount,
    1
  ).parent(cellCountContainer);
  sliders["cellCount"] = cellCountSlider;
  cellCountSlider.input(() => updateStructure());

  let cellCountValueSpan = createSpan(config.defaultValues.cellCount)
    .parent(cellCountContainer)
    .class("slider-value");
  cellCountSlider.input(() => {
    cellCountValueSpan.html(cellCountSlider.value());
    updateStructure();
  });

  // Centralize Button
  let centralizeButton = createButton("Centralize").parent(controlPanel);
  centralizeButton.mousePressed(() => {
    // Set the position slider to 50 and update the structure
    sliders.position.value(50);
    updateStructure();
  });

  // Ensure the value display for the position slider is also updated
  sliders.position.input(() => {
    let valueSpan = select(".slider-value", sliders.position.parent());
    if (valueSpan) {
      valueSpan.html(sliders.position.value());
    }
    updateStructure();
  });
}

function createAutomationControls(parent, sliderId) {
  let automationContainer = createDiv()
    .parent(parent)
    .class("automation-controls");

  // Speed Input
  createDiv("Speed: ").parent(automationContainer).style("margin-right", "5px");
  let speedInput = createInput("10", "text")
    .parent(automationContainer)
    .style("width", "50px");

  // Play/Pause Button
  let playPauseButton = createButton("Play")
    .parent(automationContainer)
    .style("margin-left", "10px")
    .mousePressed(() => togglePlayPause(sliderId));

  // Store automation controls
  sliders[sliderId + "Automation"] = {
    speedInput: speedInput,
    playPauseButton: playPauseButton,
    isPlaying: false,
  };
}

function togglePlayPause(sliderId) {
  let automation = sliders[sliderId + "Automation"];
  automation.isPlaying = !automation.isPlaying;
  automation.playPauseButton.html(automation.isPlaying ? "Pause" : "Play");
}

function onStructureChange() {
  config.defaultValues.structureType = this.value();
  updateStructure();
}
function updateStructure() {
  structures = [];
  const cellSize = config.baseCellSize * sliders.scale.value();
  const yOffset = sliders.yOffset.value();
  const positionValue = sliders.position.value();
  const rotationValue = sliders.rotation.value(); // Get the rotation value from the slider
  const cellCount = sliders.cellCount.value(); // Use the new cell count slider value

  // Define colors for each structure
  const colors = [
    "rgba(255, 0, 0, 100)",
    "rgba(0, 255, 0, 100)",
    "rgba(0, 0, 255, 100)",
  ];

  // Calculate positions based on the slider value for a smooth transition
  let positions = [
    map(positionValue, 0, 100, 0.25, 0.75), // Map for the left structure
    0.5, // Center structure remains static
    map(positionValue, 0, 100, 0.75, 0.25), // Map for the right structure
  ];

  positions.forEach((posX, index) => {
    // Calculate the center position for each structure
    let centerX = width * posX;
    let centerY =
      height / 2 +
      (index === 0 ? -height * yOffset : index === 2 ? height * yOffset : 0);

    // Determine rotation angle: middle structure stays still, outer structures rotate in opposite directions
    let rotationAngle = 0; // Default rotation for the middle structure
    if (index === 0) {
      rotationAngle = radians(rotationValue); // Rotate the first structure clockwise
    } else if (index === 2) {
      rotationAngle = -radians(rotationValue); // Rotate the third structure counter-clockwise
    }

    // Store the structure along with its center position and rotation angle
    structures.push({
      structure: structureFactory(
        config.defaultValues.structureType,
        -(cellSize * cellCount) / 2, // Adjusted to use the new cell count value
        -(cellSize * cellCount) / 2, // Adjusted to use the new cell count value
        cellSize,
        cellCount, // Use the new cell count slider value
        colors[index]
      ),
      centerX: centerX,
      centerY: centerY,
      rotationAngle: rotationAngle,
    });
  });

  redraw();
}

function structureFactory(type, x, y, cellSize, cellCount, color) {
  switch (type) {
    case "line":
      return new LineStructure(x, y, cellSize, cellCount, color);
    case "circle":
      return new CircleStructure(x, y, cellSize, cellCount, color);
    case "diagonal":
      return new DiagonalLineStructure(x, y, cellSize, cellCount, color);
    case "sineWave":
      return new SineWaveStructure(x, y, cellSize, cellCount, color);
    default:
      throw new Error("Unknown structure type: " + type);
  }
}
