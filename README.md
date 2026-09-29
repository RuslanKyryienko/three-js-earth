# threejs-earth

**[Live demo →](https://ruslankyryienko.github.io/three-js-earth/)**

An interactive 3D scene built with Three.js + TypeScript, bundled by Vite.

The scene: a textured Earth with a slow rotation, a
directional "sun" light, and a cube-mapped starfield skybox. Camera control via
OrbitControls, FPS panel via Stats, real-time tweaking of rotation and field of view via
dat.GUI.

## Stack

| Purpose | Technology |
|---|---|
| 3D rendering | [three](https://threejs.org/) `^0.186` (WebGLRenderer) |
| Language | TypeScript `~6.0` (strict-ish checks, `noEmit`) |
| Build / dev server | Vite `^8.3` |
| Debug UI | dat.GUI, `stats.module.js` |

## Structure

```
index.html            entry point, <canvas id="canvas">
src/main.ts           wiring only: composes the modules, runs the render loop
src/renderer.ts       WebGLRenderer, pixel ratio, tone mapping, resize
src/camera.ts         PerspectiveCamera
src/scene.ts          Scene and skybox
src/lights.ts         ambient light + directional sun
src/earth.ts          geometry, material, texture, rotation, disposal
src/gui.ts            dat.GUI panels
src/style.css         margin reset, overflow: hidden
public/img/           textures (bluemarble.jpg)
public/skybox/        6 cube map faces (px/nx/py/ny/pz/nz.png)
tsconfig.json         target ES2023, moduleResolution: bundler
```

## Running

```bash
npm install
npm run dev       # Vite dev server with HMR
npm run build     # tsc + vite build → dist/
npm run preview   # local preview of the production build
```

## How the scene works

- **Scene and background** (`scene.ts`) — `CubeTextureLoader` loads the skybox from
  `public/skybox/` and tags it as `SRGBColorSpace`.
- **Camera** (`camera.ts`) — `PerspectiveCamera(35°, aspect, 0.1, 1000)` at `z = 4`; on
  `resize` both `aspect` and the renderer size are updated.
- **Renderer** (`renderer.ts`) — ACES Filmic tone mapping; the device pixel ratio is
  capped at 2 so HiDPI screens stay sharp without rendering far more pixels than needed.
- **Earth** (`earth.ts`) — `SphereGeometry(1, 64, 32)` + `MeshStandardMaterial` with the
  texture in `SRGBColorSpace` and anisotropic filtering. The mesh sits inside a `Group`
  carrying the 23.4° axial tilt, so the sphere spins around a tilted axis.
- **Lighting** (`lights.ts`) — a faint `AmbientLight` for the night side plus a
  `DirectionalLight` as the Sun. The Sun is positioned within the ecliptic plane (`y = 0`)
  and its angle there sets the season; the axial tilt does the rest.
- **Loop** (`main.ts`) — `renderer.setAnimationLoop` + `THREE.Timer` for frame-rate
  independent rotation. This is the only place a frame is drawn.

## Notes

- Assets live in `public/` and are addressed through `import.meta.env.BASE_URL`, so paths
  are identical in dev and in the production build: Vite serves `public/` from the root in
  dev and copies its contents into `dist/` at build time. If the app is hosted somewhere
  other than the domain root, setting `base` in the Vite config is enough — no code
  changes needed.
- `main.ts` registers an `import.meta.hot.dispose` handler that stops the render loop and
  disposes of GPU resources. Without it, every hot reload would stack another loop, GUI
  panel and stats widget on top of the previous one.