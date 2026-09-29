import * as THREE from 'three';

// In space the night side is lit only by moonlight and starlight, so ambient stays near zero.
const AMBIENT_INTENSITY = 1;

const SUN_INTENSITY = 5;
const SUN_DISTANCE = 5;

/**
 * Angle of the Sun within the ecliptic plane, in degrees — this is what sets the season.
 * The axial tilt of the Earth's group does the rest: 0° is the June solstice (subsolar
 * point at +23.4°), 90° an equinox (0°), 180° the December solstice (-23.4°).
 */
const SUN_ECLIPTIC_ANGLE_DEG = 45;

export function createLights(): THREE.Light[] {
    const ambient = new THREE.AmbientLight(0xffffff, AMBIENT_INTENSITY);

    const sun = new THREE.DirectionalLight(0xffffff, SUN_INTENSITY);
    // The Sun never leaves the ecliptic plane, hence y = 0: any other value would put the
    // subsolar point outside the +/-23.4 deg the tilt physically allows.
    const angle = THREE.MathUtils.degToRad(SUN_ECLIPTIC_ANGLE_DEG);
    sun.position.set(-Math.cos(angle) * SUN_DISTANCE, 0, Math.sin(angle) * SUN_DISTANCE);

    return [ambient, sun];
}