import path from 'path';
import browserSyncModule from 'browser-sync';
import esMain from 'es-main';

const browserSync = browserSyncModule.create();
const hasStartArg = process.argv.includes('--start');
const dirname = path.dirname(import.meta.url.replace('file://', ''));

const serverConfig = {
  host: '127.0.0.1',
  port: 3001,
};

export function startServer(options = {}, cb = Function.prototype) {
  const defaults = {
    ...serverConfig,
    middleware: [
      {
        route: '/_blank.html',
        handle: function (req, res, next) {
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
      baseDir: path.resolve(dirname, '../'),
      routes: {
        '/docs': path.resolve(dirname, '../../docs'),
        '/docs/changelog.md': './CHANGELOG.md',
        '/lib': path.resolve(dirname, '../../lib'),
        '/node_modules': path.resolve(dirname, '../../node_modules'),
      },
    },
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn: function (snippet, match) {
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

export async function startServerAsync() {
  await new Promise(resolve => {
    startServer({}, () => {
      console.log('\n');
      resolve();
    });
  });
}

export function stopServer() {
  browserSync.exit();
}

const isTopLevelModule = esMain(import.meta);

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
else if (isTopLevelModule) {
  console.info('Use the --start argument to manually start server instance');
}

export const TEST_HOST = `http://${serverConfig.host}:${serverConfig.port}`;
