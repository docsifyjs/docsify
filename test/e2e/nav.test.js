const docsifyInit = require('../helpers/docsify-init');

describe(`Navbar tests`, function() {
  test('specify custom navbar element in config with nav_el', async () => {
    const docsifyInitConfig = {
      html: `
        <html>
            <body>
            <nav id="mynav"></nav>
            <div id="app"></nav>
            </body>
        </html>
      `,
      markdown: {
        navbar: `
          - [Foo](foo)
          - [Bar](bar)
        `,
        homepage: `
          # hello world
          foo
        `,
      },
      config: {
        nav_el: '#mynav',
      },
    };

    await docsifyInit(docsifyInitConfig);
    await expect(page).toHaveText(
      '#mynav',
      '<li><a href="#/foo" title="Foo">Foo</a></li>'
    );
    await expect(page).toHaveText(
      '#mynav',
      '<li><a href="#/bar" title="Bar">Bar</a></li>'
    );
  });
});
