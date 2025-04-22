class LevelStorageManager {
  constructor(storageKey = "__grid_rush_levels") {
    this.storageKey = storageKey;
    this.levelData = this.loadData();
  }

  loadData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.levelData));
  }

  getBestStats(level) {
    return this.levelData[level] || null;
  }

  updateStats(level, timeInSeconds, moves) {
    const current = this.levelData[level];

    if (
      !current ||
      timeInSeconds < current.bestTime || // better time
      (timeInSeconds === current.bestTime && moves < current.moves) // same time, fewer moves
    ) {
      this.levelData[level] = {
        bestTime: timeInSeconds,
        moves: moves,
      };
      this.saveData();
    }
  }

  resetLevel(level) {
    delete this.levelData[level];
    this.saveData();
  }

  clearAllData() {
    localStorage.removeItem(this.storageKey);
    this.levelData = {};
  }
}
