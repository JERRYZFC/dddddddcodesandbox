import React, { useRef, useEffect, useState } from "react";
import styled, { css } from "styled-components";

import * as THREE from "three";
import { Canvas, useFrame } from "react-three-fiber";
import leGlobe from "../three/globe";

import { itemFX, testKeyframes, blinkKeyframes } from "./keyframes";

import Section from "./section";
import Text from "./text";

// rnd
import Chance from "chance";
const chance = new Chance();


const Time = styled.p`
  margin: 0;

  font-size: 80px;
  font-weight: 400;
  line-height: 80px;
`;

const Container = styled.div`
  /* font-family: "Rajdhani", sans-serif; */
  padding: 20px;

  background: #000;
  color: #fff;
`;

const Header = styled.div`
  p {
    margin: 0;
    line-height: 1;
  }

  h1 {
    padding: 0;
    margin: 0 0 10px;

    color: #eee;

    font-size: 40px;
    font-weight: 100;
    line-height: 1;
  }
`;

const CODE_COLOR_THEME = "#57ff57";
// const CODE_COLOR_THEME = 'lime';
// const CODE_COLOR_THEME = 'red';

const Code = styled.pre`
  font-family: "Anonymous Pro", monospace;
  font-size: 16px;
  font-weight: 100;

  color: ${props => props.color || CODE_COLOR_THEME};

  opacity: 1;
  animation: ${testKeyframes} 16ms alternate;
  animation-iteration-count: infinite;

  &:hover {
    animation-name: none;
    /* animation-iteration-count: 0; */
  }
`;

const Cursor = styled.span`
  font-family: "Anonymous Pro", monospace;
  font-size: 16px;
  font-weight: 100;

  color: ${props => (props.color ? props.color : CODE_COLOR_THEME)};
  /* text-shadow: 0 0 5px rgba(255, 255, 255, 0.2); */

  opacity: 1;
  animation: ${blinkKeyframes} 1s linear infinite;
`;

const Wireframe = ({ size = 300 }) => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const globe = leGlobe(container, { width: size, height: size });

    globe.render();
  }, [size]);

  return (
    <React.Fragment>
      <div ref={containerRef} />
    </React.Fragment>
  );
};

function Wire() {
  const ref = useRef();
  const [isHovering, setHoverState] = useState(false);

  useFrame(() => (ref.current.rotation.y += 0.008));

  return (
    <mesh
      ref={ref}
      onClick={e => console.log("click")}
      onPointerOver={e => {
        console.log("hover");
        setHoverState(true);
      }}
      onPointerOut={e => {
        console.log("unhover");
        setHoverState(false);
      }}
    >
      <sphereGeometry attach="geometry" args={[2, 10, 7]} />
      <meshBasicMaterial
        attach="material"
        color={isHovering ? "magenta" : "hotpink"}
        wireframe
        wireframeLinewidth={10}
      />
    </mesh>
  );
}

const Status = styled.span`
  display: inline-block;
  vertical-align: middle;
  width: 10px;
  height: 10px;
  border-radius: 50%;

  line-height: 1;

  background: ${props => (props.color ? props.color : "magenta")};
`;

// LE HUD
const Hud = () => {
  const [seed, setSeed] = useState(~~(Math.random() * 2));
  const [timezone, setTimeZone] = useState(null);

  const status = !!seed;
  const theme = ["lime", "red"][seed];
  const themeHover = ["0, 255, 0", "255, 0, 0"][seed];

  useEffect(() => {
    setTimeZone(chance.timezone());

    setInterval(() => {
      setSeed(~~(Math.random() * 2));
      //   setTimeZone(chance.timezone());
    }, 3000);
  }, []);

  return (
    <Container multilevel>
      <Section direction="row" hoverColor={themeHover} multilevel>
        <Section>
          <Header>
            <h1>PANEL</h1>
            <p>PAV ( PERSONAL LYTIX VIEW )</p>
            <p>BUILD: #0{~~(Math.random() * 7e9)}</p>
            <p>REV: 1.0{~~(Math.random() * 9000)}</p>
            <p>NAME: {chance.name({ middle_initial: true })}</p>
            <br />
            <p>LOC: {chance.address()}</p>
            <p>POS: {chance.coordinates({ fixed: 3 })}</p>
            <br />
            <p>
              STATUS: <Status color={theme} />
            </p>
          </Header>
        </Section>

        <Section>
          <Code color={theme}>{JSON.stringify(timezone, null, 2)}</Code>
        </Section>
      </Section>

      <Section>
        <Section.Title upper>Time entered this Week</Section.Title>
        <Section direction="row" hoverColor={themeHover}>
          <Text>
            <Time>80%</Time>
            DAY
          </Text>
          <Text>
            <Time>40%</Time>
            WEEK
          </Text>
          <Text>
            <p>TIME WORKED TODAY: 7:22:12</p>
            <p>TIME WORKED THIS WEEK: 7:22:12</p>
            <p>TIME WORKED THIS MONTH: 7:22:12</p>
          </Text>
        </Section>
      </Section>

      <Section direction="row" hoverColor={themeHover}>
        <Section>
          <Section.Title upper>Pure</Section.Title>
          <Wireframe />
          {/* <Wireframe size={500} /> */}
        </Section>

        <Section hoverColor={themeHover}>
          <Section.Title upper>Hook</Section.Title>
          <Canvas>
            <Wire />
          </Canvas>
        </Section>
      </Section>

      <Section multilevel hoverColor={themeHover}>
        <Section.Title upper>Terminal Flickering</Section.Title>
        <Section direction="row">
          <Section>
            <Code color={theme}>
              {`
// Example Dummy Code
// ------------------------
#include iostream;
int main() {
  cout >> "Hello, World!" >> endl;
}
              `}
            </Code>
            <Cursor color={theme}>█</Cursor>
          </Section>

          {/* <Section>
            <Code color={theme}>{JSON.stringify(timezone, null, 2)}</Code>
          </Section> */}
          <Section>
            <Section.Title>Hey ho, let's go</Section.Title>
            <p>
              Here be some content ? Lorem ipsum dolor sit amet um num ist gul
              vex ber
            </p>
            <Section>
              <p>{chance.paragraph({ sentences: 2 })}</p>
            </Section>
          </Section>
        </Section>
      </Section>
    </Container>
  );
};

export default Hud;
