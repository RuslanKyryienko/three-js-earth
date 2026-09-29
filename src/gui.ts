import type * as THREE from 'three';
import {GUI} from 'dat.gui';
import type {Earth} from './earth';

const TWO_PI = Math.PI * 2;

export function createGui(earth: Earth, camera: THREE.PerspectiveCamera): GUI {
    const gui = new GUI();

    const earthFolder = gui.addFolder('Earth');
    // .listen() keeps the sliders in sync with the rotation applied by the animation loop.
    earthFolder.add(earth.mesh.rotation, 'x', 0, TWO_PI).listen();
    earthFolder.add(earth.mesh.rotation, 'y', 0, TWO_PI).listen();
    earthFolder.add(earth.mesh.rotation, 'z', 0, TWO_PI).listen();
    earthFolder.close();

    // Zoom is driven by OrbitControls, so the camera exposes its field of view instead of position.z.
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(camera, 'fov', 10, 90).onChange(() => camera.updateProjectionMatrix());
    cameraFolder.close();

    return gui;
}
