import { useState, useCallback } from "react";

export function useLevelStorage(totalLevels = 5) {
  const storageKey = "gridRushLevels";

  const initializeData = useCallback(() => {
    const levels = Array.from({ length: totalLevels }, (_, i) => ({
      level: i + 1,
      bestTime: null,
      moves: 0,
    }));
    localStorage.setItem(storageKey, JSON.stringify(levels));
    return levels;
  }, [totalLevels]);

  const getStoredData = useCallback(() => {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : initializeData();
  }, [initializeData]);

  const [stats, setStats] = useState(getStoredData);

  const updateStats = useCallback(
    (levelId, timeInSeconds, moves) => {
      const data = getStoredData();
      const index = data.findIndex((l) => l.level === levelId);

      if (timeInSeconds === 0) return;

      if (index !== -1) {
        const current = data[index];
        const isBetter =
          current.bestTime === null ||
          timeInSeconds < current.bestTime ||
          (timeInSeconds === current.bestTime && moves < current.moves);

        if (isBetter) {
          data[index] = {
            ...current,
            bestTime: timeInSeconds,
            moves,
          };
          localStorage.setItem(storageKey, JSON.stringify(data));
          setStats(data);
        }
      }
    },
    [getStoredData]
  );

  const resetLevel = useCallback(
    (levelId) => {
      const data = getStoredData();
      const index = data.findIndex((l) => l.level === levelId);

      if (index !== -1) {
        data[index] = {
          ...data[index],
          bestTime: null,
          moves: 0,
        };
        localStorage.setItem(storageKey, JSON.stringify(data));
        setStats(data);
      }
    },
    [getStoredData]
  );

  const getLevelStats = useCallback(
    (levelId) => stats.find((s) => s.level === levelId),
    [stats]
  );

  return {
    stats,
    updateStats,
    resetLevel,
    getLevelStats,
  };
}
