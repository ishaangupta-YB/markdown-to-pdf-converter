import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // mupdf ships an ESM Emscripten build that loads its .wasm via
  // `import.meta.url` and uses top-level await. Excluding it from esbuild
  // dep pre-bundling lets Vite/Rollup emit the .wasm asset and keep TLA intact.
  optimizeDeps: {
    exclude: ['mupdf'],
  },
  build: {
    target: 'esnext',
  },
})
