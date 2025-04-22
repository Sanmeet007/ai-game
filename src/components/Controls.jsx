import React from "react";
import { RiResetLeftLine } from "react-icons/ri";
import { MdAutoFixHigh } from "react-icons/md";
import { CiShuffle } from "react-icons/ci";

const Controls = ({ onShuffle, onSolve, onReset, isSolved, canPlay }) => {
  return (
    <>
      <div className="controller-wrapper">
        <button onClick={onShuffle} disabled={!canPlay}>
          <CiShuffle />
          Shuffle
        </button>
        <button
          onClick={onSolve}
          disabled={isSolved || !canPlay}
          style={{
            cursor: isSolved ? "not-allowed" : "pointer",
          }}
        >
          <MdAutoFixHigh />
          Solve
        </button>
        <button className="secondary" onClick={onReset} disabled={!canPlay}>
          <RiResetLeftLine />
          Reset
        </button>
      </div>
    </>
  );
};

export default Controls;
