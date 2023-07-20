import type { App, Plugin } from 'vue';


const version = `0.0.0-dev.1`;

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, opts = {}) => {
    components.forEach(c => app.use(c));
  }

  return {
    install,
    version
  }
}