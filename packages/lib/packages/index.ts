
console.log('init->lib')
import './styles/index.scss';
import installer from './default'

export * from './hooks';
//todo types
export * from 'components';

export const install = installer.install;
export const version = installer.version;

export default installer;