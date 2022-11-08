import React from "react";

export default class Canvas extends React.Component {
  canvas = null;
  ctx = null;

  constructor(
    props = {
      width: 100,
      height: 100,
      draw: ({ canvas, ctx, pixelRatio }) => {},
      pixelRatio: window.devicePixelRatio
    }
  ) {
    super(props);
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext("2d");

    // this.props.draw(this.canvas, this.ctx, this.props.pixelRatio);
    this.props.draw({
      canvas: this.canvas,
      ctx: this.ctx,
      pixelRatio: this.props.pixelRatio
    });
  }

  render() {
    const { width, height, pixelRatio } = this.props;

    // const dw = Math.floor(pixelRatio * width);
    // const dh = Math.floor(pixelRatio * height);
    const style = { width, height };

    return (
      <canvas
        ref={node => (this.canvas = node)}
        width={width}
        height={height}
        style={style}
      />
    );
  }
}
