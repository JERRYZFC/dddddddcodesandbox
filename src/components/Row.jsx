import React from "react";

const resetStyle = { padding: 0, margin: 0 };

const Row = props => {
  return (
    <section style={{ marginTop: "20px" }}>
      <h4 style={{ ...resetStyle, color: "#999" }}>{props.label}</h4>
      <h2 style={resetStyle}>{props.children}</h2>
    </section>
  );
};

export default Row;
