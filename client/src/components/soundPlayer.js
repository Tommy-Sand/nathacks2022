import React, { useEffect, useRef, useState } from "react";
import guitar from "../sounds/guitar.mp3";
import birds from "../sounds/birds.mp3";
import river from "../sounds/river.mp3";

function SoundController({ rate }) {
  let birdrate = 1;
  if ((Math.abs(rate) % 100) / 100 < 0.1) {
    birdrate = 20;
  }
  return (
    <div>
      <SoundPlayer rate={rate * 2} soundSource={guitar} />
      <SoundPlayer rate={birdrate} soundSource={birds} />
      <SoundPlayer rate={1} soundSource={river} />
    </div>
  );
}

function SoundPlayer({ rate, soundSource }) {
  const ref = useRef(null);
  let soundFeatures, setSoundFeatures;
  [soundFeatures, setSoundFeatures] = useState({});

  const play = () => {
    ref.current.play();
  };

  const pause = () => {
    ref.current.pause();
  };

  const setVol = (vol) => {
    ref.current.volume = vol;
  };

  useEffect(() => {
    ref.current.loop = true;
    play();
    setVol(1 / 100);
  }, []);

  useEffect(() => {
    setVol((Math.abs(rate) % 100) / 100);
  }, [rate]);

  return (
    // what controls?
    // a global loudness?
    //
    <div>
      <audio ref={ref}>
        <source src={soundSource} />
      </audio>
    </div>
  );
}

export default SoundController;
