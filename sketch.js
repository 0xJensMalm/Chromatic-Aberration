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
  },
};
let structures = [];
let sliders = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  createControlPanel();
  updateStructure();
}

function draw() {
  background(config.bgColor);
  blendMode(ADD);
  structures.forEach((structure) => structure.draw());
  blendMode(BLEND);
}

function createControlPanel() {
  const controlPanel = select("#control-panel");

  // Structure Dropdown
  const structureDropdown = createSelect().parent(controlPanel);
  config.structureTypes.forEach((type) => {
    const optionName = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize first letter
    structureDropdown.option(optionName, type);
  });
  structureDropdown.selected(config.defaultValues.structureType);
  structureDropdown.changed(onStructureChange);

  // Sliders
  const sliderData = [
    { id: "position", min: 0, max: 100, step: 1, label: "Position" },
    { id: "scale", min: 0.5, max: 2, step: 0.01, label: "Scale" },
    {
      id: "lineThickness",
      min: 1,
      max: 10,
      step: 0.1,
      label: "Line Thickness",
    },
    {
      id: "yOffset",
      min: -0.02,
      max: 0.02,
      step: 0.001,
      label: "Vertical Offset",
    },
  ];

  sliderData.forEach(({ id, min, max, step, label }) => {
    let container = createDiv(label + ": ")
      .parent(controlPanel)
      .style("margin", "4px 0");
    sliders[id] = createSlider(min, max, config.defaultValues[id], step).parent(
      container
    );
    sliders[id].input(() => updateStructure()); // Update structure on slider input

    // Create a span to display the slider's value
    sliders[id].valueSpan = createSpan(config.defaultValues[id]).parent(
      container
    );
    sliders[id].input(() => {
      sliders[id].valueSpan.html(sliders[id].value());
      updateStructure();
    });
  });
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

  // Calculate positions based on the slider value
  // For a smooth transition, the mapping should be direct and linear without jumps
  let positions = [
    map(positionValue, 0, 100, 0.25, 0.75), // Map for the left structure
    0.5, // Center structure remains static
    map(positionValue, 0, 100, 0.75, 0.25), // Map for the right structure
  ];

  positions.forEach((posX, index) => {
    let x = width * posX - (cellSize * config.cellCount) / 2;
    let y = height / 2 - (cellSize * config.cellCount) / 2;
    y += index === 0 ? -height * yOffset : index === 2 ? height * yOffset : 0;

    const color = [
      "rgba(255, 0, 0, 100)",
      "rgba(0, 255, 0, 100)",
      "rgba(0, 0, 255, 100)",
    ][index];
    structures.push(
      structureFactory(
        config.defaultValues.structureType,
        x,
        y,
        cellSize,
        config.cellCount,
        color
      )
    );
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
