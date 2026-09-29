import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {createRenderer, resizeRenderer} from './renderer';
import {createScene, disposeScene} from './scene';
import {createCamera} from './camera';
import {createEarth} from './earth';
import {createLights} from './lights';
import {createGui} from './gui';

const base = import.meta.env.BASE_URL;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const renderer = createRenderer(canvas);

const scene = createScene(base);
const camera = createCamera(window.innerWidth / window.innerHeight);

const earth = createEarth(base, renderer.capabilities.getMaxAnisotropy());
scene.add(earth.group);
scene.add(...createLights());

const controls = new OrbitControls(camera, renderer.domElement);

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const gui = createGui(earth, camera);

window.addEventListener('resize', onResize);

function onResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    resizeRenderer(renderer);
}

const timer = new THREE.Timer();

// The scene animates continuously, so a single render loop is the only place that draws a frame.
renderer.setAnimationLoop(() => {
    const delta = timer.update().getDelta();

    earth.spin(delta);
    controls.update();

    renderer.render(scene, camera);
    stats.update();
});

// Without this, every hot reload would stack another render loop, GUI panel and stats widget.
import.meta.hot?.dispose(() => {
    renderer.setAnimationLoop(null);
    window.removeEventListener('resize', onResize);

    gui.destroy();
    stats.dom.remove();
    controls.dispose();
    earth.dispose();
    disposeScene(scene);
    renderer.dispose();
});
