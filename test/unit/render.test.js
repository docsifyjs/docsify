const { expect } = require('chai');
const { init, expectSameDom } = require('../_helper');

describe('render', function() {
  it('important content (tips)', async function() {
    const { docsify } = await init();
    const output = docsify.compiler.compile('!> **Time** is money, my friend!');
    expect(output).equal(
      '<p class="tip"><strong>Time</strong> is money, my friend!</p>'
    );
  });

  describe('lists', function() {
    it('as unordered task list', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile(`
- [x] Task 1
- [ ] Task 2
- [ ] Task 3`);
      expect(
        output,
        `<ul class="task-list">
				<li class="task-list-item"><label><input checked="" disabled="" type="checkbox"> Task 1</label></li>
				<li class="task-list-item"><label><input disabled="" type="checkbox"> Task 2</label></li>
				<li class="task-list-item"><label><input disabled="" type="checkbox"> Task 3</label></li>
			</ul>`
      );
    });

    it('as ordered task list', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile(`
1. [ ] Task 1
2. [x] Task 2`);
      expectSameDom(
        output,
        `<ol class="task-list">
				<li class="task-list-item"><label><input disabled="" type="checkbox"> Task 1</label></li>
				<li class="task-list-item"><label><input checked="" disabled="" type="checkbox"> Task 2</label></li>
			</ol>`
      );
    });

    it('normal unordered', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile(`
- [linktext](link)
- just text`);
      expectSameDom(
        output,
        `<ul >
				<li><a href="#/link" >linktext</a></li>
				<li>just text</li>
			</ul>`
      );
    });

    it('unordered with custom start', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile(`
1. first
2. second

text

3. third`);
      expectSameDom(
        output,
        `<ol >
				<li>first</li>
				<li>second</li>
			</ol>
			<p>text</p>
			<ol start="3">
			  <li>third</li>
			</ol>`
      );
    });

    it('nested', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile(`
- 1
- 2
  - 2 a
  - 2 b
- 3`);
      expectSameDom(
        output,
        `<ul >
				<li>1</li>
				<li>2<ul >
						<li>2 a</li>
						<li>2 b</li>
					</ul>
				</li>
				<li>3</li>
			</ul>`
      );
    });
  });

  describe('image', function() {
    it('regular', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile('![alt text](http://imageUrl)');

      expectSameDom(
        output,
        '<p><img src="http://imageUrl" data-origin="http://imageUrl" alt="alt text"  /></p>'
      );
    });

    it('class', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile(
        "![alt text](http://imageUrl ':class=someCssClass')"
      );

      expectSameDom(
        output,
        '<p><img src="http://imageUrl" data-origin="http://imageUrl" alt="alt text" class="someCssClass" /></p>'
      );
    });

    it('id', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile(
        "![alt text](http://imageUrl ':id=someCssID')"
      );

      expectSameDom(
        output,
        '<p><img src="http://imageUrl" data-origin="http://imageUrl" alt="alt text" id="someCssID" /></p>'
      );
    });

    it('no-zoom', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile(
        "![alt text](http://imageUrl ':no-zoom')"
      );

      expectSameDom(
        output,
        '<p><img src="http://imageUrl" data-origin="http://imageUrl" alt="alt text" data-no-zoom /></p>'
      );
    });

    describe('size', function() {
      it('width and height', async function() {
        const { docsify } = await init();
        const output = docsify.compiler.compile(
          "![alt text](http://imageUrl ':size=WIDTHxHEIGHT')"
        );

        expectSameDom(
          output,
          '<p><img src="http://imageUrl" data-origin="http://imageUrl" alt="alt text" width="WIDTH" height="HEIGHT" /></p>'
        );
      });

      it('width', async function() {
        const { docsify } = await init();
        const output = docsify.compiler.compile(
          "![alt text](http://imageUrl ':size=50')"
        );

        expectSameDom(
          output,
          '<p><img src="http://imageUrl" data-origin="http://imageUrl" alt="alt text" width="50" height="50" /></p>'
        );
      });
    });
  });

  describe('heading', function() {
    it('h1', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile('# h1 tag');
      expectSameDom(
        output,
        `
      <h1 id="h1-tag">
        <a href="#/?id=h1-tag" data-id="h1-tag" class="anchor">
          <span>h1 tag</span>
        </a>
      </h1>`
      );
    });

    it('h2', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile('## h2 tag');
      expectSameDom(
        output,
        `
      <h2 id="h2-tag">
        <a href="#/?id=h2-tag" data-id="h2-tag" class="anchor">
          <span>h2 tag</span>
        </a>
      </h2>`
      );
    });

    it('h3', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile('### h3 tag');
      expectSameDom(
        output,
        `
      <h3 id="h3-tag">
        <a href="#/?id=h3-tag" data-id="h3-tag" class="anchor">
          <span>h3 tag</span>
        </a>
      </h3>`
      );
    });

    it('h4', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile('#### h4 tag');
      expectSameDom(
        output,
        `
      <h4 id="h4-tag">
        <a href="#/?id=h4-tag" data-id="h4-tag" class="anchor">
          <span>h4 tag</span>
        </a>
      </h4>`
      );
    });

    it('h5', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile('##### h5 tag');
      expectSameDom(
        output,
        `
      <h5 id="h5-tag">
        <a href="#/?id=h5-tag" data-id="h5-tag" class="anchor">
          <span>h5 tag</span>
        </a>
      </h5>`
      );
    });

    it('h6', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile('###### h6 tag');
      expectSameDom(
        output,
        `
      <h6 id="h6-tag">
        <a href="#/?id=h6-tag" data-id="h6-tag" class="anchor">
          <span>h6 tag</span>
        </a>
      </h6>`
      );
    });
  });

  describe('link', function() {
    it('regular', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile('[alt text](http://url)');

      expectSameDom(
        output,
        '<p><a href="http://url" target="_blank">alt text</a></p>'
      );
    });

    it('disabled', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile(
        "[alt text](http://url ':disabled')"
      );

      expectSameDom(
        output,
        '<p><a href="javascript:void(0)" target="_blank" disabled>alt text</a></p>'
      );
    });

    it('target', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile(
        "[alt text](http://url ':target=_self')"
      );

      expectSameDom(
        output,
        '<p><a href="http://url" target="_blank" target="_self">alt text</a></p>'
      );
    });

    it('class', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile(
        "[alt text](http://url ':class=someCssClass')"
      );

      expectSameDom(
        output,
        '<p><a href="http://url" target="_blank" class="someCssClass">alt text</a></p>'
      );
    });

    it('id', async function() {
      const { docsify } = await init();
      const output = docsify.compiler.compile(
        "[alt text](http://url ':id=someCssID')"
      );

      expectSameDom(
        output,
        '<p><a href="http://url" target="_blank" id="someCssID">alt text</a></p>'
      );
    });
  });
});
