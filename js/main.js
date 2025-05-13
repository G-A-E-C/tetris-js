const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const TETROMINOS = {
    I: {
      shape: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      color: '#00f0f0'
    },
    J: {
      shape: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: '#0000f0'
    },
    L: {
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: '#f0a000'
    },
    O: {
      shape: [
        [1, 1],
        [1, 1]
      ],
      color: '#f0f000'
    },
    S: {
      shape: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      color: '#00f000'
    },
    T: {
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: '#a000f0'
    },
    Z: {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      color: '#f00000'
    }
  };

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

class Piece {
    constructor(tetromino, board) {
      this.shape = tetromino.shape;
      this.color = tetromino.color;
      this.board = board;
      this.x = Math.floor((board.cols - this.shape[0].length) / 2);
      this.y = 0;
    }
  
    draw(context) {
      context.fillStyle = this.color;
      this.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
          if (value) {
            context.fillRect(this.x + dx, this.y + dy, 1, 1);
          }
        });
      });
    }
  
    moveDown() {
      this.y++;
      if (this.hasCollision()) {
        this.y--;
        this.lock();
        return true; // se bloqueó
      }
      return false;
    }
  
    hasCollision() {
      return this.shape.some((row, dy) =>
        row.some((value, dx) => {
          if (!value) return false;
          const x = this.x + dx;
          const y = this.y + dy;
          return (
            x < 0 ||
            x >= this.board.cols ||
            y >= this.board.rows ||
            this.board.grid[y]?.[x]
          );
        })
      );
    }
  
    lock() {
      this.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
          if (value) {
            const x = this.x + dx;
            const y = this.y + dy;
            this.board.grid[y][x] = 1; // más adelante será color o valor
          }
        });
      });
    }

    moveLeft() {
        this.x--;
        if (this.hasCollision()) {
          this.x++;
        }
    }
      
    moveRight() {
        this.x++;
        if (this.hasCollision()) {
          this.x--;
        }
    }
      
    rotate() {
        const prevShape = this.shape;
        this.shape = this.shape[0].map((_, i) =>
          this.shape.map(row => row[i]).reverse()
        );
        if (this.hasCollision()) {
          this.shape = prevShape; // revertir si hay colisión
        }
    }
} 

function randomPiece() {
    const types = Object.keys(TETROMINOS);
    const rand = types[Math.floor(Math.random() * types.length)];
    return new Piece(TETROMINOS[rand], board);
}

let piece = randomPiece();

const board = new Board(ROWS, COLS);
board.draw(context);

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    board.draw(context);
    piece.draw(context);
  }
  
update();

document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        piece.moveLeft();
        break;
      case 'ArrowRight':
        piece.moveRight();
        break;
      case 'ArrowDown':
        piece.moveDown();
        break;
      case 'ArrowUp':
        piece.rotate();
        break;
    }
    update();
  });

  let dropCounter = 0;
  let dropInterval = 1000; // 1 segundo por nivel inicial
  let lastTime = 0;
  
  function gameLoop(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
  
    if (dropCounter > dropInterval) {
      const locked = piece.moveDown();
      if (locked) {
        piece = randomPiece(); // nueva pieza
      }
      dropCounter = 0;
    }
  
    update();
    requestAnimationFrame(gameLoop);
  }
  
  gameLoop();
