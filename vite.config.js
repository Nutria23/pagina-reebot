import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // Set base to relative so it works on any subpath (like GitHub Pages)
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        productos: resolve(__dirname, 'productos.html'),
        resenas: resolve(__dirname, 'resenas.html'),
        dma: resolve(__dirname, 'dma.html'),
        perfil: resolve(__dirname, 'perfil.html'),
      },
    },
  },
})
