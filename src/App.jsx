import React, { useState } from "react";
import PuzzleGrid from "./components/PuzzleGrid";
import Controls from "./components/Controls";
import PuzzleSolver from "./utils/solver";
import { animatePath } from "./utils/path-animator";

const initialBoard = PuzzleSolver.getRandomState();

const App = () => {
  const initialBoard = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0],
  ];
  const [board, setBoard] = useState(initialBoard);
  const [isSolved, setIsSolved] = useState(false);
  const [level, setLevel] = useState(1);

  const handleShuffle = () => {
    const shuffleMoves = level === 1 ? 20 : 50;
    const shuffledBoard = shufflePuzzle(board, shuffleMoves);
    setBoard(shuffledBoard);
    setIsSolved(false);
  };

  const handleSolve = async () => {
    const path = await PuzzleSolver.solve(board);
    await animatePath(path, setBoard);
    setIsSolved(true);
  };

  const handleBoardUpdate = (newBoard) => {
    setBoard(newBoard);
    const solved = isPuzzleSolved(newBoard);
    setIsSolved(solved);

    if (solved && level < 2) {
      setTimeout(() => {
        alert(`Level ${level} completed! Moving to Level ${level + 1}`);
        setLevel(level + 1);
        handleShuffle();
      }, 500);
    } else if (solved && level === 2) {
      alert("Congratulations! You completed all levels!");
    }
  };

  const handleReset = () => {
    setLevel(1);
    setBoard(initialBoard);
    setIsSolved(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Puzzle Solver - Level {level}</h1>
      <PuzzleGrid
        board={board}
        setBoard={handleBoardUpdate}
        isSolved={isSolved}
      />
      <Controls
        onShuffle={handleShuffle}
        onSolve={handleSolve}
        onReset={handleReset}
        isSolved={isSolved}
      />
    </div>
  );
};

export default App;
