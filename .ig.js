const getGoalStateFromGridSize = (gridSize = 3) => {
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
  
  const solvePuzzle = (initialBoard, gridSize = 3) => {
    const goal = getGoalStateFromGridSize(gridSize);
  
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
  
    const findEmptyTile = (board) => {
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (board[i][j] === 0) return { row: i, col: j };
        }
      }
    };
  
    const getNeighbors = (board) => {
      const neighbors = [];
      const { row, col } = findEmptyTile(board);
      const moves = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
      ];
  
      for (const [newRow, newCol] of moves) {
        if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
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
      // For odd gridSize (like 3), puzzle is solvable if inversions is even
      if (gridSize % 2 === 1) {
        return inversions % 2 === 0;
      }
      // For even gridSize (like 4), additional logic involving blank tile row is needed
      const { row } = findEmptyTile(board);
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
  
      if (visited.has(currentStr) && visited.get(currentStr) <= current.g) continue;
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
  
  // Test with a valid 3x3 puzzle
  const initialBoard = [
    [1, 2, 3],
    [4, 0, 5],
    [7, 8, 6],
  ];
  console.table(solvePuzzle(initialBoard));