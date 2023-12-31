const PKG_NAME = 'joymo-lib',
  PKG_PREFIX = '@coveyz';

import type { Plugin } from 'rollup';

export function JoymoLibAlias(): Plugin {
  const themeChalk = 'theme-chalk';
  const sourceThemeChalk = `${PKG_PREFIX}/${themeChalk}` as const;
  const bundleThemeChalk = `${PKG_NAME}/${themeChalk}` as const;

  return {
    name: 'joymo-lib-alias-plugin',
    resolveId(id) {
      if (!id.startsWith(sourceThemeChalk)) return
      return {
        id: id.replaceAll(sourceThemeChalk, bundleThemeChalk),
        external: "absolute"
      }
    }
  }
}