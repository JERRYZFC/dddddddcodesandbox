import React from "react";
import styled from "styled-components";

import { itemFX } from "./keyframes";

const Text = styled.div`
  box-sizing: border-box;
  display: inline-block;
  /* width: 100%; */
  flex: 1 0 0;

  margin: 10px 0;
  padding: 0 30px;

  font-size: 12px;
  line-height: 12px;
  text-align: center;

  /* border: 1px dashed #222; */

  ${itemFX}
`;

export default Text;
