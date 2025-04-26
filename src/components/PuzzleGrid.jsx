import React, { useEffect } from "react";
import { useLevelContext } from "../providers/LevelProvider";
import { levelDetails } from "../utils/level-fns";

const PuzzleGrid = ({
  board,
  setBoard,
  solutionPath,
  isSolved,
  canPlay,
  startGame,
}) => {
  const { currentLevel } = useLevelContext();
  const currentLevelDetails = levelDetails[currentLevel];

  const handleTileClick = (row, col) => {
    if (isSolved) return;
    const newBoard = JSON.parse(JSON.stringify(board));
    const emptyPos = findEmptyTile(board);
    if (!emptyPos) return;
    if (isAdjacent({ row, col }, emptyPos)) {
      [newBoard[row][col], newBoard[emptyPos.row][emptyPos.col]] = [
        newBoard[emptyPos.row][emptyPos.col],
        newBoard[row][col],
      ];
      setBoard(newBoard);
    }
  };

  const findEmptyTile = (board) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) return { row: i, col: j };
      }
    }
    return null;
  };

  const isAdjacent = (pos1, pos2) => {
    return (
      (Math.abs(pos1.row - pos2.row) === 1 && pos1.col === pos2.col) ||
      (Math.abs(pos1.col - pos2.col) === 1 && pos1.row === pos2.row)
    );
  };

  useEffect(() => {
    if (solutionPath && !isSolved) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < solutionPath.length) {
          setBoard(solutionPath[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [solutionPath, setBoard, isSolved]);

  return (
    <>
      <div
        style={{
          animation: isSolved ? "glow 1s ease-in" : "none",
        }}
        className="puzzle-grid-wrapper"
      >
        <div
          style={{
            border: "2px solid rgba(255, 255, 255, 0.16)",
            borderRadius: "10px",
            overflow: "hidden",
            display: 'grid',
            gridTemplateColumns: `repeat(${currentLevelDetails.gridSize}, minmax(50px, 1fr))`,
            width: 'min(90vw, 500px)', 
            margin: '0 auto',
          }}
          className="puzzle-grid"
        >
          {board.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <div
                className="board-tile"
                key={`${rowIndex}-${colIndex}`}
                onClick={() =>
                  tile !== 0 && handleTileClick(rowIndex, colIndex)
                }
                style={{
                  aspectRatio: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: tile !== 0 && !isSolved ? "pointer" : "default",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  transform: tile != 0 || isSolved ? "scale(1)" : "scale(0.95)",
                  backgroundImage:
                    isSolved && tile == 0
                      ? `url(/ai-game/assets/frames/${
                          currentLevelDetails.imagesFolder
                        }/${currentLevelDetails.gridSize ** 2}.png)`
                      : `url(/ai-game/assets/frames/${currentLevelDetails.imagesFolder}/${tile}.png)`,
                  backgroundSize: "100% 100%",
                }}
              ></div>
            ))
          )}
        </div>

        <>
          <div
            className={canPlay ? "modal" : "modal visible"}
            id="game-modal"
            style={{
              borderRadius: "20px",
              position: "absolute",
            }}
          >
            <div className="modal-content">
              <button className="btn" onClick={startGame}>
                Start Challenge
              </button>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default PuzzleGrid;
