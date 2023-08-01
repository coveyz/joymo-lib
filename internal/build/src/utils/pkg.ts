import { buildConfig } from '../build-info';
import type { Module } from '../build-info';

const PKG_NAME = 'joymo-lib',
  PKG_PREFIX = '@coveyz';

/** 用于类型生成器 */
export const pathRewriter = (module: Module) => {
  const config = buildConfig[module];

  return (id: string) => {
    id = id.replaceAll(`${PKG_PREFIX}/theme-chalk`, `${PKG_NAME}/theme-chalk`)
    id = id.replaceAll(`${PKG_PREFIX}/`, `${config.bundle.path}/`)

    return id;
  }
}