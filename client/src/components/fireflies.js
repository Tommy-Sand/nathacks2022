import React, { useEffect, useRef } from "react";
import p5 from "p5";

const s = (sketch) => {
  let x = 100;
  let y = 100;
  let m1, m2, r;
  let river = [];
  let mountain1 = [];
  let mountain2 = [];
  let fireflies = [];

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.background(0);
    m1 = new Mountain();
    m1.init();
    r = new River();
    r.init();
    m2 = new Mountain();
    m2.init();
    for (let i = 0; i < 10; i++) {
      createFirefly();
    }
  };

  sketch.draw = () => {
    sketch.background(0);
    r.show();
    m1.show();
    for (let i = 0; i < fireflies.length; i++) {
      fireflies[i].update();
      fireflies[i].show();
      if (!fireflies[i].isOnScreen()) {
        fireflies.splice(i, 1);
        createFirefly();
      }
    }
  };

  function Mountain() {
    this.init = () => {
      let t = 0;
      for (let x = 0; x < sketch.width; x++) {
        let n = sketch.noise(t);
        t += 0.01;
        mountain1[x] = n * 100;
      }

      this.show = () => {
        for (let i = 0; i < sketch.width; i++) {
          sketch.stroke(sketch.color("brown"));
          sketch.line(i, sketch.height, i, sketch.height - mountain1[i]);
          sketch.stroke(255);
        }
      };
    };
  }

  function River() {
    this.init = () => {
      let t = 0;
      for (let i = 0; i < sketch.width; i++) {
        sketch.noiseSeed(sketch.random());
        let n = sketch.noise(t);
        t += 0.009;
        river[i] = n * 60;
      }
    };

    this.show = () => {
      for (let i = 0; i < sketch.width; i++) {
        sketch.stroke(sketch.color("blue"));
        sketch.line(i, sketch.height, i, sketch.height - 100 - river[i]);
        sketch.stroke(255);
      }
    };
  }

  function firefly(position, diameter, direction) {
    this.direction = direction;
    this.position = position;
    this.diameter = diameter;
    this.blinked = false;

    this.show = () => {
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
