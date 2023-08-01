import path from 'path';
//@ts-ignore
import { copyFile, mkdir } from 'fs/promises';
import { epOutput } from '@coveyz/build-utils';
import { run, runTask, withTaskName } from './src';
import { parallel, series } from 'gulp';


export const copyFullStyle = async () => {
  console.log('copyFullStylecopyFullStylecopyFullStylecopyFullStyle')
  await mkdir(path.resolve(epOutput, 'dist'), { recursive: true });
  await copyFile(
    path.resolve(epOutput, 'theme-chalk/index.css'),
    path.resolve(epOutput, 'dist/index.css')
  )
}


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
  )
);

export * from './src';
