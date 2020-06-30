describe('Mobile', () => {
  context('Sidebar links', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
      cy.visit('http://localhost:3000');
    });

    const quickStartIds = [
      'initialize',
      'writing-content',
      'preview-your-site',
      'manual-initialization',
      'loading-dialog',
    ];
    quickStartIds.forEach(id => {
      it('go to #quickstart?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get(
          '.sidebar-nav > :nth-child(1) > :nth-child(1) > ul > :nth-child(1) > a'
        ).click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });

    const configurationIds = [
      'el',
      'repo',
      'maxlevel',
      'loadnavbar',
      'loadsidebar',
      'hidesidebar',
      'submaxlevel',
      'auto2top',
      'homepage',
      'basepath',
      'relativepath',
      'coverpage',
      'logo',
      'name',
      'namelink',
      'markdown',
      'themecolor',
      'alias',
      'autoheader',
      'executescript',
      'noemoji',
      'mergenavbar',
      'formatupdated',
      'externallinktarget',
      'cornerexternallinktarget',
      'externallinkrel',
      'routermode',
      'nocompilelinks',
      'onlycover',
      'requestheaders',
      'ext',
      'fallbacklanguages',
      'notfoundpage',
    ];
    configurationIds.forEach(id => {
      it('go to #configuration?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get('[href="#/configuration"]').click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });

    const morePagesIds = [
      'sidebar',
      'nested-sidebars',
      'set-page-titles-from-sidebar-selection',
      'table-of-contents',
      'ignoring-subheaders',
    ];
    morePagesIds.forEach(id => {
      it('go to #more-pages?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get('[href="#/more-pages"]').click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });

    const customNavbarIds = [
      'html',
      'markdown',
      'nesting',
      'combining-custom-navbars-with-the-emoji-plugin',
    ];
    customNavbarIds.forEach(id => {
      it('go to #custom-navbar?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get('[href="#/custom-navbar"]').click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });

    const coverIds = [
      'basic-usage',
      'custom-background',
      'coverpage-as-homepage',
      'multiple-covers',
    ];
    coverIds.forEach(id => {
      it('go to #cover?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get('[href="#/cover"]').click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });

    const themesIds = ['other-themes'];
    themesIds.forEach(id => {
      it('go to #themes?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get('[href="#/themes"]').click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });

    const pluginsIds = [
      'full-text-search',
      'google-analytics',
      'emoji',
      'external-script',
      'zoom-image',
      'edit-on-github',
      'demo-code-with-instant-preview-and-jsfiddle-integration',
      'copy-to-clipboard',
      'disqus',
      'gitalk',
      'pagination',
      'codefund',
      'tabs',
      'more-plugins',
    ];
    pluginsIds.forEach(id => {
      it('go to #plugins?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get('[href="#/plugins"]').click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });

    const writeAPluginIds = ['full-configuration', 'example', 'tips'];
    writeAPluginIds.forEach(id => {
      it('go to #write-a-plugin?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get('[href="#/write-a-plugin"]').click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });

    const markdownIds = ['supports-mermaid'];
    markdownIds.forEach(id => {
      it('go to #markdown?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get('[href="#/markdown"]').click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });

    it('go to #Language-highlight', () => {
      cy.get('.sidebar-toggle').click();
      cy.get('a[href="#/language-highlight"]').click();
      cy.matchImageSnapshot();
    });

    const helpersIds = [
      'important-content',
      'general-tips',
      'ignore-to-compile-link',
      'set-target-attribute-for-link',
      'disable-link',
      'github-task-lists',
      'customise-id-for-headings',
      'markdown-in-html-tag',
    ];
    helpersIds.forEach(id => {
      it('go to #helpers?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get('[href="#/helpers"]').click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });

    const vueIds = ['basic-usage', 'combine-vuep-to-write-playground'];
    vueIds.forEach(id => {
      it('go to #vue?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get('[href="#/vue"]').click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });

    const cdnIds = [
      'latest-version',
      'specific-version',
      'compressed-file',
      'other-cdn',
    ];
    cdnIds.forEach(id => {
      it('go to #cdn?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get('[href="#/cdn"]').click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });

    const pwaIds = ['create-serviceworker', 'register', 'enjoy-it'];
    pwaIds.forEach(id => {
      it('go to #pwa?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get('[href="#/pwa"]').click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });

    const ssrIds = [
      'why-ssr',
      'quick-start',
      'custom-template',
      'configuration',
      'deploy-for-your-vps',
    ];

    ssrIds.forEach(id => {
      it('go to #ssr?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get('[href="#/ssr"]').click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });

    const embedFilesIds = [
      'embedded-file-type',
      'embedded-code-fragments',
      'tag-attribute',
      'the-code-block-highlight',
    ];
    embedFilesIds.forEach(id => {
      it('go to #embed-files?id=' + id, () => {
        cy.get('.sidebar-toggle').click();
        cy.get('[href="#/embed-files"]').click();

        cy.get(`#${id}`).click();
        cy.matchImageSnapshot();
      });
    });
  });

  context('Tests for window.$docsify configuration', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });

    it('Sidebar toggle should be invisble with onlyCover flag', () => {
      cy.visit('localhost:3000');

      // Triggers the render
      cy.window()
        .then(window => window.$docsify.onlyCover = true)
        .then(() => {
          cy.get('.sidebar-toggle').click();
          cy.get(
            '.sidebar-nav > :nth-child(1) > :nth-child(1) > ul > :nth-child(1) > a'
          ).click();
          cy.go(-1);
          cy.get('.sidebar-toggle').should('not.be.visible');
        });
    });
  });
});
