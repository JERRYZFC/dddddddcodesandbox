import React, { useRef, useEffect } from "react";

const MyCanvas = ({
  width = 100,
  height = 100,
  draw = ({ canvas, ctx, pixelRatio }) => {},
  pixelRatio = window.devicePixelRatio
}) => {
  const canvas = useRef(null);
  const context = useRef(null);

  useEffect(() => {
    context.current = canvas.current.getContext("2d");

    draw({
      canvas: canvas.current,
      ctx: context.current,
      pixelRatio
    });
  }); // , [draw, pixelRatio]);

  const dw = Math.floor(pixelRatio * width);
  const dh = Math.floor(pixelRatio * height);
  const style = { width, height };

  return <canvas ref={canvas} width={dw} height={dh} style={style} />;
};

export default MyCanvas;
