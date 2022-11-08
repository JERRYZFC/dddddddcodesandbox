import React, { useRef, useEffect } from "react";

const glRenderTest = gl => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

// Usage
export default function GlCanvas({
  width = 100,
  height = 100,
  draw = ({ canvas, ctx, pixelRatio }) => {},
  loop = true
}) {
  // const canvasRef = useCanvas(glRenderTest, "webgl2");
  const canvasRef = useCanvas(draw, loop);
  const style = { width, height };

  return <canvas ref={canvasRef} width={width} height={height} style={style} />;
  // return <div>da fak bro?</div>;
}

// Hook
function useCanvas(
  draw = ({ canvas, ctx, pixelRatio }) => {},
  loop = false,
  options = {
    context: "2d",
    pixelRatio: window.devicePixelRatio
  }
) {
  const { context, pixelRatio } = options;

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    contextRef.current = canvasRef.current.getContext(context);
    // draw(canvasRef.current, contextRef.current, pixelRatio);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    let animationFrameId = null;

    const renderFrame = () => {
      if (loop) {
        animationFrameId = requestAnimationFrame(renderFrame);
      }

      draw({ canvas, ctx, pixelRatio });
    };

    // kick it!
    animationFrameId = requestAnimationFrame(renderFrame);

    return () => cancelAnimationFrame(animationFrameId);
  }, [draw, pixelRatio, loop]);

  return canvasRef;
}
