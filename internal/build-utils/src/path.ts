import { resolve } from 'path';

export const projectRoot = resolve(__dirname, '..', '..', '..');
export const pkgRoot = resolve(projectRoot, 'packages');
export const compRoot = resolve(pkgRoot, 'components');
export const epRoot = resolve(pkgRoot, 'joymo-lib');
export const buildRoot = resolve(projectRoot, 'internal', 'build')


/** dist */
export const buildOutput = resolve(projectRoot, 'dist');
/** dist/joymo-lib */
export const epOutput = resolve(buildOutput, 'joymo-lib');


export const epPackage = resolve(epRoot, 'package.json');