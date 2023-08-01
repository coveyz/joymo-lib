import path from 'path';
import { parallel } from 'gulp';
import VueMacros from 'unplugin-vue-macros/rollup';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild';
import { rollup } from 'rollup';
import { epOutput, epRoot } from '@coveyz/build-utils';

import { generateExternal, withTaskName, writeBundles, formatBundleFilename } from '../utils';
import { JoymoLibAlias } from '../plugins/alias';
import { target } from '../build-info';

import type { Plugin } from 'rollup';

const PKG_CAMELCASE_NAME = 'JoymoLib',
  PKG_BRAND_NAME = 'Joymo Lib',
  version = '0.0.0-dev.1';

const banner = `/*! ${PKG_BRAND_NAME} v${version} */\n`

/** 🧀 构建完整产物 */
const buildFullEntry = async (minify: boolean) => {
  const plugins: Plugin[] = [
    JoymoLibAlias(),
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vue: vue({
          isProduction: true
        }),
        vueJsx: vueJsx()
      }
    }),
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts']
    }),
    commonjs(),
    esbuild({
      exclude: [],
      sourceMap: minify,
      target,
      loaders: {
        ".vue": "ts"
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production')
      },
      treeShaking: true,
      legalComments: 'eof'
    })
  ]

  if (minify) {
    plugins.push(minifyPlugin({
      target,
      sourceMap: true
    }))
  }

  const bundle = await rollup({
    input: path.resolve(epRoot, 'index.ts'),
    plugins,
    external: await generateExternal({ full: true }),
    treeshake: true
  });

  await writeBundles(bundle, [
    {
      format: 'umd',
      file: path.resolve(epOutput, 'dist', formatBundleFilename('index.full', minify, 'js')),
      exports: 'named',
      name: PKG_CAMELCASE_NAME,
      globals: {
        vue: 'vue'
      },
      sourcemap: minify,
      banner
    },
    {
      format: 'esm',
      file: path.resolve(epOutput, 'dist', formatBundleFilename('index.full', minify, 'js')),
      sourcemap: minify,
      banner
    }
  ])

}

export const buildFull = (minify: boolean) => async () => {
  return Promise.all([buildFullEntry(minify)]);
}

export const buildFullBundle = parallel(
  withTaskName('buildFullMinified', buildFull(true)),
  withTaskName('buildFullMinified', buildFull(false))
)