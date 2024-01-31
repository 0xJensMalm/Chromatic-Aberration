const config = {
  bgColor: 20,
  baseCellSize: 40,
  cellCount: 10,
  structureTypes: ["line", "circle", "diagonal", "sineWave"],
  defaultValues: {
    structureType: "line",
    position: 0,
    scale: 0.8,
    lineThickness: 2,
    yOffset: 0,
    rotation: 0,
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

  // Iterate over all sliders for automation
  Object.keys(sliders).forEach((sliderId) => {
    if (sliderId.endsWith("Automation")) {
      let automation = sliders[sliderId];
      if (automation.isPlaying) {
        let speedPercent = parseFloat(automation.speedInput.value()) / 100;
        let actualSliderId = sliderId.replace("Automation", "");
        let slider = sliders[actualSliderId];
        let value = parseFloat(slider.value());

        let speed;
        if (actualSliderId === "rotation") {
          // For rotation, 100% speed corresponds to the previous 3
          speed = 3 * speedPercent; // No direction change for continuous rotation
          value += speed; // Continuous increment
          value %= 360; // Ensure value stays within 0-360 degrees
        } else {
          // Other sliders
          speed = Math.max(speedPercent, 0.1) * automation.direction; // Ensure a minimum speed to see movement
          switch (actualSliderId) {
            case "position":
              speed *= 10;
              break;
            case "scale":
              speed *= 0.2;
              break;
            case "lineThickness":
              speed *= 0.4;
              break;
            case "yOffset":
              speed *= 0.01;
              break;
            default:
              break; // No additional scaling needed
          }

          value += speed;

          // Reverse direction at bounds
          if (value >= slider.elt.max || value <= slider.elt.min) {
            automation.direction *= -1; // Change direction
          }
        }

        slider.value(constrain(value, slider.elt.min, slider.elt.max)); // Update slider value within bounds
      }
    }
  });

  updateStructure(); // Reflect changes
}

function createControlPanel() {
  const controlPanel = select("#control-panel");

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
    createSliderGroup(sliderContainer, id, min, max, step, label);
    if (id === "rotation") {
      // Add automation controls only next to the rotation slider for now
      createAutomationControls(sliderContainer, id);
    }
  });
}

function createSliderGroup(parent, id, min, max, step, label) {
  let groupContainer = createDiv().parent(parent).class("slider-container");
  createDiv(label + ": ")
    .parent(groupContainer)
    .class("slider-label");

  let slider = createSlider(min, max, config.defaultValues[id], step).parent(
    groupContainer
  );
  sliders[id] = slider;
  slider.input(() => updateStructure());

  let valueSpan = createSpan(config.defaultValues[id])
    .parent(groupContainer)
    .class("slider-value");
  slider.input(() => {
    valueSpan.html(slider.value());
    updateStructure();
  });

  // Add automation controls for this slider
  createAutomationControls(groupContainer, id, min, max);
}

function createAutomationControls(parent, sliderId) {
  // Check if the controls already exist to prevent duplicates for the rotation slider
  if (sliders[sliderId + "Automation"]) {
    return;
  }

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
    direction: 1, // Direction flag for back-and-forth movement
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
        -(cellSize * config.cellCount) / 2, // Adjusted to draw from new origin
        -(cellSize * config.cellCount) / 2, // Adjusted to draw from new origin
        cellSize,
        config.cellCount,
        colors[index] // Pass the color from the defined array
      ),
      centerX: centerX,
      centerY: centerY,
      rotationAngle: rotationAngle, // Set the calculated rotation angle
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
