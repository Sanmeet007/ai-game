export const solvePuzzle = (initialBoard) => {
  const goal = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ];

  const boardToString = (board) => board.flat().join(',');

  const manhattanDistance = (board) => {
    let distance = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] !== 0) {
          const value = board[i][j];
          const goalRow = Math.floor((value - 1) / 3);
          const goalCol = (value - 1) % 3;
          distance += Math.abs(i - goalRow) + Math.abs(j - goalCol);
        }
      }
    }
    return distance;
  };

  const getNeighbors = (board) => {
    const neighbors = [];
    const emptyPos = findEmptyTile(board);
    const { row, col } = emptyPos;
    const moves = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1]
    ];

    for (const [newRow, newCol] of moves) {
      if (
        newRow >= 0 &&
        newRow < 3 &&
        newCol >= 0 &&
        newCol < 3
      ) {
        const newBoard = JSON.parse(JSON.stringify(board));
        [newBoard[row][col], newBoard[newRow][newCol]] = [
          newBoard[newRow][newCol],
          newBoard[row][col]
        ];
        neighbors.push(newBoard);
      }
    }
    return neighbors;
  };

  const findEmptyTile = (board) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) return { row: i, col: j };
      }
    }
  };

  const openSet = [
    {
      board: initialBoard,
      g: 0,
      h: manhattanDistance(initialBoard),
      f: manhattanDistance(initialBoard),
      path: [initialBoard]
    }
  ];
  const closedSet = new Set();

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    const currentStr = boardToString(current.board);

    if (boardToString(current.board) === boardToString(goal)) {
      return current.path;
    }

    closedSet.add(currentStr);

    const neighbors = getNeighbors(current.board);
    for (const neighbor of neighbors) {
      const neighborStr = boardToString(neighbor);
      if (!closedSet.has(neighborStr)) {
        const g = current.g + 1;
        const h = manhattanDistance(neighbor);
        const f = g + h;

        const existing = openSet.find(
          (node) => boardToString(node.board) === neighborStr
        );
        if (!existing || f < existing.f) {
          if (existing) {
            openSet.splice(openSet.indexOf(existing), 1);
          }
          openSet.push({
            board: neighbor,
            g,
            h,
            f,
            path: [...current.path, neighbor]
          });
        }
      }
    }
  }

  return null;
};

export const shufflePuzzle = (board) => {
  const newBoard = JSON.parse(JSON.stringify(board));
  for (let i = 0; i < 100; i++) {
    const emptyPos = findEmptyTile(newBoard);
    const possibleMoves = [
      [emptyPos.row - 1, emptyPos.col],
      [emptyPos.row + 1, emptyPos.col],
      [emptyPos.row, emptyPos.col - 1],
      [emptyPos.row, emptyPos.col + 1]
    ].filter(
      ([r, c]) => r >= 0 && r < 3 && c >= 0 && c < 3
    );
    const [newRow, newCol] =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    [newBoard[emptyPos.row][emptyPos.col], newBoard[newRow][newCol]] = [
      newBoard[newRow][newCol],
      newBoard[emptyPos.row][emptyPos.col]
    ];
  }
  return newBoard;
};

const findEmptyTile = (board) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) return { row: i, col: j };
    }
  }
};

export const isPuzzleSolved = (board) => {
  const goal = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ];
  return board.flat().join(',') === goal.flat().join(',');
};