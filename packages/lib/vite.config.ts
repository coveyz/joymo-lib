import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import postcss from 'rollup-plugin-postcss';


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
      // assetFileNames: 'assets/[name]-[hash][extname]',
      assetFileNames: "[name][extname]",
      globals: {
        vue: 'Vue'
      }
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
      entryFileNames: `[name].umd.js`,
      chunkFileNames: `chunk-[hash].js`,
      // assetFileNames: 'assets/[name]-[hash][extname]',
      assetFileNames: "[name][extname]",
      globals: {
        vue: 'Vue'
      }
    },
  ]
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    postcss({
      extract: 'styles.css', // 提取样式到单独的 CSS 文件
      inject: {
        insertAt: 'top'
      }
    }),
  ],
  server: {
    port: 9527,
  },
  resolve: {
    alias: {
      "@": resolve('src'),
      '~': resolve('packages')
    }
  },
  optimizeDeps: {
    include: ['vue', '@vue/shared']
  },
  build: {
    //@ts-ignore
    rollupOptions,
    minify: 'esbuild',
    sourcemap: false,
    assetsInclude: ['packages/styles/**'], // 指定需要复制的文件或目录
    lib: {
      entry: resolve('packages/index.ts'),
      name: 'dist',
      fileName: format => `index.${format}.js`
    }
  }
})
