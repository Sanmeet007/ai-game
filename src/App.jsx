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
    [7, 8, 0]
  ];
  const [board, setBoard] = useState(initialBoard);
  const [isSolved, setIsSolved] = useState(false);
  const [level, setLevel] = useState(1); // Track current level

  const handleShuffle = () => {
    // Adjust shuffle intensity based on level
    const shuffleMoves = level === 1 ? 20 : 50; // Fewer moves for Level 1, more for Level 2
    const shuffledBoard = shufflePuzzle(board, shuffleMoves); // Pass shuffleMoves to shufflePuzzle
    setBoard(shuffledBoard);
    setIsSolved(false);
  };

  const handleSolve = async () => {
    const path = await PuzzleSolver.solve(board);
    await animatePath(path, setBoard);
    setIsSolved(true);
  };

  // Check if puzzle is solved after each move
  const handleBoardUpdate = (newBoard) => {
    setBoard(newBoard);
    const solved = isPuzzleSolved(newBoard);
    setIsSolved(solved);
    // If solved and not already on max level, prepare for next level
    if (solved && level < 2) {
      setTimeout(() => {
        alert(`Level ${level} completed! Moving to Level ${level + 1}`);
        setLevel(level + 1);
        handleShuffle(); // Shuffle for the next level
      }, 500);
    } else if (solved && level === 2) {
      alert('Congratulations! You completed all levels!');
    }
  };

  // Reset to Level 1
  const handleReset = () => {
    setLevel(1);
    setBoard(initialBoard);
    setSolutionPath(null);
    setIsSolved(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Puzzle Solver - Level {level}</h1>
      <PuzzleGrid
        board={board}
        setBoard={handleBoardUpdate}
        isSolved={isSolved}
      />
      <Controls
        onShuffle={handleShuffle}
        onSolve={handleSolve}
        onReset={handleReset} // Pass reset function to Controls
        isSolved={isSolved}
      />
    </div>
  );
};

export default App;
