import type { App } from 'vue';
import { createPinia } from 'pinia';

export * from './modules/user';
export * from './modules/permission';
export * from './modules/setting';

const store = createPinia();
export const setupStore = (app: App<Element>) => {
  app.use(store);
}

export default store;