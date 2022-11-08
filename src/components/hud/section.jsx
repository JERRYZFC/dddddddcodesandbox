import React from "react";
import styled, { css } from "styled-components";

import Text from "./text";

import { scaleFX } from "./keyframes";

const HOVER_COLOR = "255, 0, 255";

const borderHoverFX = css`
  &:hover {
    // plain basic coloring
    border-color: rgba(${props => props.hoverColor || HOVER_COLOR}, 0.2);

    // multi level coloring (increases brightness)
    ${props =>
      props.multilevel &&
      css`
        & > & {
          border-color: rgba(${props => props.hoverColor || HOVER_COLOR}, 0.4);
        }

        & > & > & {
          border-style: dotted;
          border-color: rgba(${props => props.hoverColor || HOVER_COLOR}, 0.6);
        }

        & > & > & > & {
          border-style: solid;
          border-color: rgba(${props => props.hoverColor || HOVER_COLOR}, 0.8);
        }
      `}
  }
`;

const Section = styled.div`
  box-sizing: border-box;
  position: relative;

  vertical-align: top;
  display: inline-flex;
  width: ${props => (props.width ? props.width : "100%")};
  flex-direction: column;

  ${props =>
    props.direction &&
    css`
      flex-direction: ${props.direction};
      ${Text} {
        margin: 0;
      }
    `}

  padding: 20px;
  margin-bottom: 20px;

  background: #000;
  border: 1px dashed rgba(255, 0, 255, 0);

  overflow: hidden;

  ${scaleFX}
  ${borderHoverFX}
`;

const Title = styled.div`
  display: block;
  width: 100%;

  padding: 0 0 20px;
  margin: 0 0 20px;

  font-size: 24px;
  font-weight: 400;
  line-height: 1;

  border-bottom: 1px solid #eee;

  ${props =>
    props.upper &&
    css`
      text-transform: uppercase;
    `}
`;

Section.Title = Title;

export default Section;
