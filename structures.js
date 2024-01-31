class Structure {
  constructor(x, y, cellSize, cellCount, color) {
    this.x = x;
    this.y = y;
    this.cellSize = cellSize;
    this.cellCount = cellCount;
    this.color = color;
  }

  drawGrid() {
    push();
    stroke(0);
    for (let i = 0; i <= this.cellCount; i++) {
      let x = this.x + i * this.cellSize;
      let y = this.y + i * this.cellSize;
      line(x, this.y, x, this.y + this.cellSize * this.cellCount);
      line(this.x, y, this.x + this.cellSize * this.cellCount, y);
    }
    pop();
  }
}

class LineStructure extends Structure {
  draw() {
    push();
    stroke(this.color); // Use the assigned RGB color for each structure
    strokeWeight(sliders.lineThickness.value());

    // Directly draw a simple grid within the structure's area
    for (let i = 0; i <= this.cellCount; i++) {
      let offsetX = this.x + i * this.cellSize;
      let offsetY = this.y + i * this.cellSize;

      // Horizontal lines
      line(this.x, offsetY, this.x + this.cellSize * this.cellCount, offsetY);
      // Vertical lines
      line(offsetX, this.y, offsetX, this.y + this.cellSize * this.cellCount);
    }
    pop();
  }
}

class CircleStructure extends Structure {
  draw() {
    push();
    fill(this.color);
    noStroke();
    for (let i = 0; i < this.cellCount; i++) {
      for (let j = 0; j < this.cellCount; j++) {
        let x = this.x + i * this.cellSize + this.cellSize / 2;
        let y = this.y + j * this.cellSize + this.cellSize / 2;
        ellipse(x, y, this.cellSize * 0.8);
      }
    }
    pop();
  }
}

class DiagonalLineStructure extends Structure {
  draw() {
    push();
    stroke(this.color);
    strokeWeight(sliders.lineThickness.value());
    for (let i = 0; i < this.cellCount; i++) {
      for (let j = 0; j < this.cellCount; j++) {
        let x = this.x + i * this.cellSize;
        let y = this.y + j * this.cellSize;
        line(x, y, x + this.cellSize, y + this.cellSize);
      }
    }
    pop();
  }
}

class SineWaveStructure extends Structure {
  draw() {
    push();
    stroke(this.color);
    strokeWeight(sliders.lineThickness.value());
    noFill();

    const amplitude = this.cellSize * 0.5; // Height of wave peaks
    const frequency = TWO_PI / (this.cellSize * 4); // Number of waves

    for (let i = 0; i < this.cellCount; i++) {
      beginShape();
      for (let j = 0; j <= this.cellCount * this.cellSize; j += 5) {
        // Increment by a smaller step for smoother wave
        const x = this.x + j;
        const y = this.y + i * this.cellSize + amplitude * sin(frequency * j);
        vertex(x, y);
      }
      endShape();
    }
    pop();
  }
}
