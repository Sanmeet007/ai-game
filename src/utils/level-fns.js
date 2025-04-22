export function getLevelStats(stats, levelId) {
  const level = stats.find((lvl) => lvl.level === levelId);

  return {
    level: levelId,
    bestTime: level?.bestTime ?? 0,
    moves: level?.moves ?? 0,
  };
}

export function formatSeconds(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}
