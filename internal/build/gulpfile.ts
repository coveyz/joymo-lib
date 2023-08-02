import path from 'path';
//@ts-ignore
import { copyFile, mkdir } from 'fs/promises';
import { copy } from 'fs-extra';
import { buildOutput, epOutput, epPackage, projectRoot } from '@coveyz/build-utils';
import { Module, buildConfig, run, runTask, withTaskName } from './src';
import { parallel, series, } from 'gulp';

import type { TaskFunction } from 'gulp';


export const copyFullStyle = async () => {
  await mkdir(path.resolve(epOutput, 'dist'), { recursive: true });
  await copyFile(
    path.resolve(epOutput, 'theme-chalk/index.css'),
    path.resolve(epOutput, 'dist/index.css')
  )
}

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types', 'packages')
  const copyTypes = (module: Module) => withTaskName(`copyTypes:${module}`, () => copy(src, buildConfig[module].output.path, { recursive: true }))

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}

export const copyFiles = () => Promise.all([
  copyFile(epPackage, path.join(epOutput, 'package.json')),
  copyFile(
    path.resolve(projectRoot, 'README.md'),
    path.resolve(epOutput, 'README.md')
  ),
])



export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(epOutput, { recursive: true })),
  parallel(
    runTask('buildModules'), //🧀 构建 bundless 产物
    runTask('buildFullBundle'), //🧀 构建 完整 产物
    runTask('generateTypesDefinitions'), //🧀 生成 .d.ts
    series(
      withTaskName('buildThemeChalk', () => run(`pnpm run -C packages/theme-chalk build`)),
      copyFullStyle
    )
  ),
  parallel(copyTypesDefinitions, copyFiles)
);

export * from './src';
