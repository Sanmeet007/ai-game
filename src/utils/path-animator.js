async function* generatePathStates(path) {
  if (!Array.isArray(path)) return;
  for (const state of path) {
    yield state;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

async function animatePath(path, setBoard, pathUpdateCallBack = null) {
  if (!path || !Array.isArray(path) || path.length === 0) {
    console.warn("Invalid or empty path provided to animatePath");
    return;
  }
  for await (const state of generatePathStates(path)) {
    setBoard(state);
    if (pathUpdateCallBack != null) {
      pathUpdateCallBack();
    }
  }
}

export { animatePath };
