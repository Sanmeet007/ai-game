import React from 'react';

const Controls = ({ onShuffle, onSolve, isSolved }) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <button
        onClick={onShuffle}
        style={{ marginRight: '10px', padding: '10px 20px' }}
      >
        Shuffle
      </button>
      <button
        onClick={onSolve}
        disabled={isSolved}
        style={{
          padding: '10px 20px',
          background: isSolved ? '#ccc' : '#007bff',
          color: 'white',
          cursor: isSolved ? 'not-allowed' : 'pointer'
        }}
      >
        Solve
      </button>
    </div>
  );
};

export default Controls;