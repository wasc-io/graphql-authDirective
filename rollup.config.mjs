// import dts from 'rollup-plugin-dts';
// import esbuild from 'rollup-plugin-esbuild';
import ts from 'rollup-plugin-ts';
import pkg from './package.json' assert { type: 'json' };

export default [
  {
    plugins: [
      ts({
        tsconfig: {
          allowSyntheticDefaultImports: true,
          declaration: true,
        },
      }),
    ],
    external: Object.keys(pkg.dependencies),
    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify
    // `file` and `format` for each target)
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
