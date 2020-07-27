const path = require('path');

const SERVER_HOST = '127.0.0.1';
const SERVER_PORT = 3001;

// Dependencies
// =============================================================================
const browserSync = require('browser-sync').create();

function startServer() {
  browserSync.init({
    host: SERVER_HOST,
    notify: false,
    open: false,
    port: SERVER_PORT,
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
    ui: {
      port: 3002,
    },
  });
}

function stopServer() {
  browserSync.exit();
}

module.exports = {
  start: startServer,
  stop: stopServer,
  URL: `http://${SERVER_HOST}:${SERVER_PORT}`,
};
