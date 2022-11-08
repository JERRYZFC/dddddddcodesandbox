import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

const CYAN = styled.div`
  color: magenta;
`;

// const Scrambler = () => {
//   return <CYAN>hello neo?</CYAN>;
// };

const Scrambler = ({ size = 300 }) => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;

    console.log("[scrambler] container: ", container);
    container.innerHTML = "test?";
  }, []);

  return (
    <React.Fragment>
      <CYAN ref={containerRef} />
    </React.Fragment>
  );
};

export default Scrambler;
