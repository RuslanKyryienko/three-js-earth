import { defineConfig } from 'vite'

// The app is served from https://<user>.github.io/three-js-earth/, not from a
// domain root. `base` is the single source of truth for that prefix: Vite
// rewrites the asset URLs in index.html and inlines the same value into
// `import.meta.env.BASE_URL`, which scene.ts and earth.ts already use to build
// the texture paths. Keep it in sync with the repository name.
export default defineConfig({
  base: '/three-js-earth/',
})
