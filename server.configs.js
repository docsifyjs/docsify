import * as path from 'node:path';
import * as url from 'node:url';
import { rewriteRules } from './middleware.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production (CDN URLs, watch disabled)
const prod = {
  hostname: '127.0.0.1',
  notify: false,
  open: false,
  port: 8080,
  server: {
    baseDir: './docs',
  },
  snippet: false,
  ui: false,
};

// Development (local URLs, watch enabled)
const dev = {
  ...prod,
  files: ['CHANGELOG.md', 'docs/**/*', 'lib/**/*'],
  port: 3000,
  rewriteRules,
  server: {
    ...prod.server,
    routes: {
      '/changelog.md': path.resolve(__dirname, 'CHANGELOG.md'),
      '/lib': path.resolve(__dirname, 'lib'),
      '/node_modules': path.resolve(__dirname, 'node_modules'), // Required for automated Vue tests
    },
  },
  snippet: true,
};

// Test (local URLs, watch disabled)
const test = {
  ...dev,
  port: 4000,
  server: {
    ...dev.server,
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
  },
  snippet: false,
  watch: false,
};

export default {
  dev,
  prod,
  test,
};
