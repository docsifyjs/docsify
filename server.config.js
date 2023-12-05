import * as path from 'node:path';
import * as url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaults = {
  hostname: '127.0.0.1',
  notify: false,
  open: false,
  rewriteRules: [
    // Replace remote URLs with local paths
    {
      // Changelog
      match: /https?.*\/CHANGELOG.md/g,
      replace: '/CHANGELOG.md',
    },
  ],
  server: {
    baseDir: 'docs',
    index: 'preview.html',
    routes: {
      '/changelog.md': path.resolve(__dirname, 'CHANGELOG.md'),
      '/lib': path.resolve(__dirname, 'lib'),
      '/node_modules': path.resolve(__dirname, 'node_modules'), // Required for automated Vue tests
    },
  },
  snippet: false,
  ui: false,
};

export default {
  // Development (preview, local URLs, watch enabled)
  dev: {
    ...defaults,
    files: ['CHANGELOG.md', 'docs/**/*', 'lib/**/*'],
    port: 3000,
    open: true,
    snippet: true,
    watch: true,
    server: {
      ...defaults.server,
      baseDir: './',
      index: 'index.html',
    },
  },
  // Production (index, CDN URLs, watch disabled)
  prod: {
    ...defaults,
    port: 8080,
    server: {
      ...defaults.server,
      index: 'index.html',
    },
  },
  // Test (preview, local URLs, watch disabled)
  test: {
    ...defaults,
    middleware: [
      // Blank page required for test environment
      {
        route: '/_blank.html',
        handle(req, res, next) {
          res.setHeader('Content-Type', 'text/html');
          res.end('');
          next();
        },
      },
    ],
    port: 4000,
  },
};
