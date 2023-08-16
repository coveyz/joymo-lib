import installer from './default';
export * from '@coveyz/components';
export * from '@coveyz/utils'

export const install = installer.install;
export const version = installer.version;

export default installer;