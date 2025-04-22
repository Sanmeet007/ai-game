class PuzzleSolver {
  static #getGoalStateFromGridSize = (gridSize = 3) => {
    const flat = Array.from(
      { length: gridSize ** 2 },
      (_, i) => (i + 1) % gridSize ** 2
    );
    const goal = [];
    for (let i = 0; i < gridSize; i++) {
      goal.push(flat.slice(i * gridSize, (i + 1) * gridSize));
    }
    return goal;
  };

  static getRandomState(gridSize = 3) {
    const arr = PuzzleSolver.#getGoalStateFromGridSize(gridSize);
    return PuzzleSolver.shuffle(arr);
  }

  static solve = (initialBoard, gridSize = 3) => {
    if (![3, 4, 5, 6, 7].includes(gridSize)) {
      throw new Error("Grid size must be between 3 and 7");
    }

    const goal = Array.from({ length: gridSize }, (_, i) =>
      Array.from({ length: gridSize }, (_, j) => {
        const value = i * gridSize + j + 1;
        return value === gridSize * gridSize ? 0 : value;
      })
    );

    const boardToString = (board) => board.flat().join(",");

    const goalStr = boardToString(goal);

    const manhattanDistance = (board) => {
      let distance = 0;
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const value = board[i][j];
          if (value !== 0) {
            const goalRow = Math.floor((value - 1) / gridSize);
            const goalCol = (value - 1) % gridSize;
            distance += Math.abs(i - goalRow) + Math.abs(j - goalCol);
          }
        }
      }
      return distance;
    };

    const getNeighbors = (board) => {
      const neighbors = [];
      let row, col;
      outer: for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (board[i][j] === 0) {
            row = i;
            col = j;
            break outer;
          }
        }
      }

      const moves = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
      ];

      for (const [newRow, newCol] of moves) {
        if (
          newRow >= 0 &&
          newRow < gridSize &&
          newCol >= 0 &&
          newCol < gridSize
        ) {
          const newBoard = board.map((r) => r.slice());
          [newBoard[row][col], newBoard[newRow][newCol]] = [
            newBoard[newRow][newCol],
            newBoard[row][col],
          ];
          neighbors.push(newBoard);
        }
      }
      return neighbors;
    };

    const isSolvable = (board) => {
      const flat = board.flat();
      let inversions = 0;
      for (let i = 0; i < flat.length; i++) {
        for (let j = i + 1; j < flat.length; j++) {
          if (flat[i] && flat[j] && flat[i] > flat[j]) inversions++;
        }
      }

      if (gridSize % 2 === 1) {
        return inversions % 2 === 0;
      }

      let row;
      outer: for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (board[i][j] === 0) {
            row = i;
            break outer;
          }
        }
      }
      return (inversions + row) % 2 === 1;
    };

    if (!isSolvable(initialBoard)) return null;

    const PriorityQueue = class {
      constructor() {
        this.queue = [];
      }
      enqueue(element) {
        this.queue.push(element);
        this.queue.sort((a, b) => a.f - b.f);
      }
      dequeue() {
        return this.queue.shift();
      }
      isEmpty() {
        return this.queue.length === 0;
      }
      findByBoardStr(str) {
        return this.queue.find((el) => boardToString(el.board) === str);
      }
      remove(item) {
        const index = this.queue.indexOf(item);
        if (index !== -1) this.queue.splice(index, 1);
      }
    };

    const openSet = new PriorityQueue();
    const visited = new Map();

    const h = manhattanDistance(initialBoard);
    openSet.enqueue({
      board: initialBoard,
      g: 0,
      h,
      f: h,
      path: [initialBoard],
    });

    while (!openSet.isEmpty()) {
      const current = openSet.dequeue();
      const currentStr = boardToString(current.board);

      if (currentStr === goalStr) {
        return current.path;
      }

      if (visited.has(currentStr) && visited.get(currentStr) <= current.g)
        continue;
      visited.set(currentStr, current.g);

      for (const neighbor of getNeighbors(current.board)) {
        const neighborStr = boardToString(neighbor);
        const g = current.g + 1;
        const h = manhattanDistance(neighbor);
        const f = g + h;

        const existing = openSet.findByBoardStr(neighborStr);
        if (!existing || f < existing.f) {
          if (existing) openSet.remove(existing);
          openSet.enqueue({
            board: neighbor,
            g,
            h,
            f,
            path: [...current.path, neighbor],
          });
        }
      }
    }

    return null;
  };

  static shuffle = (board) => {
    const gridSize = board.length;

    if (![3, 4, 5, 6, 7].includes(gridSize)) {
      throw new Error("Grid size must be between 3 and 7");
    }

    if (board.some((row) => row.length !== gridSize)) {
      throw new Error(`Board must be ${gridSize}x${gridSize}`);
    }

    const newBoard = JSON.parse(JSON.stringify(board));

    const findEmptyTile = (board) => {
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (board[i][j] === 0) {
            return { row: i, col: j };
          }
        }
      }
      throw new Error("No empty tile found");
    };

    for (let i = 0; i < gridSize * gridSize * 10; i++) {
      const emptyPos = findEmptyTile(newBoard);
      const possibleMoves = [
        [emptyPos.row - 1, emptyPos.col],
        [emptyPos.row + 1, emptyPos.col],
        [emptyPos.row, emptyPos.col - 1],
        [emptyPos.row, emptyPos.col + 1],
      ].filter(([r, c]) => r >= 0 && r < gridSize && c >= 0 && c < gridSize);

      const [newRow, newCol] =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      [newBoard[emptyPos.row][emptyPos.col], newBoard[newRow][newCol]] = [
        newBoard[newRow][newCol],
        newBoard[emptyPos.row][emptyPos.col],
      ];
    }

    return newBoard;
  };

  static isSolved = (board) => {
    const goal = PuzzleSolver.#getGoalStateFromGridSize(board[0].length);
    return board.flat().join(",") === goal.flat().join(",");
  };
}

export default PuzzleSolver;
