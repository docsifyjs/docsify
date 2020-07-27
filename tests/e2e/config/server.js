const browserSync = require('browser-sync').create();
const path = require('path');

const hasStartArg = process.argv.includes('--start');
const serverConfig = {
  host: '127.0.0.1',
  port: 3001,
};

function startServer(options = {}) {
  const defaults = {
    notify: false,
    open: false,
    rewriteRules: [
      // Replace CDN URLs with local paths
      {
        match: /(https?:)?\/\/cdn\.jsdelivr\.net\/npm\/docsify(@\d?\.?\d?\.?\d)?\/lib\//g,
        replace: '/lib/',
      },
    ],
    server: {
      baseDir: path.resolve(__dirname, '../fixtures'),
      routes: {
        '/docs': path.resolve(__dirname, '../../../docs'),
        '/lib': path.resolve(__dirname, '../../../lib'),
        '/docs/changelog.md': './CHANGELOG.md',
      },
    },
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn: function(snippet, match) {
          // Override changelog alias to load local changelog (see routes)
          const injectJS = `
            <script>
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

  browserSync.init({
    ...defaults,
    ...serverConfig,
    ...options,
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
    port: serverConfig.port + 2,
    startPath: '/docs',
  });
}

module.exports = {
  start: startServer,
  stop: stopServer,
  URL: `http://${serverConfig.host}:${serverConfig.port}`,
};
