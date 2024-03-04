import path from 'path';
import { promises as fs } from 'fs';
import * as rollup from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import uglify from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import chokidar from 'chokidar';
import { relative } from './util.js';

const pkgPath = relative(import.meta, '..', 'package.json');
const pkgString = (await fs.readFile(pkgPath)).toString();
const pkg = JSON.parse(pkgString);
const isProd = process.env.NODE_ENV === 'production';
const version = process.env.VERSION || pkg.version;

/**
 * @param {{
 *   input: string,
 *   output?: string,
 *   globalName?: string,
 *   plugins?: Array<import('rollup').Plugin>
 * }} opts
 */
async function build(opts) {
  await rollup
    .rollup({
      input: opts.input,
      plugins: [
        ...(opts.plugins || []),
        commonjs(),
        nodeResolve(),
        replace({
          __VERSION__: version,
        }),
      ],
      onwarn(message) {
        if (message.code === 'UNRESOLVED_IMPORT') {
          throw new Error(
            `Could not resolve module ` +
              message.source +
              `. Try running 'npm install' or using rollup's 'external' option if this is an external dependency. ` +
              `Module ${message.source} is imported in ${message.importer}`
          );
        }
      },
    })
    .then(bundle => {
      const dest = 'lib/' + (opts.output || opts.input);

      console.log(dest);
      return bundle.write({
        format: 'iife',
        output: opts.globalName ? { name: opts.globalName } : {},
        file: dest,
        strict: false,
      });
    });
}

async function buildCore() {
  const promises = [];

  promises.push(
    build({
      input: 'src/core/index.js',
      output: 'docsify.js',
    })
  );

  if (isProd) {
    promises.push(
      build({
        input: 'src/core/index.js',
        output: 'docsify.min.js',
        plugins: [uglify()],
      })
    );
  }

  await Promise.all(promises);
}

async function buildAllPlugin() {
  const plugins = [
    { name: 'search', input: 'search/index.js' },
    { name: 'ga', input: 'ga.js' },
    { name: 'gtag', input: 'gtag.js' },
    { name: 'matomo', input: 'matomo.js' },
    { name: 'emoji', input: 'emoji.js' },
    { name: 'external-script', input: 'external-script.js' },
    { name: 'front-matter', input: 'front-matter/index.js' },
    { name: 'zoom-image', input: 'zoom-image.js' },
    { name: 'disqus', input: 'disqus.js' },
    { name: 'gitalk', input: 'gitalk.js' },
  ];

  const promises = plugins.map(item => {
    return build({
      input: 'src/plugins/' + item.input,
      output: 'plugins/' + item.name + '.js',
    });
  });

  if (isProd) {
    plugins.forEach(item => {
      promises.push(
        build({
          input: 'src/plugins/' + item.input,
          output: 'plugins/' + item.name + '.min.js',
          plugins: [uglify()],
        })
      );
    });
  }

  await Promise.all(promises);
}

async function main() {
  if (!isProd) {
    chokidar
      .watch(['src/core', 'src/plugins'], {
        atomic: true,
        awaitWriteFinish: {
          stabilityThreshold: 1000,
          pollInterval: 100,
        },
      })
      .on('change', p => {
        console.log('[watch] ', p);
        const dirs = p.split(path.sep);
        if (dirs[1] === 'core') {
          buildCore();
        } else if (dirs[2]) {
          const name = path.basename(dirs[2], '.js');
          const input = `src/plugins/${name}${
            /\.js/.test(dirs[2]) ? '' : '/index'
          }.js`;

          build({
            input,
            output: 'plugins/' + name + '.js',
          });
        }
      })
      .on('ready', () => {
        console.log('[start]');
        buildCore();
        buildAllPlugin();
      });
  } else {
    await Promise.all([buildCore(), buildAllPlugin()]);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
