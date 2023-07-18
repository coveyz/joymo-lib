import type { RollupBuild, OutputOptions } from 'rollup';
import { epPackage, getPackageDependencies } from '@coveyz/build-utils';

//🧀 生成
export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(epPackage);

  console.log('generateExternal=>,', epPackage);

  return (id: string) => {
    const packages: string[] = peerDependencies;

    if (!options.full) {
      packages.push('@vue', ...dependencies);
    }
    return [...new Set(packages)].some(pkg => id === pkg || id.startsWith(`${pkg}/`))
  }
}

export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  console.log('writeBundles=>🥥🥥🥥🥥🥥🥥🥥🥥🥥🥥🥥🥥')
  return Promise.all((options.map(option => bundle.write(option))))
}