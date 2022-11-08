// import React from 'react';
import { css, keyframes } from "styled-components";

export const fadeAndScaleKeyframes = keyframes`
  0% {
    opacity: 0;
    transform: scale(.9, .9);
  }
  75% {
    opacity: 0.9;
    /* transform: scale(1, 1); */
  }
  90% {
    opacity: 0.5;
   /* transform: scale(1, 1) */
  }
  100% {
    opacity: 1;
    transform: scale(1, 1);
  }
`;

export const flickerColorKeyframes = keyframes`
  0% { color: #57ff57; }
  50% { color: #57aa57; }
  100% { color: #57ff57; }
`;

export const testKeyframes = keyframes`
  0.01% { opacity: 0; }
  70.01% { opacity: 1; }
  100% { opacity: 1; }
`;

export const cursorBlinkKeyframes = keyframes`
  50% { background-color: #57ff57; }
`;

export const blinkKeyframes = keyframes`
  0.01% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
	50.01% {
		opacity: 1;
  }
`;

export const scaleFX = css`
  transform-origin: 50% 100%;

  animation-duration: 0.7s;
  animation-name: ${fadeAndScaleKeyframes};
  /* animation-timing-function: cubic-bezier(.71,.55,.62,1.57); */
`;

export const itemFX = css`
  opacity: 0;
  transform-origin: 50% 100%;

  animation-delay: 0.7s;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
  animation-name: ${fadeAndScaleKeyframes};
  /* animation-timing-function: cubic-bezier(.71,.55,.62,1.57); */
`;
