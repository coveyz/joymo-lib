import path from 'path';
import { copyFile, mkdir } from 'fs/promises';
import { epOutput } from '@coveyz/build-utils';
import { run, runTask, withTaskName, buildConfig } from './src';
import { parallel, series } from 'gulp';

export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(epOutput, { recursive: true })),

  parallel(
    runTask('buildModules')
  )
);

export * from './src';
