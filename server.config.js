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
    {
      // CDN defaults (w/o path)
      // Match: Full URL
      // Ex1: //cdn.com/package-name
      // Ex2: http://cdn.com/package-name@1.0.0
      // Ex3: https://cdn.com/package-name@latest
      match: /(?:https?:)*\/\/.*cdn.*docsify[@\d.latest]*(?=["'])/g,
      replace: '/lib/docsify.min.js',
    },
    {
      // CDN paths
      // Match: Path only
      // Ex1: //cdn.com/package-name/path/file.js => /path/file.js
      // Ex2: http://cdn.com/package-name@1.0.0/path/file.js => /path/file.js
      // Ex3: https://cdn.com/package-name@latest/path/file.js => /path/file.js
      match: /(?:https?:)*\/\/.*cdn.*docsify[@\d.latest]*\/(?:lib\/)/g,
      replace: '/lib/',
    },
  ],
  server: {
    baseDir: 'docs',
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
  // Development (watch files and auto inject/reload on change)
  dev: {
    ...defaults,
    files: ['CHANGELOG.md', 'docs/**/*', 'lib/**/*'],
    port: 3000,
    open: true,
    snippet: true,
  },
  // Production (watch disabled)
  prod: {
    ...defaults,
    port: 8080,
  },
  // Test: (watch disabled, blank page route, unique port)
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
