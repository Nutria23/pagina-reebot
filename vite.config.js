import { defineConfig } from 'vite'

export default defineConfig({
  // Set base to relative so it works on any subpath (like GitHub Pages)
  base: './',
  build: {
    outDir: 'dist',
  },
})
