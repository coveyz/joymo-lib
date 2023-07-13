import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

const resolve = (dir: string) => {
  return path.resolve(__dirname, dir)
}

const rollupOptions = {
  external: ["vue"],
  input: [resolve('packages/index.ts')],
  output: [
    {
      dir: 'dist/es',
      format: 'es',
      entryFileNames: `[name].es.js`,
      chunkFileNames: `chunk-[hash].js`,
      assetFileNames: 'assets/[name]-[hash][extname]',
      globals: {
        vue: 'Vue'
      }
    },
    // {
    //   dir: 'dist/cjs',
    //   format: 'cjs',
    //   entryFileNames: `[name].umd.js`,
    //   chunkFileNames: `chunk-[hash].js`,
    //   assetFileNames: 'assets/[name]-[hash][extname]',
    //   globals: {
    //     vue: 'Vue'
    //   }
    // },
  ]
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 9527,
  },
  resolve: {
    alias: {
      "@": resolve('src'),
      '~': resolve('packages')
    }
  },
  build: {
    //@ts-ignore
    rollupOptions,
    minify: 'esbuild',
    sourcemap: false,
    lib: {
      entry: resolve('packages/index.ts'),
      name: 'BrickUtils',
      fileName: format => `index.${format}.js`
    }
  }
})
