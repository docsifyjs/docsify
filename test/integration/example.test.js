import { waitForFunction, waitForText } from '../helpers/wait-for.js';
import docsifyInit from '../helpers/docsify-init.js';

describe('Creating a Docsify site (integration tests in Jest)', function () {
  test('Docsify /docs/ site using docsifyInit()', async () => {
    await docsifyInit({
      // _logHTML: true,
    });

    // Verify config options
    expect(typeof window.$docsify).toBe('object');

    // Verify options.markdown content was rendered
    expect(document.querySelector('#main').textContent).toContain(
      'A magical documentation site generator',
    );
  });

  test('kitchen sink docsify site using docsifyInit()', async () => {
    const docsifyInitConfig = {
      config: {
        name: 'Docsify Name',
      },
      markdown: {
        coverpage: `
          # Docsify Test

          > Testing a magical documentation site generator

          [GitHub](https://github.com/docsifyjs/docsify/)
        `,
        homepage: `
          # Hello World

          This is the homepage.
        `,
        navbar: `
          - [docsify.js.org](https://docsify.js.org/#/)
        `,
        sidebar: `
          - [Test Page](test)
        `,
      },
      routes: {
        'test.md': `
          # Test Page

          This is a custom route.
        `,
        'data-test-scripturls.js': `
          document.body.setAttribute('data-test-scripturls', 'pass');
        `,
      },
      script: `
        document.body.setAttribute('data-test-script', 'pass');
      `,
      scriptURLs: [
        // docsifyInit() route
        'data-test-scripturls.js',
      ],
      style: `
        body {
          background: red !important;
        }
      `,
      styleURLs: ['/dist/themes/core.css'],
    };

    await docsifyInit({
      ...docsifyInitConfig,
      // _logHTML: true,
    });

    // Verify config options
    expect(typeof window.$docsify).toBe('object');
    expect(document.querySelector('.app-name').textContent).toContain(
      'Docsify Name',
    );

    // Verify docsifyInitConfig.markdown content was rendered
    Object.entries({
      'section.cover': 'Docsify Test', // Coverpage
      'nav.app-nav': 'docsify.js.org', // Navbar
      'aside.sidebar': 'Test Page', // Sidebar
      '#main': 'This is the homepage', // Homepage
    }).forEach(([selector, content]) => {
      expect(document.querySelector(selector).textContent).toContain(content);
    });

    // Verify docsifyInitConfig.scriptURLs were added to the DOM
    for (const scriptURL of docsifyInitConfig.scriptURLs) {
      const matchElm = document.querySelector(
        `script[data-src$="${scriptURL}"]`,
      );
      expect(matchElm).toBeTruthy();
    }

    // Verify docsifyInitConfig.scriptURLs were executed
    expect(document.body.hasAttribute('data-test-scripturls')).toBe(true);

    // Verify docsifyInitConfig.script was added to the DOM
    expect(
      [...document.querySelectorAll('script')].some(
        elm =>
          elm.textContent.replace(/\s+/g, '') ===
          docsifyInitConfig.script.replace(/\s+/g, ''),
      ),
    ).toBe(true);

    // Verify docsifyInitConfig.script was executed
    expect(document.body.hasAttribute('data-test-script')).toBe(true);

    // Verify docsifyInitConfig.styleURLs were added to the DOM
    for (const styleURL of docsifyInitConfig.styleURLs) {
      const matchElm = document.querySelector(
        `link[rel*="stylesheet"][href$="${styleURL}"]`,
      );
      expect(matchElm).toBeTruthy();
    }

    // Verify docsifyInitConfig.style was added to the DOM
    expect(
      [...document.querySelectorAll('style')].some(
        elm =>
          elm.textContent.replace(/\s+/g, '') ===
          docsifyInitConfig.style.replace(/\s+/g, ''),
      ),
    ).toBe(true);

    // Verify docsify navigation and docsifyInitConfig.routes
    document.querySelector('a[href="#/test"]').click();
    expect(
      await waitForFunction(() => /#\/test$/.test(window.location.href)),
    ).toBeTruthy();
    expect(await waitForText('#main', 'This is a custom route')).toBeTruthy();
  });

  test('embed file code fragment renders', async () => {
    await docsifyInit({
      markdown: {
        homepage: `
          # Embed Test

          [filename](_media/example1.js ':include :type=code :fragment=demo')
        `,
      },
      routes: {
        '_media/example1.js': `
            let myURL = 'https://api.example.com/data';
            /// [demo]
            const result = fetch(myURL)
              .then(response => {
                return response.json();
              })
              .then(myJson => {
                console.log(JSON.stringify(myJson));
              });
            /// [demo]
            result.then(console.log).catch(console.error);
        `,
      },
    });

    // Wait for the embedded fragment to be fetched and rendered into #main
    expect(
      await waitForText('#main', 'console.log(JSON.stringify(myJson));'),
    ).toBeTruthy();

    const mainText = document.querySelector('#main').textContent;
    expect(mainText).not.toContain('https://api.example.com/data');
    expect(mainText).not.toContain(
      'result.then(console.log).catch(console.error);',
    );
  });

  test('embed file full line fragment identifier', async () => {
    await docsifyInit({
      markdown: {
        homepage: `
          # Embed Test

          [filename](_media/example1.html ':include :type=code :fragment=demo :fragmentFullLine')
        `,
      },
      routes: {
        '_media/example1.html': `
            <script>
            let myURL = 'https://api.example.com/data';
            /// [demo] Full line fragment identifier (all of these words here should not be included in fragment)
            const result = fetch(myURL)
              .then(response => {
                return response.json();
              })
              .then(myJson => {
                console.log(JSON.stringify(myJson));
              });
            <!-- /// [demo] -->
            result.then(console.log).catch(console.error);
            </script>
        `,
      },
    });

    // Wait for the embedded fragment to be fetched and rendered into #main
    expect(
      await waitForText('#main', 'console.log(JSON.stringify(myJson));'),
    ).toBeTruthy();

    const mainText = document.querySelector('#main').textContent;
    expect(mainText).not.toContain('https://api.example.com/data');
    expect(mainText).not.toContain('Full line fragment identifier');
    expect(mainText).not.toContain('-->');
    expect(mainText).not.toContain(
      'result.then(console.log).catch(console.error);',
    );
  });

  test('embed multiple file code fragments', async () => {
    await docsifyInit({
      markdown: {
        homepage: `
          # Embed Test

          [filename](_media/example1.js ':include :type=code :fragment=demo')
          
          [filename](_media/example2.js ":include :type=code :fragment=something")
          
          # Text between
          
          [filename](_media/example3.js ':include :fragment=something_else_not_code')
          
          [filename](_media/example4.js ':include :fragment=demo')
          
          # Text after
        `,
      },
      routes: {
        '_media/example1.js': `
            let example1 = 1;
            /// [demo]
            example1 += 10;
            /// [demo]
            console.log(example1);`,
        '_media/example2.js': `
            let example1 = 1;
            ### [something]
            example2 += 10;
            ### [something]
            console.log(example2);`,
        '_media/example3.js': `
            let example3 = 1;
            ### [something_else_not_code]
            example3 += 10;
            /// [something_else_not_code]
            console.log(example3);`,
        '_media/example4.js': `
            let example4 = 1;
            ### No fragment here
            example4 += 10;
            /// No fragment here
            console.log(example4);`,
      },
    });

    expect(await waitForText('#main', 'example1 += 10;')).toBeTruthy();
    expect(await waitForText('#main', 'example2 += 10;')).toBeTruthy();
    expect(await waitForText('#main', 'example3 += 10;')).toBeTruthy();

    const mainText = document.querySelector('#main').textContent;
    expect(mainText).toContain('Text between');
    expect(mainText).toContain('Text after');
    expect(mainText).not.toContain('let example1 = 1;');
    expect(mainText).not.toContain('let example2 = 1;');
    expect(mainText).not.toContain('let example3 = 1;');
    expect(mainText).not.toContain('console.log(example1);');
    expect(mainText).not.toContain('console.log(example2);');
    expect(mainText).not.toContain('console.log(example3);');
    expect(mainText).not.toContain('console.log(example4);');
    expect(mainText).not.toContain('example4 += 10;');
    expect(mainText).not.toContain('No fragment here');
  });
});
