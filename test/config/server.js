import { create } from 'browser-sync';
import path from 'path';
import isMain from 'es-main';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const browserSync = create();

const hasStartArg = process.argv.includes('--start');

const serverConfig = {
  host: '127.0.0.1',
  port: 3001,
};

const __dirname = dirname(fileURLToPath(import.meta.url));

function startServer(options = {}, cb = Function.prototype) {
  const defaults = {
    ...serverConfig,
    middleware: [
      {
        route: '/_blank.html',
        handle: function(req, res, next) {
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
        match: /(https?:)?\/\/cdn\.jsdelivr\.net\/npm\/docsify(@\d?\.?\d?\.?\d)?\/lib\//g,
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
        fn: function(snippet, match) {
          // Override changelog alias to load local changelog (see routes)
          const injectJS = `
            <script>
              // Fix /docs site configuration during tests
              (function() {
                const aliasConfig = (window && window.$docsify && window.$docsify.alias) || {};

                aliasConfig['.*?/changelog'] = '/changelog.md';
              })();
            </script>
          `;

          return injectJS + snippet + match;
        },
      },
    },
    ui: false,
  };

  console.log('\n');

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
    port: serverConfig.port + 1,
    directory: true,
    startPath: '/docs',
  });
}
// Display friendly message about manually starting a server instance
else if (isMain(import.meta)) {
  console.info('Use --start argument to manually start server instance');
}

export {
  startServer as start,
  startServerAsync as startAsync,
  stopServer as stop,
};

export const TEST_HOST = `http://${serverConfig.host}:${serverConfig.port}`;
