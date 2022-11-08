import React, { useEffect, useRef } from "react";
import Zdog from "zdog";
import Calc from "../../utils/Calc";

// const RingGlobe = () => {
//   return <React.Fragment>Rings here ?</React.Fragment>;
// };

export default function RingGlobe(
  props = {
    width: 400,
    height: 400
  }
) {
  const { width, height } = props;

  const canvasRef = useRef();
  const addRef = useRef();
  const remRef = useRef();

  const style = { width, height };

  useEffect(() => {
    const cvs = canvasRef.current;
    const bttns = {
      add: addRef.current,
      rem: remRef.current
    };

    console.log("[ring.globe] init...", cvs);

    doZdog({
      canvas: cvs,
      buttons: bttns,
      ringDiameter: width / 2
    });
  }, []);

  // return <canvas ref={canvasRef} width={width} height={height} style={style} />;
  return (
    <React.Fragment>
      <button ref={addRef}>add</button>
      <button ref={remRef}>rem</button>
      <canvas ref={canvasRef} width={width} height={height} style={style} />
    </React.Fragment>
  );
}

const doZdog = ({ canvas, buttons, ringDiameter = 350 }) => {
  let illo;
  let isSpinning = true;
  let ringGroup;
  let rings = [];
  let ringCount = 7;
  // let ringDiameter = 350;
  let starGroup;
  let stars = [];
  let starCount = 300;
  let starRange = 200;

  const setupScene = () => {
    illo = new Zdog.Illustration({
      element: canvas,
      dragRotate: true,
      // stop spinning when drag starts
      onDragStart: function() {
        isSpinning = false;
      },
      // resize: true,
      zoom: 1
      // onPrerender: function( ctx ) {
      //   ctx.fillStyle = '#ccc';
      //   ctx.fillRect( -1, -120, 1, 240 );
      //   ctx.fillRect( -120, -1, 240, 1 );
      // },
      // onResize: function( width ) {
      //   // scale zoom
      //   this.zoom = width / 300;
      // },
    });

    ringGroup = new Zdog.Group({ addTo: illo });
    starGroup = new Zdog.Group({ addTo: illo });

    ringGroup.render = function(ctx) {
      ctx.globalCompositeOperation = "screen";
      Zdog.Group.prototype.render.apply(this, arguments);
    };
  };

  const setupGlobe = () => {
    for (let i = 0; i < ringCount; i++) {
      let p = i / (ringCount - 1);
      rings.push({
        shape: new Zdog.Ellipse({
          addTo: ringGroup,
          diameter: (Math.sin((p * Zdog.TAU) / 2) * ringDiameter) / 2,
          translate: { z: (Math.cos((p * Zdog.TAU) / 2) * ringDiameter) / 4 },
          rotate: { z: Calc.rand(Zdog.TAU) },
          color: `hsla(${Calc.map(p, 0, 1, 180, 360)}, 90%, 50%, 1)`,
          quarters: Calc.randInt(1, 3)
        }),
        spin: Calc.rand(0.001, 0.03)
      });
    }

    for (let i = 0; i < starCount; i++) {
      stars.push({
        shape: new Zdog.Ellipse({
          addTo: starGroup,
          diameter: 0,
          translate: {
            x: Calc.rand(-starRange * 2, starRange * 2),
            y: Calc.rand(-starRange * 2, starRange * 2),
            z: Calc.rand(-starRange * 2, starRange * 2)
          },
          stroke: Calc.rand(0.5, 2),
          color: `hsla(0, 0%, 100%, ${Calc.rand(0.1, 1)})`
        })
      });
    }
  };

  const rotateRings = () => {
    for (let i = 0, len = rings.length; i < len; i++) {
      let ring = rings[i].shape;
      ring.stroke = Calc.map(
        Math.sin(Date.now() * 0.005 + i * 0.2),
        -1,
        1,
        1,
        3
      );
      ring.rotate.z += rings[i].spin;
    }
  };

  const rotateStars = () => {
    for (let i = 0, len = stars.length; i < len; i++) {
      let star = stars[i].shape;
      star.stroke = Calc.map(
        Math.sin(Date.now() * 0.002 + i * 0.4),
        -1,
        1,
        0.5,
        2
      );
    }
  };

  const animate = () => {
    if (isSpinning) {
      ringGroup.rotate.y -= 0.003;
      ringGroup.rotate.x += 0.003;

      starGroup.rotate.y += 0.0005;
      starGroup.rotate.x -= 0.0007;
      starGroup.rotate.z -= 0.0009;
    }

    rotateRings();
    rotateStars();

    illo.updateRenderGraph();
    window.requestAnimationFrame(animate);
  };

  const getNewRing = () => {
    let p = ((rings.length - 1) * Math.random()) / rings.length;

    return {
      shape: new Zdog.Ellipse({
        addTo: ringGroup,
        diameter: (Math.sin((p * Zdog.TAU) / 2) * ringDiameter) / 2,
        translate: { z: (Math.cos((p * Zdog.TAU) / 2) * ringDiameter) / 4 },
        rotate: { z: Calc.rand(Zdog.TAU) },
        color: `hsla(${Calc.map(p, 0, 1, 180, 360)}, 90%, 50%, 1)`,
        quarters: Calc.randInt(1, 3)
      }),
      spin: Calc.rand(0.001, 0.03)
    };
  };

  setupScene();
  setupGlobe();
  animate();

  const addRing = () => {
    rings.push(getNewRing());
    ringGroup.updateGraph();
  };

  const removeRing = () => {
    const ringIdx = ~~(Math.random() * rings.length);
    const ring = rings[ringIdx];

    // ring.shape.remove();
    ringGroup.removeChild(ring.shape);

    rings.splice(ringIdx, 1);
    ringGroup.updateGraph();
  };

  buttons.add.addEventListener("click", addRing);
  buttons.rem.addEventListener("click", removeRing);
  // return [addRing, removeRing];
};
