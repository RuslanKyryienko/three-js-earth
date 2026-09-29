import * as THREE from 'three';

export function createScene(basePath: string): THREE.Scene {
    const scene = new THREE.Scene();

    const skybox = new THREE.CubeTextureLoader()
        .setPath(`${basePath}skybox/`)
        .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
    skybox.colorSpace = THREE.SRGBColorSpace;
    scene.background = skybox;

    return scene;
}

export function disposeScene(scene: THREE.Scene): void {
    if (scene.background instanceof THREE.Texture) {
        scene.background.dispose();
    }

    scene.clear();
}
