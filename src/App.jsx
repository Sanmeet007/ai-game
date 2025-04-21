import React, { useState } from "react";
import PuzzleGrid from "./components/PuzzleGrid";
import Controls from "./components/Controls";
import PuzzleSolver from "./utils/solver";
import { animatePath } from "./utils/path-animator";
import { useLevelContext } from "./providers/LevelProvider";

const initialBoard = PuzzleSolver.getRandomState();

const App = () => {
  const { currentLevel, setCurrentLevel } = useLevelContext();
  const [board, setBoard] = useState(initialBoard);
  const [isSolved, setIsSolved] = useState(false);

  const handleShuffle = () => {
    const shuffleMoves = currentLevel === 1 ? 20 : 50;
    const shuffledBoard = PuzzleSolver.shuffle(board, shuffleMoves);
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
    const solved = PuzzleSolver.isSolved(newBoard);
    setIsSolved(solved);

    if (solved && currentLevel < 2) {
      setTimeout(() => {
        alert(`Level ${currentLevel} completed! Moving to Level ${currentLevel + 1}`);
        setCurrentLevel(currentLevel + 1);
        handleShuffle();
      }, 500);
    } else if (solved && currentLevel === 2) {
      alert("Congratulations! You completed all levels!");
    }
  };

  const handleReset = () => {
    setCurrentLevel(1);
    setBoard(initialBoard);
    setIsSolved(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Puzzle Solver - Level {currentLevel}</h1>
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
