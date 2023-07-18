
import { rollup } from 'rollup';
import type { OutputOptions } from 'rollup';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import VueMacros from 'unplugin-vue-macros/rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';

import { LibAlias } from '../plugin/alias';
import { epRoot, excludeFiles, pkgRoot } from '@coveyz/build-utils';
import { target, buildConfigEntries } from '../build.info';
import { generateExternal, writeBundles } from '../utils';
import glob from 'fast-glob';

export const buildModules = async () => {
  console.log('buildModules=>')

  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true
    })
  )

  try {
    const bundle = await rollup({
      input,
      plugins: [
        LibAlias(),
        VueMacros({
          setupComponent: true,
          setupSFC: true,
          plugins: {
            vue: Vue({
              isProduction: false
            }),
            vueJsx: VueJsx()
          }
        }),
        nodeResolve({
          extensions: ['.mjs', '.js', '.json', '.ts']
        }),
        commonjs(),
        esbuild({
          sourceMap: true,
          target,
          loaders: {
            ".vue": 'ts'
          }
        })
      ],
      external: await generateExternal({ full: false }),
      treeshake: false
    })

    console.log('bundle=>', bundle)
  } catch (error) {
    console.log('error=>', error)
  }


  // await writeBundles(
  //   bundle,
  //   buildConfigEntries.map(([module, config]): OutputOptions => {
  //     return {
  //       format: config.format,
  //       dir: config.output.path,
  //       exports: module === 'cjs' ? 'named' : undefined,
  //       preserveModules: true,
  //       preserveModulesRoot: epRoot,
  //       sourcemap: true,
  //       entryFileNames: `[name].${config.ext}`
  //     }
  //   })
  // )
}