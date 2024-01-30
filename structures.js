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
  draw() {
    push();
    stroke(this.color);
    strokeWeight(lineThickness);
    for (let i = 0; i <= this.cellCount; i++) {
      let x = this.x + i * this.cellSize;
      let y = this.y + i * this.cellSize;
      line(x, this.y, x, this.y + this.cellSize * this.cellCount); // Vertical lines
      line(this.x, y, this.x + this.cellSize * this.cellCount, y); // Horizontal lines
    }
    pop();
  }
}

// CircleStructure subclass
class CircleStructure extends Structure {
  draw() {
    push();
    fill(this.color); // Use the color provided in the constructor
    noStroke();
    for (let i = 0; i < this.cellCount; i++) {
      for (let j = 0; j < this.cellCount; j++) {
        let x = this.x + i * this.cellSize + this.cellSize / 2;
        let y = this.y + j * this.cellSize + this.cellSize / 2;
        ellipse(x, y, this.cellSize * 0.8); // Circle in each cell
      }
    }
    pop();
  }
}

class DiagonalLineStructure extends Structure {
  draw() {
    push();
    stroke(this.color);
    strokeWeight(lineThickness);
    for (let i = 0; i < this.cellCount; i++) {
      for (let j = 0; j < this.cellCount; j++) {
        let x = this.x + i * this.cellSize;
        let y = this.y + j * this.cellSize;
        line(x, y, x + this.cellSize, y + this.cellSize); // Diagonal line from top-left to bottom-right
      }
    }
    pop();
  }
}
