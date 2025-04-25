// worker.js

export default () => {
  self.addEventListener("message", (e) => {
    if (!e?.data) return;

    const { boardState, gridSize = 3 } = e.data;

    const boardToString = (board) => {
      let str = "";
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          str += board[i][j] + ",";
        }
      }
      return str.slice(0, -1);
    };

    const solve = (initialBoard) => {
      if (![3, 4, 5, 6, 7].includes(gridSize)) {
        throw new Error("Grid size must be between 3 and 7");
      }

      const goal = Array.from({ length: gridSize }, (_, i) =>
        Array.from({ length: gridSize }, (_, j) => {
          const value = i * gridSize + j + 1;
          return value === gridSize * gridSize ? 0 : value;
        })
      );

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
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            if (board[i][j] === 0) {
              row = i;
              col = j;
              break;
            }
          }
          if (row !== undefined) break;
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
        const flat = [];
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            flat.push(board[i][j]);
          }
        }

        let inversions = 0;
        for (let i = 0; i < flat.length; i++) {
          for (let j = i + 1; j < flat.length; j++) {
            if (flat[i] && flat[j] && flat[i] > flat[j]) inversions++;
          }
        }

        if (gridSize % 2 === 1) {
          return inversions % 2 === 0;
        }

        let rowWithZero;
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            if (board[i][j] === 0) {
              rowWithZero = i;
              break;
            }
          }
          if (rowWithZero !== undefined) break;
        }

        return (inversions + rowWithZero) % 2 === 1;
      };

      if (!isSolvable(initialBoard)) return null;

      const goalStr = boardToString(goal);

      class PriorityQueue {
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
      }

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

    const result = solve(boardState);
    postMessage(result);
  });
};
