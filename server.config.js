import * as path from 'node:path';
import * as url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rewrite rules shared with Vercel middleware.js
export const rewriteRules = [
  // Replace CDN URLs with local paths
  {
    match: /https?.*\/CHANGELOG.md/g,
    replace: '/CHANGELOG.md',
  },
  {
    // CDN versioned default
    // Ex1: //cdn.com/package-name
    // Ex2: http://cdn.com/package-name@1.0.0
    // Ex3: https://cdn.com/package-name@latest
    match: /(?:https?:)*\/\/.*cdn.*docsify[@\d.latest]*(?=["'])/g,
    replace: '/lib/docsify.min.js',
  },
  {
    // CDN paths to local paths
    // Ex1: //cdn.com/package-name/path/file.js => /path/file.js
    // Ex2: http://cdn.com/package-name@1.0.0/dist/file.js => /dist/file.js
    // Ex3: https://cdn.com/package-name@latest/dist/file.js => /dist/file.js
    match: /(?:https?:)*\/\/.*cdn.*docsify[@\d.latest]*\/(?:lib\/)/g,
    replace: '/lib/',
  },
];

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
