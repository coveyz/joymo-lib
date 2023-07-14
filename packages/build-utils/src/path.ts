import { resolve } from 'path';

export const projectRoot = resolve(__dirname, '..', '..', '..');
export const pkgRoot = resolve(projectRoot, 'packages');
export const epRoot = resolve(pkgRoot, 'lib');

/** 'dist' */
export const buildOutput = resolve(projectRoot, 'dist');
/** /dist/lib ❓todo changeName */
export const epOutput = resolve(buildOutput, 'lib') //todo changName