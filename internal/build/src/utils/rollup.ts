import { getPackageDependencies, epPackage } from '@coveyz/build-utils';
import type { OutputOptions, RollupBuild } from 'rollup';

/** 生成外部 */
export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(epPackage);

  return (id: string) => {
    const packages: string[] = peerDependencies;

    if (!options.full) {
      packages.push("@vue", ...dependencies);
    }

    return [...new Set(packages)].some(
      (pkg) => id === pkg || id.startsWith(`${pkg}/`)
    )
  }
}

export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map(option => bundle.write(option)))
}