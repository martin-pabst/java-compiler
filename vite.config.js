import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: '/index.html',
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        treeviewtest: resolve(__dirname, 'treeviewtest.html')
      }
    }
  }
});