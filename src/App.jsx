import React, { useState } from "react";
import PuzzleGrid from "./components/PuzzleGrid";
import Controls from "./components/Controls";
import PuzzleSolver from "./utils/solver";
import { animatePath } from "./utils/path-animator";
import { useLevelContext } from "./providers/LevelProvider";
import LogoText from "./components/LogoText";
import GameLayout from "./GameLayout";
import { FaHandsClapping } from "react-icons/fa6";
import GameStats from "./components/GameStats";
import GameRules from "./components/GameRules";

const initialBoard = PuzzleSolver.getRandomState();

const App = () => {
  const { currentLevel, setCurrentLevel } = useLevelContext();
  const [board, setBoard] = useState(initialBoard);
  const [isSolved, setIsSolved] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

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
        alert(
          `Level ${currentLevel} completed! Moving to Level ${currentLevel + 1}`
        );
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
    setCanPlay(false);
  };

  const handleStartGame = () => {
    setCanPlay(true);
    console.log("lets go");
  };

  return (
    <>
      <GameLayout
        sideComponent={
          <>
            <div className="game-bar">
              <LogoText width={180} height={40} />
              <GameRules />
              <GameStats />
              <Controls
                onShuffle={handleShuffle}
                onSolve={handleSolve}
                onReset={handleReset}
                isSolved={isSolved}
              />
            </div>
          </>
        }
      >
        <PuzzleGrid
          startGame={handleStartGame}
          canPlay={canPlay}
          board={board}
          setBoard={handleBoardUpdate}
          isSolved={isSolved}
          resetGame={handleReset}
        />
      </GameLayout>

      {isSolved && (
        <div
          style={{
            position: "fixed",
            top: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0, 0, 0, 0.56)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div className="congrats-tile">
            <FaHandsClapping />
            Level Solved!
          </div>
          <button className="play-again-btn" onClick={handleReset}>
            PLAY AGAIN
          </button>
        </div>
      )}
    </>
  );
};

export default App;
