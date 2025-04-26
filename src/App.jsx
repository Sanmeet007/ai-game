import React, { useCallback, useEffect, useState } from "react";
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
import { useLevelStorage } from "./hooks/useLevelStroage";
import { formatSeconds, levelDetails } from "./utils/level-fns";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

let initialBoard = PuzzleSolver.getRandomState();

const App = () => {
  const { updateStats } = useLevelStorage();
  const { currentLevel, setCurrentLevel } = useLevelContext();
  const [solvedData, setSolvedData] = useState({
    time: 0,
    moves: 0,
  });

  const [worker, setWorker] = useState(null);
  const [board, setBoard] = useState(initialBoard);
  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [timer, setTimer] = useState(null);
  const [movesPlayed, setMovesPlayed] = useState(0);
  const [gamePlayedTime, setGamePlayedTime] = useState(0);

  const startTimer = () => {
    const timerInstance = setInterval(() => {
      setGamePlayedTime((x) => ++x);
    }, 1000);
    setTimer(timerInstance);
  };

  const stopTimer = useCallback(() => {
    if (timer != null) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [timer]);

  const handleShuffle = () => {
    const shuffleMoves = currentLevel === 1 ? 20 : 50;
    const shuffledBoard = PuzzleSolver.shuffle(board, shuffleMoves);

    stopTimer();
    setGamePlayedTime(0);
    setMovesPlayed(0);
    setBoard(shuffledBoard);
    setIsSolved(false);
    setCanPlay(false);
  };

  const handleSolve = async () => {
    try {
      setIsSolving(true);

      if (worker) worker.terminate();
      const newWokerInstance = new Worker("/ai-game/worker.js");
      setWorker(newWokerInstance);

      const solution = await PuzzleSolver.solve(
        newWokerInstance,
        {
          size: board.length,
          puzzle: board,
          greedy: false, // true == ignore the treeLevel score
          uniform: false, // true == ignore the heuristic score
          heuristics: [
            "manhattan",
            "linearConflicts",
            "hamming",
            "euclidean",
            "diagonal",
            "gaschnig",
          ], // the list of heuristics to use
          queueType: "heapQ", // "heapQ"
        },
        board
      );
      const solutionPath = solution.steps.map((step) => step[0]);
      setIsSolving(false);

      if (solutionPath === null) {
        stopTimer();
        setGamePlayedTime(0);
        setMovesPlayed(0);
        setIsSolved(false);

        alert(
          "No solution available for this layout. Reset to continue playing."
        );
        return;
      }
      await animatePath(solutionPath, setBoard, () => {
        setMovesPlayed((x) => ++x);
      });
      setIsSolved(true);
    } catch (e) {
      console.error(e);

      stopTimer();
      setGamePlayedTime(0);
      setMovesPlayed(0);
      setIsSolved(false);

      alert("Ah Snap! Something went wrong");
      return;
    }
  };

  const handleBoardUpdate = (newBoard) => {
    setMovesPlayed((x) => ++x);
    setBoard(newBoard);
    const solved = PuzzleSolver.isSolved(newBoard);
    setIsSolved(solved);
  };

  const handleReset = () => {
    stopTimer();
    setGamePlayedTime(0);
    setMovesPlayed(0);
    setBoard(initialBoard);
    setIsSolved(false);
    setCanPlay(false);
  };

  const handleStartGame = () => {
    setCanPlay(true);
    startTimer();
  };

  useEffect(() => {
    if (isSolved) {
      updateStats(currentLevel, gamePlayedTime, movesPlayed);
      stopTimer();
      setSolvedData({ time: gamePlayedTime, moves: movesPlayed });
    }
  }, [
    isSolved,
    stopTimer,
    updateStats,
    currentLevel,
    movesPlayed,
    gamePlayedTime,
    setSolvedData,
  ]);

  const handleLevelChange = (e) => {
    const selectedLevel = parseInt(e.target.value, 10);

    if (selectedLevel === currentLevel) return;

    setCurrentLevel(selectedLevel);
    const newBoard = PuzzleSolver.getRandomState(
      levelDetails[selectedLevel].gridSize
    );
    initialBoard = newBoard;
    setBoard(newBoard);
    handleReset();
  };

  return (
    <>
      <GameLayout
        sideComponent={
          <>
            <div className="game-bar">
              <LogoText width={180} height={40} />
              <GameRules />
              <select
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "1rem",
                  borderRadius: "100px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                  appearance: "none",
                  background: `url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%2210%22 viewBox=%220 0 10 10%22 fill=%22none%22%3E%3Cpath fill=%22%23ffeb94%22 d=%22M5 8L1 4H9L5 8Z%22/%3E%3C/svg%3E') no-repeat right 1rem center, #1d200e`,
                  backgroundSize: "10px",
                  backgroundPosition: "right 1rem center",
                }}
                onChange={handleLevelChange}
                defaultValue={1}
              >
                <option value="" disabled>
                  Select Level
                </option>
                {[1, 2, 3].map((level) => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ))}
              </select>

              <GameStats
                gamePlayedTime={gamePlayedTime}
                movesPlayed={movesPlayed}
              />
              <Controls
                onShuffle={handleShuffle}
                onSolve={handleSolve}
                onReset={handleReset}
                isSolved={isSolved}
                canPlay={canPlay}
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
            <div className="flex">
              <FaHandsClapping />
              Level Solved!
            </div>
            <div className="info">
              <div className="flex gap-4">
                <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                  🕒 Time: {formatSeconds(solvedData.time)}
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                  🎯 Moves: {solvedData.moves}
                </div>
              </div>
            </div>
          </div>
          <button className="play-again-btn" onClick={handleReset}>
            PLAY AGAIN
          </button>
        </div>
      )}

      <div
        className={!isSolving ? "modal" : "modal visible"}
        style={{
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div className="rotate-loading">
          <AiOutlineLoading3Quarters size={50} />
        </div>

        <div
          className="modal-content"
          style={{
            fontSize: "1.5rem",
          }}
        >
          Finding Solution
        </div>
      </div>
    </>
  );
};

export default App;
