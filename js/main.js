const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

class Board {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
  }

  draw(context) {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          context.fillStyle = 'cyan';
          context.fillRect(x, y, 1, 1);
        } else {
          context.strokeStyle = '#222';
          context.strokeRect(x, y, 1, 1);
        }
      });
    });
  }
}

const board = new Board(ROWS, COLS);
board.draw(context);