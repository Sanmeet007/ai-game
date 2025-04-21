import React, { useEffect } from 'react';

const PuzzleGrid = ({ board, setBoard, solutionPath, isSolved }) => {
  // Handle tile click to move (only if adjacent to empty tile)
  const handleTileClick = (row, col) => {
    if (isSolved) return;
    const newBoard = JSON.parse(JSON.stringify(board));
    const emptyPos = findEmptyTile(board);
    if (!emptyPos) return;
    if (isAdjacent({ row, col }, emptyPos)) {
      [newBoard[row][col], newBoard[emptyPos.row][emptyPos.col]] = [
        newBoard[emptyPos.row][emptyPos.col],
        newBoard[row][col]
      ];
      setBoard(newBoard);
    }
  };

  // Find position of empty tile (0)
  const findEmptyTile = (board) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) return { row: i, col: j };
      }
    }
    return null;
  };

  // Check if two positions are adjacent
  const isAdjacent = (pos1, pos2) => {
    return (
      (Math.abs(pos1.row - pos2.row) === 1 && pos1.col === pos2.col) ||
      (Math.abs(pos1.col - pos2.col) === 1 && pos1.row === pos2.row)
    );
  };

  // Animate solution path
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

  // Validate board prop
  if (!board || !Array.isArray(board) || board.length !== 3 || board.some(row => row.length !== 3)) {
    return <div style={{ color: '#ff4d4d', fontFamily: "'Poppins', sans-serif", fontSize: '20px' }}>Error: Invalid puzzle board</div>;
  }

  return (
    <div
      style={{
        display: 'inline-block',
        padding: '20px',
        background: 'linear-gradient(135deg, #1a1a1a, #2c2c2c)',
        borderRadius: '15px',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.7), 0 0 40px rgba(255, 0, 255, 0.5)',
        margin: '0 auto',
      }}
    >
      <div style={{ border: '2px solid rgba(255, 255, 255, 0.2)', borderRadius: '10px', overflow: 'hidden' }}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' , gap:"" }}>
            {row.map((tile, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => tile !== 0 && handleTileClick(rowIndex, colIndex)}
                style={{
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: tile !== 0 && !isSolved ? 'pointer' : 'default',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  transform: tile !== 0 && !isSolved ? 'scale(1)' : 'scale(0.95)',
                  animation: isSolved && tile !== 0 ? 'pulse 1s infinite' : 'none',
                  backgroundImage : `url(/assets/frames/frame-${tile}.png)`,
                  backgroundSize: "100% 100%"
                
                }}
              >
                
              </div>
            ))}
          </div>
        ))}
      </div>
      {isSolved && (
        <p
          style={{
            color: '#00ffcc',
            fontSize: '28px',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: '700',
            marginTop: '20px',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.5)',
            animation: 'fadeIn 0.5s',
          }}
        >
          Solved!
        </p>
      )}
    </div>
  );
};

// Inline keyframes for animations
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  @keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 0 15px rgba(0, 255, 255, 0.5), 0 0 25px rgba(255, 0, 255, 0.3); }
    50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(0, 255, 255, 0.7), 0 0 35px rgba(255, 0, 255, 0.5); }
    100% { transform: scale(1); box-shadow: 0 0 15px rgba(0, 255, 255, 0.5), 0 0 25px rgba(255, 0, 255, 0.3); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

export default PuzzleGrid;