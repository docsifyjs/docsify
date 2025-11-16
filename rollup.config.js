import fs from 'node:fs/promises';
import path from 'node:path';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-import-css';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { glob } from 'glob';
import { stripIndent } from 'common-tags';

// Setup
// =============================================================================
// Docsify
const docsifyConfig = {
  inputPath: 'src/core/index.js',
  outputDir: 'dist',
  outputName: 'docsify',
  title: 'Docsify',
};

// Plugins
const pluginPaths = await glob(['src/plugins/*.js', 'src/plugins/*/index.js']);
const pluginConfigs = pluginPaths.map(pluginPath => {
  const dir = path.basename(path.dirname(pluginPath)); // path/to/dir/file.js => dir
  const name = path.basename(pluginPath, '.js'); // path/to/dir/file.js => file
  const outputName = name === 'index' ? dir : name;

  return {
    inputPath: pluginPath,
    outputDir: 'dist/plugins',
    outputName,
    title: `Docsify Plugin: ${outputName}`,
  };
});

// Rollup configurations
// =============================================================================
const currentYear = new Date().getFullYear();
const { homepage, license, version } = JSON.parse(
  await fs.readFile(path.join(import.meta.dirname, 'package.json'), 'utf8'),
);
const baseConfig = {
  output: {
    format: 'iife',
  },
  plugins: [
    resolve(),
    commonjs(),
    css(),
    replace({
      preventAssignment: true,
      values: {
        __VERSION__: version,
      },
    }),
    babel({
      babelHelpers: 'bundled',
    }),
  ],
  watch: {
    clearScreen: false,
  },
};
const bundleConfigs = [];

// Generate rollup configurations
[docsifyConfig, ...pluginConfigs].forEach(bundleConfig => {
  const { inputPath, outputDir, outputName, title } = bundleConfig;
  // prettier-ignore
  const banner = stripIndent`
    /*!
     * ${title} v${version}
     * ${homepage}
     * (c) 2017-${currentYear}
     * ${license} license
     */
  `;
  const minifiedConfig = {
    ...baseConfig,
    input: inputPath,
    output: {
      ...baseConfig.output,
      banner,
      file: path.join(outputDir, `${outputName}.min.js`),
      sourcemap: true,
    },
    plugins: [
      ...baseConfig.plugins,
      terser({
        output: {
          comments: /^!/,
        },
      }),
    ],
  };
  const unminifiedConfig = {
    ...baseConfig,
    input: inputPath,
    output: {
      ...baseConfig.output,
      banner,
      file: path.join(outputDir, `${outputName}.js`),
    },
    plugins: [
      ...baseConfig.plugins,
      terser({
        compress: false,
        mangle: false,
        output: {
          beautify: true,
          comments: /^!/,
        },
      }),
    ],
  };

  bundleConfigs.push(minifiedConfig, unminifiedConfig);
});

// Exports
// =============================================================================
export default [...bundleConfigs];
