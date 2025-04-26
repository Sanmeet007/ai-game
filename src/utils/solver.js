import generateZeroLastGoal from "./goalGenerator";
import PuzzleGenerator from "./puzzleGenerator";

class PuzzleSolver {
  static getRandomState(gridSize = 3) {
    const puzzle = new PuzzleGenerator(gridSize, true);
    return puzzle;
  }

  static async solve(workerInstance, solvingOptions, boardState) {
    return new Promise((resolve, reject) => {
      try {
        const goal = generateZeroLastGoal(solvingOptions.size);
        workerInstance.postMessage({
          algorithm: "ASTAR",
          goal: goal,
          initPuzzleNode: [
            boardState.map((l) => l.map((c) => c.toString())),
            solvingOptions.greedy,
            solvingOptions.uniform,
            goal,
            undefined,
            solvingOptions.heuristics,
          ],
          qType: "heapQ",
        });

        workerInstance.addEventListener(
          "message",
          (e) => {
            resolve(e.data);
          },
          true
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  static shuffle = (board) => {
    const gridSize = board.length;

    if (![3, 4, 5].includes(gridSize)) {
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
    const goal = generateZeroLastGoal(board[0].length);
    return board.flat().join(",") === goal.flat().join(",");
  };
}

export default PuzzleSolver;
