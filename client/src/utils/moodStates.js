const moodMeaning = {
  delta: "sleep",
  theta: "sleep",
  alpha: "relaxed",
  gamma: "focused",
  beta: "focused",
};

const moodSpeed = {
  sleep: 10,
  relaxed: -1,
  focused: -2,
};

const processMood = (current, prev) => {
  const change = {};
  let changeNum = 0;
  for (const key of Object.keys(current)) {
    if (key !== "second") {
      change[key] = current[key] - prev[key];
    }
  }
  for (const key of Object.keys(change)) {
    changeNum += change[key] * moodSpeed[moodMeaning[key]];
  }
  return changeNum / 100;
};

export { processMood };
