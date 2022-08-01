import React, { useEffect, useRef } from "react";
import p5 from "p5";

const s = (sketch) => {
  let x = 100;
  let y = 100;
  let m1, m2, r;
  let bushes = [];
  let river = [];
  let mountain1 = [];
  let mountain2 = [];
  let fireflies = [];
  let moonRandom;
  let riverx,
    rivernoise = 0;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.background(0);
    moonRandom = sketch.createVector(
      sketch.random(sketch.width / 2, sketch.width),
      sketch.height - sketch.random(sketch.height / 1.5, sketch.height / 1.3)
    );
    bushes.push(sketch.loadImage("/bush.png"));
    bushes.push(sketch.loadImage("/flowerbush.png"));
    let b2 = sketch.loadImage("/bush2.png");
    bushes.push(b2);
    bushes.push(b2);
    bushes.push(b2);
    bushes.push(sketch.loadImage("/flower.png"));
    bushes.push(sketch.loadImage("/flower2.png"));

    let t = 0;
    sketch.noiseSeed(sketch.random(10, 20));
    for (let x = 0; x < sketch.width; x += 0.5) {
      let n = sketch.noise(t);
      t += 0.002;
      mountain2[x * 2] = n * sketch.height * 1.3;
    }
    m1 = new Mountain();
    m1.init();
    r = new River();
    r.init();
    for (let i = 0; i < 100; i++) {
      createFirefly();
    }
  };

  sketch.draw = () => {
    sketch.background(0);
    // moon
    sketch.fill(255);
    sketch.circle(moonRandom.x, moonRandom.y, 100);
    for (let i = 0; i < sketch.width; i += 0.5) {
      sketch.stroke(sketch.color(74, 50, 42));
      sketch.line(i, sketch.height, i, sketch.height - mountain2[i * 2]);
      sketch.stroke(255);
    }
    m1.show();
    for (let i = 0; i < fireflies.length; i++) {
      fireflies[i].update();
      fireflies[i].show();
      if (!fireflies[i].isOnScreen()) {
        fireflies.splice(i, 1);
        createFirefly();
      }
    }
    let t = 0;
    for (let i = 0; i < sketch.width; i += 45) {
      // convert noise to arr.length;
      let chosen = sketch.int((sketch.noise(t) * 100000) % bushes.length);
      const selectedBush = bushes[chosen];
      let dimensions = selectedBush.height % (sketch.height / 30);
      sketch.stroke(sketch.color(79, 24, 13));
      sketch.line(i, sketch.height, i, sketch.height - mountain1[i * 2]);
      sketch.stroke(255);
      sketch.image(
        selectedBush,
        i,
        sketch.height - river[i] - selectedBush.height / 30,
        selectedBush.width / dimensions,
        selectedBush.height / dimensions
      );
      t += 0.01;
    }
    r.show();
  };

  function Mountain() {
    this.init = () => {
      let t = 0;
      sketch.noiseSeed(sketch.random(10));
      for (let x = 0; x < sketch.width; x += 0.5) {
        let n = sketch.noise(t);
        t += 0.002;
        mountain1[x * 2] = n * sketch.height * 0.7;
      }

      this.show = () => {
        for (let i = 0; i < sketch.width; i += 0.5) {
          sketch.stroke(sketch.color(79, 24, 13));
          sketch.line(i, sketch.height, i, sketch.height - mountain1[i * 2]);
          sketch.stroke(255);
        }
      };
    };
  }

  function River() {
    this.init = () => {
      let t = 0;
      for (let x = 0; x < sketch.width; x++) {
        let n = sketch.noise(t);
        t += 0.01;
        river[x] = n * sketch.height * 0.3;
      }
    };

    this.show = () => {
      riverx = 0;
      for (let i = 0; i < sketch.width; i++) {
        let n = sketch.noise(riverx, rivernoise);
        riverx += 0.001;
        river[i] = n * sketch.height * 0.3;
        sketch.stroke(sketch.color(17, 120, 187));
        sketch.line(i, sketch.height, i, sketch.height - river[i]);
        sketch.stroke(255);
      }
      rivernoise += 0.01;
    };
  }

  function firefly(position, diameter, direction) {
    this.direction = direction;
    this.position = position;
    this.diameter = diameter;
    this.blinked = false;

    this.show = () => {
      sketch.fill(sketch.color(232, 255, 7));
      sketch.circle(this.position.x, this.position.y, this.diameter);
    };

    this.update = () => {
      this.move();
      this.blink();
    };

    this.blink = () => {
      if (sketch.int(sketch.random(1, 30)) === 2) {
        if (this.blinked) {
          this.diameter *= 4;
          this.blinked = false;
        } else {
          this.diameter /= 4;
          this.blinked = true;
        }
      }
    };

    this.move = () => {
      this.position = p5.Vector.add(this.position, this.direction);
    };

    this.isOnScreen = () => {
      return !(
        this.position.x > sketch.width ||
        this.position.x < 0 ||
        this.position.y > sketch.height ||
        this.position.y < 0
      );
    };
  }

  function getone() {
    if (sketch.int(sketch.random(1, 3)) === 2) {
      return 1;
    }
    return -1;
  }

  function createFirefly() {
    let created = new firefly(
      sketch.createVector(
        sketch.random(sketch.width),
        sketch.random(sketch.height)
      ),
      sketch.random(1, 5),
      sketch.createVector(
        sketch.random(0.5, 2) * getone(),
        sketch.random(0.5, 2) * getone()
      )
    );

    fireflies.push(created);
  }
};

function Fireflies(props) {
  const ref = useRef(null);

  useEffect(() => {
    let myp5 = new p5(s, ref.current);
  }, []);

  return <div ref={ref}></div>;
}

export default Fireflies;
