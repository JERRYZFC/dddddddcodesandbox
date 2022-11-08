import * as THREE from "three";

const DEFAULT_SETTINGS = {
  width: 400,
  height: 400
};

const setupScene = ({ width, height }) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);

  return { scene, camera, renderer };
};

const createCube = () => {
  const geometry = new THREE.SphereGeometry(2, 10, 7);
  const material = new THREE.MeshBasicMaterial({
    color: 0xf00000,
    wireframe: true,
    wireframeLinewidth: 10
  });
  const cube = new THREE.Mesh(geometry, material);

  return cube;
};

const Globe = (container, settings = DEFAULT_SETTINGS) => {
  console.log("[three.globe] setup @ ", container);

  const { width, height } = settings;

  const { scene, camera, renderer } = setupScene({
    width,
    height
  });

  container.appendChild(renderer.domElement);

  const cube = createCube();
  scene.add(cube);

  camera.position.z = 4;

  function render() {
    requestAnimationFrame(render);

    cube.rotation.y += 0.008;
    renderer.render(scene, camera);
  }

  renderer.render(scene, camera);
  // render();

  return { render };
};

export default Globe;
