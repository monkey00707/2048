var rotateLeft = (matrix) => {
  const rows = matrix.length;
  const columns = matrix[0].length;
  let res = Array.from({ length: rows }, () => []);

  for (let row = 0; row < rows; ++row) {
    for (let column = 0; column < columns; ++column) {
      res[row][column] = matrix[column][columns - row - 1];
    }
  }
  return res;
};

class Tile {
  constructor(value = 0, row = -1, column = -1) {
    this.value = value;
    this.row = row;
    this.column = column;
    this.oldRow = -1;
    this.oldColumn = -1;
    this.markForDeletion = false;
    this.mergedInto = null;
    this.id = Tile.nextId++;
  }
  moveTo(row, column) {
    this.oldRow = this.row;
    this.oldColumn = this.column;
    this.row = row;
    this.column = column;
  }
  isNew() {
    return this.oldRow === -1 && !this.mergedInto;
  }
  hasMoved() {
    return (
      (this.fromRow() !== -1 &&
        (this.fromRow() !== this.toRow() || this.fromColumn() !== this.toColumn())) ||
      this.mergedInto
    );
  }
  fromRow() {
    return this.mergedInto ? this.row : this.oldRow;
  }
  fromColumn() {
    return this.mergedInto ? this.column : this.oldColumn;
  }
  toRow() {
    return this.mergedInto ? this.mergedInto.row : this.row;
  }
  toColumn() {
    return this.mergedInto ? this.mergedInto.column : this.column;
  }
}
Tile.nextId = 0;

class Board {
  constructor() {
    this.tiles = [];
    this.cells = Array.from({ length: 4 }, () => Array(4).fill(null).map(() => this.addTile()));
    this.score = 0;
    this.won = false;
    this.fourProbability = 0.1;
    this.directions = {
      0: [-1, 0],
      1: [0, -1],
      2: [1, 0],
      3: [0, 1],
    };
    this.addRandomTile();
    this.addRandomTile();
    this.setPositions();
  }
  addTile(value = 0) {
    const tile = new Tile(value);
    this.tiles.push(tile);
    return tile;
  }
  moveLeft() {
    let hasChanged = false;
    this.cells = this.cells.map((row) => {
      let currentRow = row.filter((tile) => tile.value !== 0);
      let newRow = Array(4).fill(this.addTile());

      for (let target = 0; target < 4; ++target) {
        let tile = currentRow.shift() || this.addTile();
        if (currentRow.length && currentRow[0].value === tile.value) {
          let mergedTile = this.addTile(tile.value * 2);
          tile.mergedInto = mergedTile;
          currentRow.shift().mergedInto = mergedTile;
          this.score += mergedTile.value;
          tile = mergedTile;
        }
        newRow[target] = tile;
        this.won ||= tile.value === 2048;
        hasChanged ||= tile.value !== row[target].value;
      }
      return newRow;
    });
    return hasChanged;
  }
  move(direction) {
    this.clearOldTiles();
    for (let i = 0; i < direction; ++i) this.cells = rotateLeft(this.cells);
    let changed = this.moveLeft();
    for (let i = direction; i < 4; ++i) this.cells = rotateLeft(this.cells);
    if (changed) this.addRandomTile();
    this.setPositions();
    return this;
  }
  addRandomTile() {
    let emptyCells = [];
    this.cells.forEach((row, r) => row.forEach((tile, c) => {
      if (tile.value === 0) emptyCells.push({ r, c });
    }));
    if (!emptyCells.length) return;
    let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    this.cells[r][c] = this.addTile(Math.random() < this.fourProbability ? 4 : 2);
  }
  setPositions() {
    this.cells.forEach((row, r) => row.forEach((tile, c) => {
      tile.oldRow = tile.row;
      tile.oldColumn = tile.column;
      tile.row = r;
      tile.column = c;
      tile.markForDeletion = false;
    }));
  }
  clearOldTiles() {
    this.tiles = this.tiles.filter((tile) => !tile.markForDeletion);
    this.tiles.forEach((tile) => (tile.markForDeletion = true));
  }
  hasWon() {
    return this.won;
  }
  hasLost() {
    return !this.cells.flat().some((tile) => tile.value === 0 || this.canMerge());
  }
  canMerge() {
    return this.cells.some((row, r) =>
      row.some((tile, c) => {
        if (!tile || tile.value === 0) return false; // Ensure tile exists
  
        return Object.values(this.directions).some(([dx, dy]) => {
          let nr = r + dx,
            nc = c + dy;
          return (
            nr >= 0 &&
            nr < 4 &&
            nc >= 0 &&
            nc < 4 &&
            this.cells[nr][nc] &&
            this.cells[nr][nc].value === tile.value
          );
        });
      })
    );
  }
}

export { Board };
