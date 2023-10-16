import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
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