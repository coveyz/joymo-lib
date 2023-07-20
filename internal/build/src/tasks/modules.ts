import { rollup } from 'rollup';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueMacros from 'unplugin-vue-macros/rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';

import glob from 'fast-glob';
import { excludeFiles, pkgRoot } from '@coveyz/build-utils';
import { JoymoLibAlias } from '../plugins/alias';
import { target } from '../build-info';
import { generateExternal } from '../utils';

export const buildModules = async () => {
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )

  console.log('input=>', input);

  try {
    const bundle = await rollup({
      input,
      plugins: [
        JoymoLibAlias(),
        VueMacros({
          setupComponent: false,
          setupSFC: false,
          plugins: {
            vue: vue({
              isProduction: false
            }),
            vueJsx: vueJsx()
          }
        }),
        nodeResolve({
          extensions: ['.mjs', '.js', '.json', '.ts'],
        }),
        commonjs(),
        esbuild({
          sourceMap: true,
          target,
          loaders: {
            '.vue': 'ts'
          },
        })
      ],
      external: await generateExternal({ full: false }),
      treeshake: false,
    })

    console.log('bundle=>', bundle);
  } catch (error) {
    console.log('error=>', error);
  }

}