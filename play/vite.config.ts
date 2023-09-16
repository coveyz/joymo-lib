import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueMacros from 'unplugin-vue-macros/vite'
import glob from 'fast-glob'
import Components from 'unplugin-vue-components/vite';
import mkcert from 'vite-plugin-mkcert'
// import Inspect from 'vite-plugin-inspect'
import { getPackageDependencies, epPackage, projectRoot, epRoot, pkgRoot } from '@coveyz/build-utils'
import './viteInit';
import esbuild from 'rollup-plugin-esbuild'

import { joymoLibResolver } from './utils/resolver'

import type { Plugin } from 'vite';

const esbuildPlugin = (): any => ({
  ...esbuild({
    target: 'chrome64',
    include: /\.vue$/,
    loaders: {
      '.vue': 'js',
    },
  }),
  enforce: 'post',
})


export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  let { dependencies } = getPackageDependencies(epPackage)
  dependencies = dependencies.filter((dep) => !dep.startsWith('@types/')) // exclude dts deps
  const optimizeDeps = (
    await glob(['dayjs/(locale|plugin)/*.js'], {
      cwd: path.resolve(projectRoot, 'node_modules'),
    })
  ).map((dep) => dep.replace(/\.js$/, ''))

  return {
    resolve: {
      alias: [
        {
          find: /^joymo-lib(\/(es|lib))?$/,
          replacement: path.resolve(epRoot, 'index.ts'),
        },
        {
          find: /^joymo-lib\/(es|lib)\/(.*)$/,
          replacement: `${pkgRoot}/$2`,
        },
      ],
    },
    server: {
      host: true,
      https: !!env.HTTPS,
    },
    plugins: [
      vueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue(),
          vueJsx: vueJsx(),
        },
      }),
      esbuildPlugin(),
      Components({
        include: `${__dirname}/**`,
        dts: false,
        //@ts-ignore
        resolvers: joymoLibResolver()
      }),
      mkcert(),
      // Inspect(),
    ],

    optimizeDeps: {
      include: ['vue', '@vue/shared', ...dependencies, ...optimizeDeps],
    },
    esbuild: {
      target: 'chrome64',
    },
  }
})

