const docsifyInit = require('../helpers/docsify-init');

// Suite
// -----------------------------------------------------------------------------
describe('Emoji', function () {
  // Tests
  // ---------------------------------------------------------------------------
  const sharedConfig = {
    markdown: {
      homepage: `
        hh:mm

        hh:mm:

        hh:mm:ss

        :mm:s

        Namespace::SubNameSpace

        Namespace::SubNameSpace::Class

        2014-12-29T16:11:20+00:00

        2020-12-03T15:05:57+00:00 (extended)

        2020-12-03T15:05:57Z (extended)

        :01:

        :smile:

        1:smile:

        :smile:1

        1:smile:1

        :smile::smile::smile:

        :smile: :smile: :smile:
      `,
    },
  };

  test('Native emoji', async () => {
    await docsifyInit({
      config: {
        nativeEmoji: true,
      },
      ...sharedConfig,
      // _logHTML: true,
    });

    const mainElm = document.querySelector('#main');

    expect(mainElm.innerHTML).toMatchSnapshot();
  });

  test('Fallback emoji (images)', async () => {
    await docsifyInit({
      config: {
        nativeEmoji: false,
      },
      ...sharedConfig,
      // _logHTML: true,
    });

    const mainElm = document.querySelector('#main');

    expect(mainElm.innerHTML).toMatchSnapshot();
  });

  test('No emoji', async () => {
    await docsifyInit({
      config: {
        noEmoji: true,
      },
      ...sharedConfig,
      // _logHTML: true,
    });

    const mainElm = document.querySelector('#main');

    expect(mainElm.innerHTML).toMatchSnapshot();
  });
});
