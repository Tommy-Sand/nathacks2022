const moodMeaning = {
  delta: "sleep",
  theta: "sleep",
  alpha: "relaxed",
  gamma: "focused",
  beta: "focused",
};

const moodSpeed = {
  sleep: 8,
  relaxed: 1,
  focused: 5,
};

const processMood = (data) => {
  console.log(data);
  let highest = 0;
  for (const key of data.keys()) {
    if (data[key] > highest) {
      highest = key;
    }
  }
  console.log(highest);
  return moodSpeed[moodMeaning[highest]];
};

export { processMood };
