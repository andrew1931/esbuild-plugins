import { build, buildSync } from 'esbuild';
import type { BuildOptions } from 'esbuild';

/**
 * Create esbuild `BuildOptions` for `buildToCode`
 */
export const createBuildToCodeOptions = (
  filePath: string
): BuildOptions & { write: false } => ({
  entryPoints: [filePath],
  format: 'cjs',
  platform: 'node',
  target: 'node12',
  bundle: true,
  write: false,
  external: [
    'fsevents',
    'vuepress',
    '@vuepress/*',
    'vite',
    'rollup',
    'react-refresh',
  ],
});

/**
 * Take a file as entry point, and build it to cjs code
 */
export const buildToCode = async (filePath: string): Promise<string> => {
  const buildResult = await build(createBuildToCodeOptions(filePath));
  return buildResult.outputFiles[0].text;
};

/**
 * Sync version fo `buildToCode`
 */
export const buildToCodeSync = (filePath: string): string => {
  const buildResult = buildSync(createBuildToCodeOptions(filePath));
  return buildResult.outputFiles[0].text;
};

export const allowTs = (): void => {
  // eslint-disable-next-line node/no-deprecated-api
  require.extensions['.ts'] = (m: any, filename) => {
    const code = buildToCodeSync(filename);
    m._compile(code, filename);
  };
};