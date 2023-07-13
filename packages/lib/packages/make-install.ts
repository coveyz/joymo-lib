import type { App, Plugin } from 'vue';
import { isEmptyObject } from '@coveyz/utils';
import { setupStore } from './store';
import config from './config';

/** 🧀️ 初始化 子项目 appConfig */
const initConfig = (opts: {}): void => {
  if (isEmptyObject(opts)) return;
  for (const key in opts) {
    config[key] = opts[key]
  }
}

const version = `0.0.0-dev.1`;

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, opts = {}) => {
    components.forEach((c) => app.use(c));
    initConfig(opts);
    setupStore(app);
  }

  return {
    install,
    version
  }
}