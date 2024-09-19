import docsifyInit from '../helpers/docsify-init.js';

describe('Test sidebar render toc structure', function () {
  test('Render sidebar with loadSidebar=true and the _sidebar.md file', async () => {
    await docsifyInit({
      config: {
        loadSidebar: '_sidebar.md',
      },
      markdown: {
        homepage: '# Hello World',
        sidebar: `
        - Getting started
            - [Level1](QuickStart.md)
                - [Level2](QuickStart2.md)
        `,
      },
      waitForSelector: '.sidebar-nav > ul',
    });

    const sidebarElm = document.querySelector('.sidebar');
    /**
     * Expected render result
     * ==========================
     *<ul>
     *   <li>
     *       Getting started
     *       <ul>
     *           <li>
     *               <a href="#/QuickStart" title="Level1">Level1</a>
     *               <ul>
     *               <li><a href="#/QuickStart2" title="Level2">Level2</a></li>
     *               </ul>
     *           </li>
     *       </ul>
     *   </li>
     * </ul>
     */

    const GettingStarted = document.querySelector('.sidebar-nav > ul > li');
    const level1_Elm = document.querySelector(
      '.sidebar-nav > ul > li > ul> li',
    );
    const level1_A_tag = level1_Elm.querySelector('a');

    const level2_Elm = level1_Elm.querySelector(' ul > li ');

    const level2_A_tag = level2_Elm.querySelector('a');

    expect(sidebarElm).not.toBeNull();
    expect(GettingStarted).not.toBeNull();
    expect(level1_Elm).not.toBeNull();
    expect(level1_A_tag).not.toBeNull();
    expect(level2_Elm).not.toBeNull();
    expect(level2_A_tag).not.toBeNull();
    expect(level1_A_tag.textContent).toContain('Level1');
    expect(level2_A_tag.textContent).toContain('Level2');
  });

  test('Render sidebar with loadSidebar=false should be same to loadSidebar=true sidebar structure', async () => {
    await docsifyInit({
      config: {
        loadSidebar: false,
      },
      markdown: {
        homepage: `
        # Getting started 
           some thing
        ## Level1 
            foo
        ### Level2 
            bar
        `,
      },
      waitForSelector: '.sidebar-nav > ul',
    });

    const sidebarElm = document.querySelector('.sidebar');
    /**
     * Expected render result
     * ==========================
     *<ul>
     *   <li>
     *       Getting started
     *       <ul>
     *           <li>
     *               <a href="#/QuickStart" title="Level1">Level1</a>
     *               <ul>
     *               <li><a href="#/QuickStart2" title="Level2">Level2</a></li>
     *               </ul>
     *           </li>
     *       </ul>
     *   </li>
     * </ul>
     */

    const appSubSidebarTargetElm = document.querySelector('.sidebar-nav > ul');
    expect(appSubSidebarTargetElm).not.toBeNull();
    const ulClass = appSubSidebarTargetElm.className;
    // the sidebar-nav > ul should have the class app-sub-sidebar
    expect(ulClass).toContain('app-sub-sidebar');

    const GettingStarted = document.querySelector('.sidebar-nav > ul > li');
    const level1_Elm = document.querySelector(
      '.sidebar-nav > ul > li > ul> li',
    );
    const level1_A_tag = level1_Elm.querySelector('a');

    const level2_Elm = level1_Elm.querySelector(' ul > li ');

    const level2_A_tag = level2_Elm.querySelector('a');

    expect(sidebarElm).not.toBeNull();
    expect(GettingStarted).not.toBeNull();
    expect(level1_Elm).not.toBeNull();
    expect(level1_A_tag).not.toBeNull();
    expect(level2_Elm).not.toBeNull();
    expect(level2_A_tag).not.toBeNull();
    expect(level1_A_tag.textContent).toContain('Level1');
    expect(level2_A_tag.textContent).toContain('Level2');
  });
});
