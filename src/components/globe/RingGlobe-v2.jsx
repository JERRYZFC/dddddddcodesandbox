import React, { memo, useEffect, useRef } from "react";
import Zdog from "zdog";
import Calc from "../../utils/Calc";

// const RingGlobe = () => {
//   return <React.Fragment>Rings here ?</React.Fragment>;
// };

const INITIAL_PROPS = {
  width: 400,
  height: 400
};

export default function RingGlobe(props = INITIAL_PROPS) {
  const { width, height } = props;

  const canvas = useRef();
  const style = { width, height };

  useEffect(() => {
    console.log("[ring.globe] init...");

    // #PSEUDO
    // setup Zdog illustration
    // add main scene obj
    // update graph
    // set render function
    // start render loop
  }, []);

  // return <canvas ref={canvasRef} width={width} height={height} style={style} />;
  return (
    <React.Fragment>
      <Illustration />
    </React.Fragment>
  );
}

const Illustration = React.memo(props => {
  const { children } = props;

  return <React.Fragment>meh illustration ?{children}</React.Fragment>;
});
