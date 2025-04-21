import React from "react";
import { RiResetLeftLine } from "react-icons/ri";
import { MdAutoFixHigh } from "react-icons/md";
import { CiShuffle } from "react-icons/ci";

const Controls = ({ onShuffle, onSolve, onReset, isSolved }) => {
  return (
    <div className="controller-wrapper">
      <button onClick={onShuffle}>
        <CiShuffle />
        Shuffle
      </button>
      <button
        onClick={onSolve}
        disabled={isSolved}
        style={{
          background: isSolved ? "#ccc" : "#007bff",
          cursor: isSolved ? "not-allowed" : "pointer",
        }}
      >
        <MdAutoFixHigh />
        Solve
      </button>
      <button className="secondary" onClick={onReset}>
        <RiResetLeftLine />
        Reset Game
      </button>
    </div>
  );
};

export default Controls;
