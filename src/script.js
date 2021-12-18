import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import * as dat from "lil-gui";

// Debug
const gui = new dat.GUI();
const stats = new Stats();

stats.showPanel(0);
document.body.appendChild(stats.dom);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Textures
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
    console.log("Loading manager has started loading items");
};
loadingManager.onProgress = () => {
    console.log("Item(s) in the loading manager has completed");
};
loadingManager.onError = () => {
    console.log("A loader in the loading manager has encountered an error");
};
loadingManager.onLoad = () => {
    console.log("Loading manager has completed all the items");
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

const sunTexture = textureLoader.load("/textures/planets/sun.jpg");
const mercuryTexture = textureLoader.load("/textures/planets/mercury.jpg");
const venusTexture = textureLoader.load("/textures/planets/venus.jpg");
const earthTexture = textureLoader.load("/textures/planets/earth.jpg");
const marsTexture = textureLoader.load("/textures/planets/mars.jpg");
const jupiterTexture = textureLoader.load("/textures/planets/jupiter.jpg");
const saturnTexture = textureLoader.load("/textures/planets/saturn.jpg");
const uranusTexture = textureLoader.load("/textures/planets/uranus.jpg");
const neptuneTexture = textureLoader.load("/textures/planets/neptune.jpg");

// The order of CubeTextures are important. Look at the docs
const environmentMapTexture = cubeTextureLoader.load([
    "/textures/environmentMaps/space/px.png",
    "/textures/environmentMaps/space/nx.png",
    "/textures/environmentMaps/space/py.png",
    "/textures/environmentMaps/space/ny.png",
    "/textures/environmentMaps/space/pz.png",
    "/textures/environmentMaps/space/nz.png",
]);

// Scene
const scene = new THREE.Scene();

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshBasicMaterial({ map: sunTexture })
);

const mercury = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 64, 64),
    new THREE.MeshBasicMaterial({ map: mercuryTexture })
);

const venus = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 64, 64),
    new THREE.MeshBasicMaterial({ map: venusTexture })
);

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    new THREE.MeshBasicMaterial({ map: earthTexture })
);

const mars = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 64, 64),
    new THREE.MeshBasicMaterial({ map: marsTexture })
);

const jupiter = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 64, 64),
    new THREE.MeshBasicMaterial({ map: jupiterTexture })
);

const saturn = new THREE.Mesh(
    new THREE.SphereGeometry(0.65, 64, 64),
    new THREE.MeshBasicMaterial({ map: saturnTexture })
);

const uranus = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    new THREE.MeshBasicMaterial({ map: uranusTexture })
);

const neptune = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 64, 64),
    new THREE.MeshBasicMaterial({ map: neptuneTexture })
);

scene.add(sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune);

// The planets initial position on the x-axis
const initialXPositions = {
    mercury: -1.5,
    venus: 2.5,
    earth: -3.8,
    mars: 5.1,
    jupiter: -6.8,
    saturn: 8.8,
    uranus: -10.5,
    neptune: 12,
};

// Axes helper
// const axesHelper = new THREE.AxesHelper(15);
// scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.x = -4;
camera.position.y = 4;
camera.position.z = 7;
scene.add(camera);

// Taken from example
scene.background = environmentMapTexture;

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

// Creates a intial random individual orbit speed for each planet
const randomOrbitSpeedGenerator = () => {
    return Math.random() * (0.7, 0.3) + 0.3;
};

const animationObject = {
    planetRotationSpeed: 4,
    planetOrbitSpeed: 0.8,
    resetCamera: () => {
        controls.reset();
    },
    randomPlanetOrbitSpeed: [
        randomOrbitSpeedGenerator(),
        randomOrbitSpeedGenerator(),
        randomOrbitSpeedGenerator(),
        randomOrbitSpeedGenerator(),
        randomOrbitSpeedGenerator(),
        randomOrbitSpeedGenerator(),
        randomOrbitSpeedGenerator(),
        randomOrbitSpeedGenerator(),
    ],
};

gui.add(animationObject, "planetRotationSpeed").min(0).max(10).step(0.01);
gui.add(animationObject, "planetOrbitSpeed").min(0).max(2).step(0.01);
gui.add(animationObject, "resetCamera");

const rotationFunction = (planet, axis, elapsedTime) => {
    planet.rotation.y =
        axis[0] * elapsedTime * animationObject.planetRotationSpeed;
    planet.rotation.x =
        axis[1] * elapsedTime * animationObject.planetRotationSpeed;
};

const orbitFunction = (planet, elapsedTime, initialXOffset) => {
    planet.position.z =
        Math.sin(elapsedTime * animationObject.planetOrbitSpeed) *
        initialXOffset;
    planet.position.x =
        Math.cos(elapsedTime * animationObject.planetOrbitSpeed) *
        initialXOffset;
};

const tick = () => {
    stats.begin();

    const elapsedTime = clock.getElapsedTime();

    // Update objects
    // Planet rotations
    rotationFunction(sun, [0.0, 0.07], elapsedTime);

    rotationFunction(mercury, [0.05, 0.1], elapsedTime);

    rotationFunction(venus, [0.03, 0.09], elapsedTime);

    rotationFunction(earth, [0.1, 0.15], elapsedTime);

    rotationFunction(mars, [0.04, 0.08], elapsedTime);

    rotationFunction(jupiter, [0.03, 0.07], elapsedTime);

    rotationFunction(saturn, [0.04, 0.08], elapsedTime);

    rotationFunction(uranus, [0.05, 0.09], elapsedTime);

    rotationFunction(neptune, [0.1, 0.1], elapsedTime);

    // Orbit rotations
    // TODO: Refactor the initial x position values into variables instead
    orbitFunction(
        mercury,
        elapsedTime * animationObject.randomPlanetOrbitSpeed[0],
        initialXPositions.mercury
    );

    orbitFunction(
        venus,
        elapsedTime * animationObject.randomPlanetOrbitSpeed[1],
        initialXPositions.venus
    );

    orbitFunction(
        earth,
        elapsedTime * animationObject.randomPlanetOrbitSpeed[2],
        initialXPositions.earth
    );

    orbitFunction(
        mars,
        elapsedTime * animationObject.randomPlanetOrbitSpeed[3],
        initialXPositions.mars
    );

    orbitFunction(
        jupiter,
        elapsedTime * animationObject.randomPlanetOrbitSpeed[4],
        initialXPositions.jupiter
    );

    orbitFunction(
        saturn,
        elapsedTime * animationObject.randomPlanetOrbitSpeed[5],
        initialXPositions.saturn
    );

    orbitFunction(
        uranus,
        elapsedTime * animationObject.randomPlanetOrbitSpeed[6],
        initialXPositions.uranus
    );

    orbitFunction(
        neptune,
        elapsedTime * animationObject.randomPlanetOrbitSpeed[7],
        initialXPositions.neptune
    );

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    stats.end();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
