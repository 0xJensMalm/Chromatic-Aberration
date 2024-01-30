// Base structure class
class Structure {
  constructor(x, y, cellSize, cellCount, color) {
    this.x = x;
    this.y = y;
    this.cellSize = cellSize;
    this.cellCount = cellCount;
    this.color = color; // Add color to the constructor
  }

  drawGrid() {
    push();
    stroke(0);
    for (let i = 0; i <= this.cellCount; i++) {
      let x = this.x + i * this.cellSize;
      let y = this.y + i * this.cellSize;
      line(x, this.y, x, this.y + this.cellSize * this.cellCount); // Vertical lines
      line(this.x, y, this.x + this.cellSize * this.cellCount, y); // Horizontal lines
    }
    pop();
  }
}

// LineStructure subclass
class LineStructure extends Structure {
  constructor(x, y, cellSize, cellCount, color, index) {
    super(x, y, cellSize, cellCount, color);
    this.index = index;
  }

  draw() {
    push();
    translate(
      this.x + (this.cellSize * this.cellCount) / 2,
      this.y + (this.cellSize * this.cellCount) / 2
    );
    let angle =
      this.index === 0 || this.index === 2
        ? map(rotationSlider.value(), 1, 100, -PI, PI) * (this.index - 1)
        : 0;

    rotate(angle);
    translate(
      (-this.cellSize * this.cellCount) / 2,
      (-this.cellSize * this.cellCount) / 2
    );
    stroke(this.color);
    strokeWeight(lineThickness);
    for (let i = 0; i <= this.cellCount; i++) {
      let x = i * this.cellSize;
      let y = i * this.cellSize;
      line(x, 0, x, this.cellSize * this.cellCount);
      line(0, y, this.cellSize * this.cellCount, y);
    }
    pop();
  }
}

class CircleStructure extends Structure {
  constructor(x, y, cellSize, cellCount, color, index) {
    super(x, y, cellSize, cellCount, color);
    this.index = index;
  }

  draw() {
    push();
    translate(
      this.x + (this.cellSize * this.cellCount) / 2,
      this.y + (this.cellSize * this.cellCount) / 2
    );
    let angle =
      this.index === 0 || this.index === 2
        ? map(rotationSlider.value(), 1, 100, -PI, PI) * (this.index - 1)
        : 0;

    rotate(angle);
    translate(
      (-this.cellSize * this.cellCount) / 2,
      (-this.cellSize * this.cellCount) / 2
    );
    fill(this.color);
    noStroke();
    for (let i = 0; i < this.cellCount; i++) {
      for (let j = 0; j < this.cellCount; j++) {
        let x = i * this.cellSize + this.cellSize / 2;
        let y = j * this.cellSize + this.cellSize / 2;
        ellipse(x, y, this.cellSize * 0.8);
      }
    }
    pop();
  }
}

class DiagonalLineStructure extends Structure {
  constructor(x, y, cellSize, cellCount, color, index) {
    super(x, y, cellSize, cellCount, color);
    this.index = index;
  }

  draw() {
    push();
    translate(
      this.x + (this.cellSize * this.cellCount) / 2,
      this.y + (this.cellSize * this.cellCount) / 2
    );
    let angle =
      this.index === 0 || this.index === 2
        ? map(rotationSlider.value(), 1, 100, -PI, PI) * (this.index - 1)
        : 0;
    rotate(angle);
    translate(
      (-this.cellSize * this.cellCount) / 2,
      (-this.cellSize * this.cellCount) / 2
    );
    stroke(this.color);
    strokeWeight(lineThickness);
    for (let i = 0; i < this.cellCount; i++) {
      for (let j = 0; j < this.cellCount; j++) {
        let x = i * this.cellSize;
        let y = j * this.cellSize;
        line(x, y, x + this.cellSize, y + this.cellSize);
      }
    }
    pop();
  }
}
