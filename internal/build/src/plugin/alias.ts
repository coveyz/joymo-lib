const PKG_NAME = 'lib', //todo 
  PKG_PREFIX = "@coveyz";

import type { Plugin } from 'rollup';

export function LibAlias(): Plugin {
  const themeChalk = 'theme';
  const sourceTheme = `${PKG_PREFIX}/${themeChalk}` as const;
  const bundleTheme = `${PKG_NAME}/${themeChalk}` as const;

  return {
    name: 'joymo-lib-alias-plugin',
    resolveId(id) {
      if (!id.startsWith(sourceTheme)) return;
      console.log('id=>', id)
      return {
        id: id.replaceAll(sourceTheme, bundleTheme),
        external: 'absolute',
      }
    }
  }
}