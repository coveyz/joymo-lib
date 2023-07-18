import path from 'path';
import { copyFile, mkdir } from 'fs/promises';
import { copy } from 'fs-extra';
import { parallel, series } from 'gulp';
import type { TaskFunction } from 'gulp';
import type { Module } from './src';
import { run, buildConfig, runTask, withTaskName, buildModules } from './src';
import { buildOutput, epOutput, epPackage, projectRoot } from '@coveyz/build-utils';


export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(epOutput, { recursive: true })),

  parallel(
    runTask('buildModules'),
    series(withTaskName('buildTheme', () => {
      return console.log('todo run -c theme')
    }))
  ),

)

export * from './src';



