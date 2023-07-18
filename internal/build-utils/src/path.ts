import { resolve } from 'path';

export const projectRoot = resolve(__dirname, '..', '..', '..');
export const pkgRoot = resolve(projectRoot, 'packages');
export const epRoot = resolve(pkgRoot, 'lib');
export const buildRoot = resolve(projectRoot, 'internal', 'build');

/** 'dist' */
export const buildOutput = resolve(projectRoot, 'dist');
/** /dist/lib ❓todo changeName */
export const epOutput = resolve(buildOutput, 'lib') //todo changName

export const epPackage = resolve(epRoot, 'package.json');
