import { buildRoot } from '@coveyz/build-utils';
import { run } from './process';

import type { TaskFunction } from 'gulp';

export const withTaskName = <T extends TaskFunction>(name: string, fn: T) => {
  return Object.assign(fn, { displayName: name });
}

export const runTask = (name: string) => {
  return withTaskName(`shellTask: ${name}`, () => {
    run(`pnpm run start ${name}`, buildRoot)
  })
}