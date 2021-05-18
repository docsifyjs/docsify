import liveServer from 'live-server';
import { qualifyURL } from './packages/docsify-server-renderer/src/utils';

const isSSR = !!process.env.SSR;
const middleware = [];
const port = 3000;

main();

async function main() {
  if (isSSR) {
    // Using JSDom here because the server relies on a small subset of DOM APIs.
    // The URL used here serves no purpose other than to give JSDOM an HTTP
    // URL to operate under (it probably can be anything).
    initJSDOM('', { url: 'http://127.0.0.1:' + port });

    const { Renderer, getServerHTMLTemplate } = await import(
      './packages/docsify-server-renderer/index'
    );

    const renderer = new Renderer({
      // The default template is simple, without any plugins or scripts, just docsify.js.
      // template: getServerHTMLTemplate(),

      template: /* html */ `
        <html lang="en">
          <head>
            <title>docsify</title>
            <meta name="description" content="A magical documentation generator." />
            <link rel="icon" href="_media/favicon.ico" />
            <meta
              name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
            />
            <meta
              name="keywords"
              content="doc,docs,documentation,gitbook,creator,generator,github,jekyll,github-pages"
            />
            <link rel="stylesheet" href="/themes/vue.css" title="vue" />
            <link rel="stylesheet" href="/themes/dark.css" title="dark" disabled />
            <link rel="stylesheet" href="/themes/buble.css" title="buble" disabled />
            <link rel="stylesheet" href="/themes/pure.css" title="pure" disabled />
            <style>
              nav.app-nav li ul {
                min-width: 100px;
              }

              #carbonads {
                box-shadow: none !important;
                width: auto !important;
              }
            </style>
          </head>
          <body>
            <!-- Order matters here! -->

            <!-- FIRST, specify where the $docsify config object will be injected: -->
            <!--inject-config-->

            <script src="//cdn.jsdelivr.net/npm/docsify-plugin-carbon@1/index.js"></script>

            <!-- Currently the config object is injected, and anything dynamic
              that can not be 'JSON.stringify'ed (f.e. functions)
              should be added in the HTML to the config object. -->
            <script>
              globalThis.$docsify = {
                ...globalThis.$docsify,

                // TODO: Vue components currently only work when switching to a
                // page dynamic after the first render (after initial SSR). On
                // initial SSR, the Vue components do not come to life, but
                // will once you switch pages and come back.
                vueComponents: {
                  'button-counter': {
                    template:
                      '<button @click="count += 1">You clicked me {{ count }} times</button>',
                    data: function () {
                      return { count: 0 };
                    },
                  },
                },
                vueGlobalOptions: {
                  data: function () {
                    return {
                      count: 0,
                      message: 'Hello, World!',
                      // Fake API response
                      images: [
                        {
                          title: 'Image 1',
                          url: 'https://picsum.photos/150?random=1',
                        },
                        {
                          title: 'Image 2',
                          url: 'https://picsum.photos/150?random=2',
                        },
                        {
                          title: 'Image 3',
                          url: 'https://picsum.photos/150?random=3',
                        },
                      ],
                    };
                  },
                  computed: {
                    timeOfDay: function () {
                      const date = new Date();
                      const hours = date.getHours();

                      if (hours < 12) {
                        return 'morning';
                      } else if (hours < 18) {
                        return 'afternoon';
                      } else {
                        return 'evening';
                      }
                    },
                  },
                  methods: {
                    hello: function () {
                      alert(this.message);
                    },
                  },
                },
                vueMounts: {
                  '#counter': {
                    data: function () {
                      return { count: 0 };
                    },
                  },
                },

                // TODO Plugins don't work on initial SSR render, only on dynamic page switches.
                plugins: [
                  DocsifyCarbon.create('CEBI6KQE', 'docsifyjsorg'),
                  function (hook, vm) {
                    hook.beforeEach(function (html) {
                      if (/githubusercontent\\.com/.test(vm.route.file)) {
                        url = vm.route.file
                          .replace('raw.githubusercontent.com', 'github.com')
                          .replace(/\\/master/, '/blob/master');
                      } else if (/jsdelivr\\.net/.test(vm.route.file)) {
                        url = vm.route.file
                          .replace('cdn.jsdelivr.net/gh', 'github.com')
                          .replace('@master', '/blob/master');
                      } else {
                        url =
                          'https://github.com/docsifyjs/docsify/blob/develop/docs/' +
                          vm.route.file;
                      }
                      var editHtml = '[:memo: Edit Document](' + url + ')\\n';
                      return (
                        editHtml +
                        html +
                        '\\n\\n----\\n\\n' +
                        '<a href="https://docsify.js.org" target="_blank" style="color: inherit; font-weight: normal; text-decoration: none;">Powered by docsify</a>'
                      );
                    });
                  },
                ],
              };
            </script>

            <!-- SECOND, load Docsify and plugins as needed: -->
            <script src="/lib/docsify.js"></script>

            <!-- FIXME Search plugin causes SSR to break. -->
            <!-- <script src="/lib/plugins/search.js"></script> -->

            <!--
            <script src="/lib/plugins/emoji.js"></script>
            <script src="/lib/plugins/front-matter.js"></script>
            -->

            <script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-bash.min.js"></script>
            <script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-markdown.min.js"></script>
            <script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-nginx.min.js"></script>
            <script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-php.min.js"></script>

            <script src="//cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js"></script>

            <!-- FINALLY, specify where to inject the rendered content. -->
            <!--inject-app-->
          </body>
        </html>
      `,

      config: {
        name: 'docsify',
        // repo: 'docsifyjs/docsify',
        alias: {
          '.*?/awesome':
            'https://raw.githubusercontent.com/docsifyjs/awesome-docsify/master/README.md',
          '.*?/changelog':
            'https://raw.githubusercontent.com/docsifyjs/docsify/master/CHANGELOG.md',
          '/.*/_navbar.md': '/_navbar.md',
          '/es/(.*)':
            'https://raw.githubusercontent.com/docsifyjs/docs-es/master/$1',
          '/de-de/(.*)':
            'https://raw.githubusercontent.com/docsifyjs/docs-de/master/$1',
          '/ru-ru/(.*)':
            'https://raw.githubusercontent.com/docsifyjs/docs-ru/master/$1',
          '/zh-cn/(.*)':
            'https://cdn.jsdelivr.net/gh/docsifyjs/docs-zh@master/$1',

          // In SSR mode, the _sidebar fallback mechanism is not implemented,
          // so without this, sub pages will show their specific sidebar
          // instead of the top-level sidebar.
          //
          // TODO SSR needs to have the fallback mechanism too, so it matches
          // with the dynamic-site behavior by default, without having to add
          // this line.
          '/.*/_sidebar.md': '/_sidebar.md',
        },
        auto2top: true,

        // TODO better handling of these cases, perhaps a (sane?) default value.
        // basePath: undefined, // breaks: if base path is not set while in SSR mode, code tries to operate on an undefined value and errors.
        // basePath: '', // breaks: similar to undefined, server doesn't lookup file correctly.

        // If this is used, then after the initial payload is sent to the
        // client, the client will then make all following requests to
        // docsify.js.org for dynamic markdown rendering.
        // basePath: 'https://docsify.js.org/',

        basePath: '/docs',

        hasSSR: true,
        // coverpage: true, FIXME, not working in SSR.
        executeScript: true,
        loadSidebar: true,
        loadNavbar: true,
        mergeNavbar: true,
        maxLevel: 4,
        subMaxLevel: 2,
        search: {
          noData: {
            '/es/': '¡No hay resultados!',
            '/de-de/': 'Keine Ergebnisse!',
            '/ru-ru/': 'Никаких результатов!',
            '/zh-cn/': '没有结果!',
            '/': 'No results!',
          },
          paths: 'auto',
          placeholder: {
            '/es/': 'Buscar',
            '/de-de/': 'Suche',
            '/ru-ru/': 'Поиск',
            '/zh-cn/': '搜索',
            '/': 'Search',
          },
          pathNamespaces: ['/es', '/de-de', '/ru-ru', '/zh-cn'],
        },
      },
    });

    middleware.push(function (req, res, next) {
      const url = new URL(qualifyURL(req.url));

      // If the hasSSR flag is enabled, then dynamic fetches of markdown from a
      // "hydrated" cilent should not be compiled to HTML.
      if (url.searchParams.has('hasSSR')) {
        console.log('Skipping markdown handling for already-loaded client.');
        return next();
      }

      // Only handle markdown files or folders.
      if (/(\.md|\/[^.]*)$/.test(url.pathname)) {
        console.log('Render markdown to HTML on the server for file ', req.url);

        // This eventually feeds through the getFileName() function in
        // src/core/router/history/base.js.
        renderer.renderToString(req.url).then(html => res.end(html));

        return;
      }

      // TODO There will surely be edge cases. Add an option to force certain files?
      console.log('Skipping markdown handling of file ' + req.url);

      return next();
    });
  }

  const params = {
    port,
    watch: ['lib', 'docs', 'themes'],
    middleware,
  };

  liveServer.start(params);
}

async function initJSDOM(markup, options) {
  const { JSDOM } = (await import('jsdom')).default;
  const dom = new JSDOM(markup, options);

  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.location = dom.window.location;
  global.XMLHttpRequest = dom.window.XMLHttpRequest;

  return dom;
}
