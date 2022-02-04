const docsifyInit = require('../helpers/docsify-init');

// Suite
// -----------------------------------------------------------------------------
describe('Emoji', function () {
  // Tests
  // ---------------------------------------------------------------------------
  const emojiMarkdown = `
    :smile:

    :smile::smile:

    :smile: :smile:

    :smile::smile::smile:

    :smile: :smile: :smile:

    text:smile:

    :smile:text

    text:smile:text
  `;

  test('Renders native emoji characters (nativeEmoji:true)', async () => {
    await docsifyInit({
      config: {
        nativeEmoji: true,
      },
      markdown: {
        homepage: emojiMarkdown,
      },
      // _logHTML: true,
    });

    const mainElm = document.querySelector('#main');

    expect(mainElm.innerHTML).toMatchSnapshot();
  });

  test('Renders GitHub emoji images (nativeEmoji:false)', async () => {
    await docsifyInit({
      config: {
        nativeEmoji: false,
      },
      markdown: {
        homepage: emojiMarkdown,
      },
      // _logHTML: true,
    });

    const mainElm = document.querySelector('#main');

    expect(mainElm.innerHTML).toMatchSnapshot();
  });

  test('Ignores all emoji shorthand codes (noEmoji:true)', async () => {
    await docsifyInit({
      config: {
        noEmoji: true,
      },
      markdown: {
        homepage: emojiMarkdown,
      },
      // _logHTML: true,
    });

    const mainElm = document.querySelector('#main');

    expect(mainElm.innerHTML).toMatchSnapshot();
  });

  test('Ignores unmatched emoji shorthand codes', async () => {
    await docsifyInit({
      markdown: {
        homepage: `
          hh:mm

          hh:mm:ss

          Namespace::SubNameSpace

          Namespace::SubNameSpace::Class

          2014-12-29T16:11:20+00:00
        `,
      },
      // _logHTML: true,
    });

    const mainElm = document.querySelector('#main');

    expect(mainElm.innerHTML).toMatchSnapshot();
  });

  test('Ignores emoji shorthand codes in comments', async () => {
    await docsifyInit({
      markdown: {
        homepage: 'Text <!-- :foo: :100: -->',
      },
      // _logHTML: true,
    });

    const mainElm = document.querySelector('#main');

    expect(mainElm.innerHTML).toMatchSnapshot();
  });

  test('Ignores emoji shorthand codes in code, pre, script, and template tags', async () => {
    await docsifyInit({
      markdown: {
        homepage: `
          <pre>:100:</pre>

          <code>:100:</code>

          <script>
            var test = ':100:';
          </script>

          <template>
            <p>:100</p>
          </template>
        `,
      },
      // _logHTML: true,
    });

    const mainElm = document.querySelector('#main');

    expect(mainElm.innerHTML).toMatchSnapshot();
  });
});
