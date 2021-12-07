const docsifyInit = require('../helpers/docsify-init');

// Suite
// -----------------------------------------------------------------------------
describe('Search Plugin Tests', function() {
  // Tests
  // ---------------------------------------------------------------------------
  test('search readme', async () => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
          # Hello World

          This is the homepage.
        `,
        sidebar: `
          - [Test Page](test)
        `,
      },
      routes: {
        '/test.md': `
          # Test Page

          This is a custom route.
        `,
      },
      scriptURLs: ['/lib/plugins/search.min.js'],
    };

    await docsifyInit(docsifyInitConfig);
    await page.fill('input[type=search]', 'hello');
    await expect(page).toEqualText('.results-panel h2', 'Hello World');
    await page.click('.clear-button');
    await page.fill('input[type=search]', 'test');
    await expect(page).toEqualText('.results-panel h2', 'Test Page');
  });

  test('search ignore title', async () => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
          # Hello World

          This is the homepage.
        `,
        sidebar: `
          - [Home page](/)
          - [GitHub Pages](github)
        `,
      },
      routes: {
        '/github.md': `
            # GitHub Pages

            This is the GitHub Pages.

            ## GitHub Pages ignore1 <!-- {docsify-ignore} -->

            There're three places to populate your docs for your Github repository1.

            ## GitHub Pages ignore2 {docsify-ignore}

            There're three places to populate your docs for your Github repository2.
          `,
      },
      scriptURLs: ['/lib/plugins/search.min.js'],
    };
    await docsifyInit(docsifyInitConfig);
    await page.fill('input[type=search]', 'repository1');
    await expect(page).toEqualText('.results-panel h2', 'GitHub Pages ignore1');
    await page.click('.clear-button');
    await page.fill('input[type=search]', 'repository2');
    await expect(page).toEqualText('.results-panel h2', 'GitHub Pages ignore2');
  });

  test('search only one homepage', async () => {
    const docsifyInitConfig = {
      markdown: {
        sidebar: `
          - [README](README)
          - [Test Page](test)
        `,
      },
      routes: {
        '/README.md': `
          # Hello World

          This is the homepage.
        `,
        '/test.md': `
          # Test Page

          This is a custom route.
        `,
      },
      scriptURLs: ['/lib/plugins/search.js'],
    };

    await docsifyInit(docsifyInitConfig);
    await page.fill('input[type=search]', 'hello');
    await expect(page).toHaveSelector('.matching-post');
    expect(await page.$$eval('.matching-post', elms => elms.length)).toBe(1);
    await expect(page).toEqualText('.results-panel h2', 'Hello World');
    await page.click('.clear-button');
    await page.fill('input[type=search]', 'test');
    await expect(page).toEqualText('.results-panel h2', 'Test Page');
  });

  test('search ignore diacritical marks', async () => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
          # Qué es

          docsify genera su sitio web de documentación sobre la marcha. A diferencia de GitBook, no genera archivos estáticos html. En cambio, carga y analiza de forma inteligente sus archivos de Markdown y los muestra como sitio web. Todo lo que necesita hacer es crear un index.html para comenzar y desplegarlo en GitHub Pages.
        `,
      },
      scriptURLs: ['/lib/plugins/search.min.js'],
    };
    await docsifyInit(docsifyInitConfig);
    await page.fill('input[type=search]', 'documentacion');
    await expect(page).toEqualText('.results-panel h2', 'Que es');
    await page.click('.clear-button');
    await page.fill('input[type=search]', 'estáticos');
    await expect(page).toEqualText('.results-panel h2', 'Que es');
  });

  test('search when there is no title', async () => {
    const docsifyInitConfig = {
      markdown: {
        homepage: `
          This is some description. We assume autoHeader added the # Title. A long paragraph.
        `,
        sidebar: `
          - [Changelog](changelog)
        `,
      },
      routes: {
        '/changelog.md': `
          feat: Support search when there is no title

          ## Changelog Title

          hello, this is a changelog
        `,
      },
      scriptURLs: ['/lib/plugins/search.min.js'],
    };
    await docsifyInit(docsifyInitConfig);
    await page.fill('input[type=search]', 'paragraph');
    await expect(page).toEqualText('.results-panel h2', 'Home Page');
    await page.click('.clear-button');
    await page.fill('input[type=search]', 'Support');
    await expect(page).toEqualText('.results-panel h2', 'changelog');
    await page.click('.clear-button');
    await page.fill('input[type=search]', 'hello');
    await expect(page).toEqualText('.results-panel h2', 'Changelog Title');
  });
});
