// import "./utils/polyfills";

import React from "react";
import ReactDOM from "react-dom";

// // import Row from './Row';
// import Greet from "./Greet";
// import Hello from "./Hello";
import Canvas from "./components/canvas/Canvas";
import MyCanvas from "./components/canvas/MyCanvas";
import GlCanvas from "./components/canvas/GlCanvas";

import Map from "./components/map/Map";
// import Graph from "./components/Graph";
// import RingGlobeV1 from "./components/globe/RingGlobe-v1";
// import RingGlobeV2 from "./components/globe/RingGlobe-v2";
import HUD from "./components/hud/hud";
import Scrambler from "./components/hud/scrambler";
import leGlobe from "./components/three/globe";

// import "./test-rx";

import "./styles.css";

// define a rectangle to rotate
const rect = { size: 10 };
const padding = 10;
const spacing = rect.size * 2;

const drawRect = ctx => {
  // ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, 1)`;
  ctx.fillRect(0, 0, rect.size, rect.size);
};

const drawGrid = (ctx, gridSize = 3) => {
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      ctx.save();

      ctx.translate(padding + j * spacing, padding + i * spacing);
      drawRect(ctx);

      ctx.restore();
    }
  }
};

const drawSomething = ({ canvas, ctx, pixelRatio }) => {
  const { width, height } = canvas;

  const boxSize = rect.size;
  const mid = width / 2 - boxSize / 2;

  // ctx.save();
  // clear canvas
  // ctx.scale(pixelRatio, pixelRatio);
  ctx.fillStyle = "green";
  ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, 0.3)`;
  ctx.fillRect(0, 0, width, height);

  // ctx.fillStyle = 'cyan';
  // ctx.fillRect(0, 0, rect.size, rect.size);
  ctx.save();
  const gridItems = 2;
  const gridTotalSize = gridItems * spacing - padding;
  ctx.translate(width / 2 - gridTotalSize, height / 2 - gridTotalSize);

  ctx.fillStyle = "magenta";
  drawGrid(ctx, gridItems);
  ctx.restore();

  ctx.save();
  ctx.translate(width / 2 - rect.size / 2, height / 2 - rect.size / 2);
  ctx.fillStyle = "cyan";
  drawRect(ctx);
  ctx.restore();
  ctx.rotate(~~(Math.random() * 4) * (Math.PI / 180));
};

function App() {
  return (
    <div>
      APP ROOT
      <hr />
      {/* <Greet />
      <Hello />
      <Hello name="Deadpooly" />
      <Greet name="Joker" />*/}
      <Canvas width={200} height={200} draw={drawSomething} />
      <MyCanvas width={200} height={200} draw={drawSomething} />
      <GlCanvas width={200} height={200} draw={drawSomething} /> */}
      {/* <hr />
      <hr />
      <hr /> */}
      <Map />
      {/* <Graph /> */}
      {/* <Globe /> */}
      {/* <RingGlobeV1 width={window.innerWidth} height={window.innerHeight} /> */}
      {/* <Scrambler /> */}
      <HUD />
    </div>
  );
}

const root = document.getElementById("root");
ReactDOM.render(<App />, root);

// leGlobe(root);
