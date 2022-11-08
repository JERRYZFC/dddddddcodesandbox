import React, { useState, useEffect, useRef } from "react";
// import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import ForceGraph2D from "react-force-graph-2d";
import ForceGraph3D from "react-force-graph-3d";

import DatGui, {
  DatBoolean,
  DatColor,
  DatNumber,
  DatString,
  DatButton,
  DatSelect
} from "react-dat-gui";

import "react-dat-gui/build/react-dat-gui.css";

import "d3-quadtree";
import { forceCollide } from "d3-force";

// meh ?
const getRandomTree = (N = 20, initialN = 0) => {
  return {
    nodes: [...Array(N).keys()].map(i => ({ id: initialN + i })),
    links: [...Array(N).keys()]
      .filter(id => id)
      .map(id => ({
        source: initialN + id,
        target: Math.round(Math.random() * (initialN + id - 1))
      }))
  };
};

// gen a number persistent color from around the palette
const getColor = n =>
  "#" + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, "0");

// config
const prepopulate = true;
const GRAPH_DISTANCE = 500;
const GRAPH_CAMERA_UPDATE = 10;
const GRAPH_UPDATE_INTERVAL = 500;
const GRAPH_DAG_MODES = ["", "td", "bu", "lr", "rl", "radialout", "radialin"];

const GROUPS = 12;
// const graphData = getRandomTree();
const INITIAL_GRAPH = {
  nodes: [{ id: 0 }],
  links: []
};

const DebugJSON = (props = {}) => {
  return (
    <ul>
      {Object.keys(props).map(it => (
        <li key={it}>
          {it} : {JSON.stringify(props[it])}
        </li>
      ))}
    </ul>
  );
};

const Graph = () => {
  const graphRef = useRef(null);
  const [graphData, setGraph] = useState(
    prepopulate ? getRandomTree() : INITIAL_GRAPH
  );

  const [guiState, setGui] = useState({
    autoGenerate: false,
    generateSpeed: 1000,
    use3d: false,
    dagMode: "",
    dagLevelDistance: 20,
    cameraDistance: GRAPH_DISTANCE,
    cameraRotate: false
  });

  const handleGuiUpdate = data => setGui(data);

  const GraphComponent = guiState.use3d ? ForceGraph3D : ForceGraph2D;

  const addRandomNode = () => {
    // console.log("[GRAPH] dynamic add..");

    const { nodes, links } = graphData;
    const id = nodes.length;

    const tree = {
      nodes: [...nodes, { id }],
      links: [
        ...links,
        {
          source: id,
          target: Math.round(Math.random() * (id - 1))
        }
      ]
    };

    // debugger;
    setGraph(tree);
  };

  const addRandomTree = (N = 5) => {
    const newGraph = getRandomTree(N, graphData.nodes.length);

    const tree = {
      nodes: [...graphData.nodes, ...newGraph.nodes],
      links: [...graphData.links, ...newGraph.links]
    };

    setGraph(tree);
  };

  const testAddNode = () => addRandomTree();

  const asyncAdd = (time = 2000) => {
    return new Promise(resolve => {
      console.log("spawn in.. ", time);
      setTimeout(() => {
        // addRandomNode();
        addRandomTree(~~(Math.random() * 10));
        resolve();
      }, time);
    });
  };

  useEffect(() => {
    console.log("[GRAPH] on mount...");

    // add collision force
    graphRef.current.d3Force(
      "collision",
      forceCollide(node => Math.sqrt(100 / (node.id + 1)))
    );
  }, []);

  useEffect(() => {
    let tickerId = null;

    if (guiState.autoGenerate) {
      console.log("[GRAPH] init fx...");

      tickerId = setTimeout(async () => {
        await asyncAdd(~~(Math.random() * 100 * 5));
      }, guiState.generateSpeed);
    }

    return () => {
      // console.log("[GRAPH] clear ticker...");
      clearTimeout(tickerId);
    };
  }, [guiState.autoGenerate, guiState.generateSpeed, graphData.nodes]);

  useEffect(() => {
    if (guiState.use3d) {
      console.log("[GRAPH] set CAMERA position...");
      graphRef.current.cameraPosition &&
        graphRef.current.cameraPosition({ z: guiState.cameraDistance });
    }
  }, [guiState.use3d, guiState.cameraDistance]);

  // add camera rotation
  useEffect(() => {
    let tickerId = null;

    if (guiState.use3d && guiState.cameraRotate) {
      console.log("[GRAPH] add CAMERA rotation...", guiState.use3d);

      // graphRef.current.cameraPosition &&
      //   graphRef.current.cameraPosition({ z: guiState.cameraDistance });

      // camera orbit
      let angle = 0;
      tickerId = setInterval(() => {
        graphRef.current.cameraPosition &&
          graphRef.current.cameraPosition({
            x: guiState.cameraDistance * Math.sin(angle),
            z: guiState.cameraDistance * Math.cos(angle)
          });

        angle += Math.PI / 300;
      }, GRAPH_CAMERA_UPDATE);
    }

    return () => {
      clearInterval(tickerId);
    };
  }, [guiState.use3d, guiState.cameraRotate, guiState.cameraDistance]);

  const onNodeClick = node => {
    console.log("zoom to:", node);

    if (!guiState.use3d) {
      // Center/zoom on node
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(3, 2000);
    } else {
      // Aim at node from outside it
      const distance = 200;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      graphRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        3000 // ms transition duration
      );
    }
  };

  const onNodeHover = node => {
    // adjust mouse pointer
    if (graphRef.current.rootElem) {
      graphRef.current.rootElem.style.cursor = node ? "pointer" : null;
    }
  };

  const drawNode = ({ id, x, y }, ctx) => {
    ctx.fillStyle = getColor(id);
    [
      () => {
        ctx.fillRect(x - 6, y - 4, 12, 8);
      }, // rectangle
      () => {
        ctx.beginPath();
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x - 5, y + 5);
        ctx.lineTo(x + 5, y + 5);
        ctx.fill();
      }, // triangle
      () => {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
        ctx.fill();
      }, // circle
      () => {
        ctx.font = "10px Sans-Serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`node-${id}`, x, y);
      } // text
    ][id % 4]();
  };

  return (
    <React.Fragment>
      {/* <button onClick={testAdd}>add to graph?</button> */}
      <DebugJSON nodes={graphData.nodes.length} />
      <DatGui
        style={{ zIndex: 9999 }}
        data={guiState}
        onUpdate={handleGuiUpdate}
      >
        <DatButton label="Test add" onClick={testAddNode} />
        <DatNumber
          path="dagLevelDistance"
          label="DAG power"
          min={10}
          max={300}
          step={1}
        />
        <DatSelect path="dagMode" label="DAG mode?" options={GRAPH_DAG_MODES} />
        <DatBoolean path="autoGenerate" label="Auto generate" />
        <DatBoolean path="use3d" label="Awesome?" />
        <DatBoolean path="cameraRotate" label="Rotate?" />
        <DatNumber
          path="generateSpeed"
          label="Generate speed"
          min={100}
          max={2000}
          step={100}
        />
        <DatNumber
          path="cameraDistance"
          label="Camera distance"
          min={10}
          max={1000}
          step={1}
        />
        {/* <DatString path="package" label="Package" /> */}
        {/* <DatColor path="feelsLike" label="Feels Like" /> */}
      </DatGui>
      <GraphComponent
        backgroundColor="#f1f1f1"
        // width={400}
        // height={500}
        ref={graphRef}
        dagMode={guiState.dagMode ? guiState.dagMode : null}
        dagLevelDistance={guiState.dagLevelDistance} //graphData.nodes.length}
        graphData={graphData}
        nodeId="id"
        nodeAutoColorBy={node => node.id % GROUPS}
        nodeRelSize={1}
        nodeLabel={node => `node-${node.id}`}
        linkWidth={guiState.use3d ? 4 : 2}
        linkAutoColorBy={node =>
          graphData.nodes[node.source.id || node.source].id % GROUPS
        }
        linkDirectionalParticles={1}
        onNodeClick={onNodeClick}
        onNodeHover={onNodeHover}
        nodeCanvasObject={drawNode}
      />
    </React.Fragment>
  );
};

export default Graph;
