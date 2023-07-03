import { create } from 'browser-sync';
import path from 'path';
import url from 'url';
import { noop } from '../../src/core/util/core.js';

const browserSync = create();

const hasStartArg = process.argv.includes('--start');
const serverConfig = {
  hostname: '127.0.0.1',
  port: hasStartArg ? 3002 : 3001,
};

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TEST_HOST = `http://${serverConfig.hostname}:${serverConfig.port}`;

function startServer(options = {}, cb = noop) {
  const defaults = {
    ...serverConfig,
    middleware: [
      {
        route: '/_blank.html',
        handle(req, res, next) {
          res.setHeader('Content-Type', 'text/html');
          res.end('');
          next();
        },
      },
    ],
    notify: false,
    open: false,
    rewriteRules: [
      // Replace docsify-related CDN URLs with local paths
      {
        match:
          /(https?:)?\/\/cdn\.jsdelivr\.net\/npm\/docsify(@\d?\.?\d?\.?\d)?\/lib\//g,
        replace: '/lib/',
      },
    ],
    server: {
      baseDir: path.resolve(__dirname, '../'),
      routes: {
        '/docs': path.resolve(__dirname, '../../docs'),
        '/docs/changelog.md': './CHANGELOG.md',
        '/lib': path.resolve(__dirname, '../../lib'),
        '/node_modules': path.resolve(__dirname, '../../node_modules'),
      },
    },
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn(snippet, match) {
          // Override changelog alias to load local changelog (see routes)
          const newSnippet = /* html */ `
            ${snippet.replace(/<script[^>]*/, '$& type="text/plain"')}
            <script>
              {
                const aliasConfig = (window && window.$docsify && window.$docsify.alias) || {};

                // Fix /docs site configuration during tests
                aliasConfig['.*?/changelog'] = '/changelog.md';

                // Enable BrowserSync snippet
                document.querySelector('#__bs_script__').removeAttribute('type');
              }
            </script>
            ${match}
          `;

          return newSnippet;
        },
      },
    },
    ui: false,
  };

  console.log('\n');

  // Set TEST_HOST environment variable
  process.env.TEST_HOST = TEST_HOST;

  // Start server
  browserSync.init(
    // Config
    {
      ...defaults,
      ...options,
    },
    // Callback
    cb
  );
}

async function startServerAsync() {
  await new Promise((resolve, reject) => {
    startServer({}, () => {
      console.log('\n');
      resolve();
    });
  });
}

function stopServer() {
  browserSync.exit();
}

// Allow starting the test server from the CLI. Useful for viewing test content
// like fixtures (/index.html)) and local docs site (/docs) used for testing.
if (hasStartArg) {
  startServer({
    open: true,
    port: serverConfig.port,
    directory: true,
    startPath: '/docs',
  });
}
// Display friendly message about manually starting a server instance
else if (isMain(import.meta)) {
  console.info('Use --start argument to manually start server instance');
}

// Replacement for CommonJS `require.main === module`. https://2ality.com/2022/07/nodejs-esm-main.html
function isMain(meta) {
  if (meta.url.startsWith('file:')) {
    if (process.argv[1] === __filename) return true;
  }
  return false;
}

export default {
  start: startServer,
  startAsync: startServerAsync,
  stop: stopServer,
};
