import path from 'path';
//@ts-ignore
import { readFile, mkdir, writeFile } from 'fs/promises';
import { Project } from 'ts-morph';
import * as vueCompiler from 'vue/compiler-sfc';
import type { CompilerOptions, SourceFile } from 'ts-morph';
import { buildOutput, epRoot, excludeFiles, pkgRoot, projectRoot } from '@coveyz/build-utils';
import consola from 'consola';
import glob from 'fast-glob';
import chalk from 'chalk';

import { pathRewriter } from '../utils';

const outDir = path.resolve(buildOutput, 'types'),
  TSCONFIG_PATH = path.resolve(projectRoot, 'tsconfig.web.json');

/** 🧀 生成类型文件 */
export const generateTypesDefinitions = async () => {

  const compilerOptions: CompilerOptions = {
    emitDeclarationOnly: true,
    outDir,
    baseUrl: projectRoot,
    preserveSymlinks: true,
    skipLibCheck: true,
    noImplicitAny: false
  }

  const project = new Project({
    compilerOptions,
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true
  })

  const sourceFiles = await addSourceFiles(project);
  consola.success('Added source files');
  typeCheck(project);
  consola.success('Type check passed!');

  await project.emit({
    emitOnlyDtsFiles: true
  })

  const task = sourceFiles.map(async (sourceFile) => {
    const relativePath = path.relative(pkgRoot, sourceFile.getFilePath());

    consola.trace(
      chalk.yellow(
        `生成定义文件: ${chalk.bold(relativePath)}`
      )
    )

    const emitOutput = sourceFile.getEmitOutput();
    const emitFiles = emitOutput.getOutputFiles();

    if (!emitFiles.length) {
      return new Error(`Emit 没有文件:${chalk.bold(relativePath)}`);
    }

    const subTasks = emitFiles.map(async (outputFile) => {
      const filePath = outputFile.getFilePath();

      await mkdir(path.dirname(filePath), {
        recursive: true
      })

      await writeFile(filePath,
        pathRewriter('esm')(outputFile.getText()),
        'utf8');

      consola.success(
        chalk.green(
          `Definition for file: ${chalk.bold(relativePath)} generated`
        )
      )
    })

    return Promise.all(subTasks);
  })


  await Promise.all(task);
}


const addSourceFiles = async (project: Project) => {
  project.addSourceFileAtPath(path.resolve(projectRoot, 'typings/env.d.ts'));

  const globalSourceFile = '**/*.{js?(x),ts?(x),vue}',
    filePaths = excludeFiles(
      await glob([globalSourceFile, '!joymo-lib/**/*'], {
        cwd: pkgRoot,
        absolute: true,
        onlyFiles: true
      })
    ),
    epPaths = excludeFiles(
      await glob(globalSourceFile, {
        cwd: epRoot,
        onlyFiles: true
      })
    )

  const sourceFiles: SourceFile[] = [];

  await Promise.all([
    ...filePaths.map(async file => {
      if (file.endsWith('.vue')) {
        const content = await readFile(file, 'utf-8');
        const hasTsNoCheck = content.includes('@ts-nocheck');

        const sfc = vueCompiler.parse(content);
        const { script, scriptSetup } = sfc.descriptor;
        if (script || scriptSetup) {
          let content = (hasTsNoCheck ? '//@ts-nocheck\n' : '') + (script?.content ?? '');

          if (scriptSetup) {
            const compiled = vueCompiler.compileScript(sfc.descriptor, {
              id: 'xxx',
            })
            content += compiled.content;
          }

          const lang = scriptSetup?.lang || script?.lang || 'js';
          const sourceFile = project.createSourceFile(
            `${path.relative(process.cwd(), file)}.${lang}`,
            content
          )

          sourceFiles.push(sourceFile);
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file);
        sourceFiles.push(sourceFile);
      }
    }),
    ...epPaths.map(async file => {
      const content = await readFile(path.resolve(epRoot, file), 'utf-8')
      sourceFiles.push(
        project.createSourceFile(path.resolve(pkgRoot, file), content)
      )
    })
  ])


  return sourceFiles
}

const typeCheck = async (project: Project) => {
  const diagnostics = project.getPreEmitDiagnostics();

  if (!diagnostics.length) {
    consola.error(project.formatDiagnosticsWithColorAndContext(diagnostics));
    const error = new Error('Failed to generate dts');
    consola.error(error);
    throw error;
  }
}