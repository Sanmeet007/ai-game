import React, { useEffect } from "react";

const PuzzleGrid = ({ board, setBoard, solutionPath, isSolved, level }) => {
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

  if (
    !board ||
    !Array.isArray(board) ||
    board.length !== 3 ||
    board.some((row) => row.length !== 3)
  ) {
    return (
      <div
        style={{
          color: "#ff4d4d",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "20px",
        }}
      >
        Error: Invalid puzzle board
      </div>
    );
  }

  const levelStyles = {
    1: {
      background: "linear-gradient(135deg, #1a1a1a, #2c2c2c)",
      boxShadow:
        "0 0 20px rgba(0, 255, 255, 0.7), 0 0 40px rgba(255, 0, 255, 0.5)",
    },
    2: {
      background: "linear-gradient(135deg, #2c2c2c, #4a1a4a)",
      boxShadow:
        "0 0 25px rgba(255, 0, 255, 0.8), 0 0 50px rgba(0, 255, 255, 0.6)",
    },
  };

  return (
    <div
      style={{
        "--tile-size": "8rem",
        animation: isSolved ? "pulse 1s" : "none",
        ...levelStyles[level],
      }}
      className="puzzle-grid"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3 ,var(--tile-size))",
          gridTemplateRows: "repeat(3 ,var(--tile-size))",
          border: "2px solid rgba(255, 255, 255, 0.16)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => tile !== 0 && handleTileClick(rowIndex, colIndex)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: tile !== 0 && !isSolved ? "pointer" : "default",
                transition: "transform 0.2s, box-shadow 0.2s",
                transform: tile !== 0 ? "scale(1)" : "scale(0.95)",
                backgroundImage: `url(/assets/frames/frame-${tile}.png)`,
                backgroundSize: "100% 100%",
                boxShadow:
                  level === 2 && tile !== 0
                    ? "0 0 10px rgba(255, 0, 255, 0.5)"
                    : "none",
              }}
            />
          ))
        )}
      </div>
      {isSolved && (
        <p
          style={{
            color: "rgb(232 ,255 ,164)",
            fontSize: "1.5rem",
            margin: "0 0",
            marginTop: "1rem",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "700",
            animation: "fadeIn 0.5s",
          }}
        >
          Level Solved!
        </p>
      )}
    </div>
  );
};

export default PuzzleGrid;
