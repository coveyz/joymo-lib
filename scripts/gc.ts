const fs = require('fs');
const path = require('path');
const consola = require('consola')

const NAME = process.argv[2],
  FILE_PATH = path.resolve(__dirname, '../packages');

const re = /[[:space:]]+/;
if (process.argv.length !== 3 || re.test(NAME) || NAME === '') {
  consola.error(('用法: pnpm gen 项目名称 不能有空格🏂'));
  process.exit(1)
}


// 命名规范话
let COMPONENTS_NAME = '';
for (const part of NAME.split(/(?=[A-Z])/)) {
  COMPONENTS_NAME += (COMPONENTS_NAME ? '-' : '') + part.toLowerCase();
}

//! 拼接目标目录的完整路径
const DIRNAME = path.join(FILE_PATH, 'components', COMPONENTS_NAME),
  THEME_DIRNAME = path.join(FILE_PATH, 'theme-chalk'),
  INPUT_NAME = NAME;


console.log('name=>', NAME);
console.log('INPUT_NAME=>', INPUT_NAME);
console.log('COMPONENTS_NAME=>', COMPONENTS_NAME);

if (NAME !== COMPONENTS_NAME) {
  consola.warn(`默认采用 短横线分隔的格式命名 ${NAME} -> ${COMPONENTS_NAME} 🎨`);
}

//! 检查目标目录是否存在
if (fs.existsSync(DIRNAME)) {
  consola.error(`${COMPONENTS_NAME} 组件已经存在,换一个吧 💣`)
  process.exit(1)
}

// //! 规范命名 -> 短横线命名
let NORMALIZED_NAME = '';
for (const part of NAME.split(/[_-]/)) {
  NORMALIZED_NAME += part.charAt(0).toUpperCase() + part.slice(1);
}

// 创建文件夹
fs.mkdirSync(DIRNAME, { recursive: true });
fs.mkdirSync(path.join(DIRNAME, 'src'), { recursive: true })
fs.mkdirSync(path.join(DIRNAME, 'style'), { recursive: true })

//生成 TypeScript .ts 文件 -> components/test-zkr/index.ts
fs.writeFileSync(path.join(DIRNAME, 'index.ts'), `
import { withInstall } from '@coveyz/utils';
import ${NORMALIZED_NAME} from './src/${COMPONENTS_NAME}.vue';

export const J${NORMALIZED_NAME} = withInstall(${NORMALIZED_NAME});
export default J${NORMALIZED_NAME};
`)


// 生成单文件 .vue -> test-zkr/src/test-zkr.vue
fs.writeFileSync(path.join(DIRNAME, 'src', `${COMPONENTS_NAME}.vue`), `
<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts" setup>

//@ts-ignore
defineOptions({
  name: 'J${NORMALIZED_NAME}',
})

// 初始化
</script>
`)


//生成 components/test-zkr/style/css.ts
fs.writeFileSync(path.join(DIRNAME, 'style', 'css.ts'), `
import '@coveyz/theme-chalk/src/j-${COMPONENTS_NAME}.css';
`)


//生成 components/test-zkr/style/index.ts
fs.writeFileSync(path.join(DIRNAME, 'style', 'index.ts'), `
import '@coveyz/theme-chalk/src/${COMPONENTS_NAME}.scss';
`)

//生成 theme-chalk/test-zkr
fs.writeFileSync(path.join(THEME_DIRNAME, 'src', `${COMPONENTS_NAME}.scss`), ``)


consola.success('组件结构创建成功！🚀🚀🚀');