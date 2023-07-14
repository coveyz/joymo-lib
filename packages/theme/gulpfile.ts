import path from 'path';
import chalk from 'chalk';
import consola from 'consola';
import { parallel, src, dest, series } from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import { epOutput } from '@coveyz/build-utils';

const distFolder = path.resolve(__dirname, 'dist');
const distBundle = path.resolve(epOutput, 'theme');

/**
 * compile theme scss & minify
 */
function buildThemeChalk() {
  const sass = gulpSass(dartSass);
  const noElPrefixFile = /(index|base|display)/

  return src(path.resolve(__dirname, 'src/*.scss'))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(
      cleanCSS({}, (details) => {
        consola.success(
          `${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB
          `
        )
      })
    )
    .pipe(
      rename((path) => {
        if (!noElPrefixFile.test(path.basename)) {
          path.basename = `el-${path.basename}`
        }
      })
    )
    .pipe(dest(distFolder));
}

/**
 * copy from packages/theme-chalk/dist to dist/element-plus/theme-chalk
 */
export function copyThemeChalkBundle() {
  return src(`${distFolder}/**`).pipe(dest(distBundle))
}

/** copy source file to packages */
export function copyThemeChalkSource() {
  return src(path.resolve(__dirname, 'src/**')).pipe(dest(path.resolve(distBundle, 'src')))
}

export const build = parallel(
  copyThemeChalkSource,
  series(buildThemeChalk, copyThemeChalkBundle)
)


export default build;