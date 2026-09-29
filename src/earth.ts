import * as THREE from 'three';

const TWO_PI = Math.PI * 2;

// One full rotation ("day") takes 300 seconds.
const SECONDS_PER_DAY = 900;
export const EARTH_ROTATION_RAD_PER_SEC = TWO_PI / SECONDS_PER_DAY;

const AXIAL_TILT_DEG = 23.4;

export interface Earth {
    /** Tilted container: add it to the scene. */
    readonly group: THREE.Group;
    /** The sphere itself — it spins inside the tilted group. */
    readonly mesh: THREE.Mesh;
    spin(delta: number): void;
    dispose(): void;
}

export function createEarth(basePath: string, maxAnisotropy: number): Earth {
    const texture = new THREE.TextureLoader().load(`${basePath}img/bluemarble.jpg`);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAnisotropy;

    const geometry = new THREE.SphereGeometry(1, 64, 32);
    // Oceans are not perfect mirrors, but the default roughness of 1.0 kills their glint entirely.
    const material = new THREE.MeshStandardMaterial({map: texture, roughness: 0.9, metalness: 0});
    const mesh = new THREE.Mesh(geometry, material);

    // We apply the Earth's axial tilt (~23.4°) to the group, and the rotation to the sphere itself.
    const group = new THREE.Group();
    group.rotation.z = THREE.MathUtils.degToRad(AXIAL_TILT_DEG);
    group.add(mesh);

    return {
        group,
        mesh,
        spin(delta: number): void {
            // Wrapping keeps the value inside the 0..2π range the GUI slider expects.
            mesh.rotation.y = (mesh.rotation.y + EARTH_ROTATION_RAD_PER_SEC * delta) % TWO_PI;
        },
        dispose(): void {
            geometry.dispose();
            material.dispose();
            texture.dispose();
        },
    };
}
