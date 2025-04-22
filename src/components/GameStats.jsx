import { useLevelStorage } from "../hooks/useLevelStroage";
import { useLevelContext } from "../providers/LevelProvider";
import { formatSeconds } from "../utils/level-fns";

const GameStats = ({ movesPlayed, gamePlayedTime }) => {
  const { getLevelStats } = useLevelStorage();
  const { currentLevel, _ } = useLevelContext();
  const currentLevelStats = getLevelStats(currentLevel);

  return (
    <>
      <div className="game-stats">
        <div className="title-line mb-1">PROGRESS</div>
        <div className="level-stats">
          <div className="stats-tile">
            <p className="title">Time</p>
            <p className="value">{formatSeconds(gamePlayedTime)}</p>
          </div>
          <div className="stats-tile">
            <p className="title">Moves</p>
            <p className="value">{movesPlayed}</p>
          </div>
        </div>
        <div className="title-line mb-1 mt-1">YOUR BEST</div>
        <div className="level-stats">
          <div className="stats-tile">
            <p className="title">Time</p>
            <p className="value">{formatSeconds(currentLevelStats.bestTime)}</p>
          </div>
          <div className="stats-tile">
            <p className="title">Moves</p>
            <p className="value">{currentLevelStats.moves}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameStats;
