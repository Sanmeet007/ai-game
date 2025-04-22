export function formatSeconds(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export const levelDetails = {
  1: {
    gridSize: 3,
    imagesFolder: "3x3",
    tileSize: "10rem",
  },
  2: {
    gridSize: 4,
    imagesFolder: "4x4",
    tileSize: "8rem",
  },
  3: {
    gridSize: 5,
    imagesFolder: "5x5",
    tileSize: "6rem",
  },
  4: {
    gridSize: 6,
    imagesFolder: "6x6",
    tileSize: "5rem",
  },
  5: {
    gridSize: 7,
    imagesFolder: "7x7",
    tileSize: "4rem",
  },
};
