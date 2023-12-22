import * as path from 'node:path';
import * as url from 'node:url';
import { rewriteRules } from './middleware.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production (CDN URLs, watch disabled)
export const prodConfig = {
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
export const devConfig = {
  ...prodConfig,
  files: ['CHANGELOG.md', 'docs/**/*', 'lib/**/*'],
  port: 3000,
  rewriteRules,
  server: {
    ...prodConfig.server,
    routes: {
      '/changelog.md': path.resolve(__dirname, 'CHANGELOG.md'),
      '/lib': path.resolve(__dirname, 'lib'),
      '/node_modules': path.resolve(__dirname, 'node_modules'), // Required for automated Vue tests
    },
  },
  snippet: true,
};

// Test (local URLs, watch disabled)
export const testConfig = {
  ...devConfig,
  port: 4000,
  server: {
    ...devConfig.server,
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
