import React, { useEffect, useRef, useState } from "react";
import guitar from "../sounds/guitar.mp3";

function SoundController() {
  return (
    <div>
      <SoundPlayer soundSource={guitar} />
    </div>
  );
}

function SoundPlayer({ soundSource }) {
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
    play();
    setVol(1 / 100);
  }, []);

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
