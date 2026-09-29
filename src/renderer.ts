import * as THREE from 'three';

// Capping the device pixel ratio keeps HiDPI screens sharp without rendering 9x the pixels.
const MAX_PIXEL_RATIO = 2;

export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.toneMappingExposure = 1.2;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    resizeRenderer(renderer);

    return renderer;
}

export function resizeRenderer(renderer: THREE.WebGLRenderer): void {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.setSize(window.innerWidth, window.innerHeight);
}
