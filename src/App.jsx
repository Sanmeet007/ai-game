import React, { useState } from "react";
import PuzzleGrid from "./components/PuzzleGrid";
import Controls from "./components/Controls";
import PuzzleSolver from "./utils/solver";

const initialBoard = PuzzleSolver.getRandomState();

const App = () => {
  const [board, setBoard] = useState(initialBoard);
  const [solutionPath, setSolutionPath] = useState(null);
  const [isSolved, setIsSolved] = useState(false);

  const handleShuffle = () => {
    const shuffledBoard = PuzzleSolver.shuffle(board);
    setBoard(shuffledBoard);
    setSolutionPath(null);
    setIsSolved(false);
  };

  const handleSolve = async () => {
    const path = await PuzzleSolver.solve(board);
    setSolutionPath(path);
    setIsSolved(false);
  };

  const handleBoardUpdate = (newBoard) => {
    setBoard(newBoard);
    setIsSolved(PuzzleSolver.isSolved(newBoard));
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Puzzle Solver</h1>
      <PuzzleGrid
        board={board}
        setBoard={handleBoardUpdate}
        solutionPath={solutionPath}
        isSolved={isSolved}
      />
      <Controls
        onShuffle={handleShuffle}
        onSolve={handleSolve}
        isSolved={isSolved}
      />
    </div>
  );
};

export default App;
