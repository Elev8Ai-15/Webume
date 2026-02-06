import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  plugins: [
    build({
      entry: 'src/index.tsx',
    }),
    devServer({
      adapter,
      entry: 'src/index.tsx',
    }),
  ],

  build: {
    // Minification
    minify: mode === 'production' ? 'esbuild' : false,

    // Source maps for debugging
    sourcemap: mode === 'production' ? 'hidden' : true,

    // Report compressed sizes
    reportCompressedSize: true,

    // Target modern browsers
    target: 'esnext',
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['hono'],
  },

  // Dev server settings
  server: {
    port: 5173,
    strictPort: false,
  },
}))
