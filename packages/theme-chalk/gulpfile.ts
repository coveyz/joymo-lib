import path from 'path';
import chalk from 'chalk';
import consola from 'consola';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import rename from 'gulp-rename';
import { dest, parallel, series, src } from 'gulp';

import { epOutput } from '@coveyz/build-utils';


const distFolder = path.resolve(__dirname, 'dist');
const distBundle = path.resolve(epOutput, 'theme-chalk');

const buildThemeChalk = () => {
  const sass = gulpSass(dartSass);
  const noElPrefixFile = /(index|base|display)/;

  return src(path.resolve(__dirname, 'src/*.scss'))
    .pipe(sass.sync()) // 编译 css
    .pipe(autoprefixer({ cascade: false })) //加前缀
    .pipe(
      cleanCss({}, details => {
        consola.success(
          `${chalk.cyan(details.name)}: ${chalk.yellow(details.stats.originalSize / 1000)} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        )
      })
    )
    .pipe(
      rename(path => {
        if (!noElPrefixFile.test(path.basename)) {
          path.basename = `j-${path.basename}`
        }
      })
    )
    .pipe(dest(distFolder))
}

/** 复制文件到 packages */
export const copyThemeChalkSource = () => {
  return src(path.resolve(__dirname, 'src/**')).pipe(
    dest(path.resolve(distBundle, 'src'))
  )
}

export const copyThemeChalkBundle = () => {
  return src(`${distFolder}/**`).pipe(dest(distBundle));
}

export const build = parallel(
  copyThemeChalkSource,
  series(buildThemeChalk, copyThemeChalkBundle)
);

export default build;