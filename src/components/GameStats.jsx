const GameStats = () => {
  return (
    <>
      <div className="game-stats">
        <div className="title-line mb-1">LEVEL 1</div>
        <div className="level-stats">
          <div className="stats-tile">
            <p className="title">Time</p>
            <p className="value">0 s</p>
          </div>
          <div className="stats-tile">
            <p className="title">Moves</p>
            <p className="value">0</p>
          </div>
        </div>
        <div className="title-line mb-1 mt-1">YOUR BEST</div>
        <div className="level-stats">
          <div className="stats-tile">
            <p className="title">Time</p>
            <p className="value">0 s</p>
          </div>
          <div className="stats-tile">
            <p className="title">Moves</p>
            <p className="value">0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameStats;
