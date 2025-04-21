import React, { useState } from 'react';
import PuzzleGrid from './components/PuzzleGrid';
import Controls from './components/Controls';
import { solvePuzzle, shufflePuzzle, isPuzzleSolved } from './utils/solver';

const App = () => {
  const initialBoard = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ];
  const [board, setBoard] = useState(initialBoard);
  const [solutionPath, setSolutionPath] = useState(null);
  const [isSolved, setIsSolved] = useState(false);

  const handleShuffle = () => {
    const shuffledBoard = shufflePuzzle(board);
    setBoard(shuffledBoard);
    setSolutionPath(null);
    setIsSolved(false);
  };

  const handleSolve = async () => {
    const path = await solvePuzzle(board);
    setSolutionPath(path);
    setIsSolved(false); // Reset solved state during AI solving
  };

  // Check if puzzle is solved after each move
  const handleBoardUpdate = (newBoard) => {
    setBoard(newBoard);
    setIsSolved(isPuzzleSolved(newBoard));
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Puzzle Solver</h1>
      <PuzzleGrid
        board={board}
        setBoard={handleBoardUpdate}
        solutionPath={solutionPath}
        isSolved={isSolved}
      />
      <Controls onShuffle={handleShuffle} onSolve={handleSolve} isSolved={isSolved} />
    </div>
  );
};

export default App;