import type { SFCWithInstall } from './typescript';

export const withInstall = <T, E extends Record<string, any>>(main: T, extra?: E) => {
  (main as SFCWithInstall<T>).install = (app): void => {
    // console.log('utils-main->', main);
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      // console.log('utils-comp->', comp);
      app.component(comp.name, comp)
    }
  };

  if (extra) {
    console.log('utils=>', extra);
  }

  return main as SFCWithInstall<T> & E
}