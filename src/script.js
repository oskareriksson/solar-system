import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui';

// Debug
// const gui = new dat.GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Textures
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
    console.log('Loading manager has started loading items');
}
loadingManager.onProgress = () => {
    console.log('Item(s) in the loading manager has completed');
}
loadingManager.onError = () => {
    console.log('A loader in the loading manager has encountered an error');
}
loadingManager.onLoad = () => {
    console.log('Loading manager has completed all the items');
}

const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
// I can use the relative /static/ path here, but not in ESM... curious
// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png');
// const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png');
// const colorTexture = textureLoader.load('/textures/minecraft.png');
const colorTexture = textureLoader.load('/textures/door/color.jpg');
// const colorTexture = textureLoader.load(doorColor);
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');
const matcapTexture = textureLoader.load('/textures/matcaps/1.png');

// The order of CubeTextures are important. Look at the docs
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/space/px.png', // Positive x
    '/textures/environmentMaps/space/nx.png', // Negative x
    '/textures/environmentMaps/space/py.png',
    '/textures/environmentMaps/space/ny.png',
    '/textures/environmentMaps/space/pz.png',
    '/textures/environmentMaps/space/nz.png'
]);

gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
// Remember we can deactivate mipmapping since we are using NearestFilter, for better performance
gradientTexture.generateMipmaps = false;

// Scene
const scene = new THREE.Scene()

// Object - Mesh basic material
// const material = new THREE.MeshBasicMaterial();
// material.map = colorTexture;
// material.setValues({color: 'red'})
// material.color.set('pink')
// material.color = new THREE.Color('pink')
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = alphaTexture;
// material.side = THREE.DoubleSide;

// Object - Mesh normal material. Usually used for debugging normals, but it is performant and can be used in projects if you want
// const material = new THREE.MeshNormalMaterial();
// material.wireframe = true;
// flatShading is useful for seeing areas of shadows/reflections more clearly, as it flattens the faces between the vertices instead of interpolating the normals
// material.flatShading = true;

// Object - Mesh matcap material. Gives the illusion that the objects are being illuminated, without actually adding lights to the scene
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// Object - Mesh depth material. Colors the geometry in white if it's close to the "near" and black if it's close to the "far" value of the camera. Good for creating things like fog, etc
// const material = new THREE.MeshDepthMaterial();

// Object - Mesh lambert material. This material reacts to light. Some problems with it compared to other lightning techniques in some use cases, but very performant in cases where it fits
// const material = new THREE.MeshLambertMaterial();

// Object - Mesh phong material. This material also reacts to light. Usually it can be less strange artefacts with material compared to lambert, but also less performant
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 1000;
// material.specular = new THREE.Color('red')

// Object - Mesh toon material. Similar to lambert, but more cartoonish
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;

// Object - Mesh standard material. This uses physically based rendereing principles (PBR). Like lambert and phong it supports lights, but with a more realistic algorithm and better params lite roughness and metalness
// const material = new THREE.MeshStandardMaterial();
// Disabled these since we load in the metalness and roughness textures futher down. You can still change the values in the debug UI
// material.metalness = 0.45;
// material.roughness = 0.45;

// material.map = colorTexture;

// For ambient occlusion to work you must add the "uv2" buffer attribute to the geometry. You can duplicate the array in the geometry "uv" property that THREE provides
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;

// The displacementScale is very high by default (atleast for these textures). You can crank it down a bit for more subtle height differences, and up for things like terrains etc
// material.displacementMap = heightTexture;
// material.displacementScale = 0.05;

// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;

// Fakes the orientation of the normals and details of the surface, regardless of the subdivision (amount of vertices). Try to use normals when you can instead of more subdivisions, since it's less work for the GPU to handle
// material.normalMap = normalTexture;
// material.normalScale.set(0.5, 0.5);

// Remember that you must enable the "transparent" property if you want to work with alpha in a material
// material.alphaMap = alphaTexture;
// material.transparent = true;

// Object - Mesh physical material. Same as the standard material, but with support of a clear coat effect https://threejs.org/examples/?q=clear#webgl_materials_physical_clearcoat. Takes more performance to run, so only use if necessary
// const material = new THREE.MeshPhysicalMaterial();

// Object - Points material. Used to make things like particles
// const material = new THREE.PointsMaterial();

// Last part of the module, we want to add an environment map
const material = new THREE.MeshBasicMaterial({ color: 'cyan' });
// material.metalness = 0.7;
// material.roughness = 0.2;
// material.envMap = environmentMapTexture;

// THREE only supports cube environment maps

// gui.add(material, 'metalness').min(0).max(1).step(0.0001);
// gui.add(material, 'roughness').min(0).max(1).step(0.0001);
// gui.add(material, 'aoMapIntensity').min(1).max(10).step(0.0001);
// gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);

const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

const sphere4 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

const sphere5 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

const sphere6 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

const sphere7 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)

const sphere8 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)

sphere1.position.x = -4.5;
sphere2.position.x = -3;
sphere3.position.x = -1.5;
sphere4.position.x = 0;
sphere5.position.x = 1.5;
sphere6.position.x = 3;
sphere7.position.x = 4.5;
sphere8.position.x = 6;



scene.add(sphere1, sphere2, sphere3, sphere4, sphere5, sphere6, sphere7, sphere8);

// Lights

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 0.5);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 8
scene.add(camera)

// Taken from example
scene.background = environmentMapTexture;

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = 0.1 * elapsedTime;

    // sphere.rotation.x = 0.15 * elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()