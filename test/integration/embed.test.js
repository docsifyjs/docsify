import { waitForFunction, waitForText } from '../helpers/wait-for.js';
import docsifyInit from '../helpers/docsify-init.js';

describe('Embed', function () {
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

          [filename](_media/example1.html ':include :type=code :fragment=demo :omitFragmentLine')
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

  test('embed multiple includes in same paragraph', async () => {
    await docsifyInit({
      markdown: {
        homepage: `
          # Embed Test

          [first](_media/first.md ':include') middle paragraph text [second](_media/second.md ':include')
        `,
      },
      routes: {
        '_media/first.md': 'first include content',
        '_media/second.md': 'second include content',
      },
    });

    expect(await waitForText('#main', 'first include content')).toBeTruthy();
    expect(await waitForText('#main', 'second include content')).toBeTruthy();

    const mainText = document.querySelector('#main').textContent;
    const firstIndex = mainText.indexOf('first include content');
    const middleIndex = mainText.indexOf('middle paragraph text');
    const secondIndex = mainText.indexOf('second include content');

    expect(firstIndex).toBeGreaterThan(-1);
    expect(middleIndex).toBeGreaterThan(-1);
    expect(secondIndex).toBeGreaterThan(-1);
    expect(firstIndex).toBeLessThan(middleIndex);
    expect(middleIndex).toBeLessThan(secondIndex);
    expect(mainText).not.toContain("_media/first.md ':include'");
    expect(mainText).not.toContain("_media/second.md ':include'");
  });

  test('embed multiple include code fragments in same paragraph', async () => {
    await docsifyInit({
      markdown: {
        homepage: `
          # Embed Test

          [first](_media/first.js ':include :type=code :fragment=demo') [second](_media/second.js ':include :type=code :fragment=demo')
        `,
      },
      routes: {
        '_media/first.js': `
          const first = 1;
          /// [demo]
          console.log('first demo line');
          /// [demo]
          console.log('first outside');
        `,
        '_media/second.js': `
          const second = 1;
          /// [demo]
          console.log('second demo line');
          /// [demo]
          console.log('second outside');
        `,
      },
    });

    expect(
      await waitForText('#main', "console.log('first demo line');"),
    ).toBeTruthy();
    expect(
      await waitForText('#main', "console.log('second demo line');"),
    ).toBeTruthy();

    const mainText = document.querySelector('#main').textContent;
    const firstIndex = mainText.indexOf("console.log('first demo line');");
    const secondIndex = mainText.indexOf("console.log('second demo line');");

    expect(firstIndex).toBeGreaterThan(-1);
    expect(secondIndex).toBeGreaterThan(-1);
    expect(firstIndex).toBeLessThan(secondIndex);
    expect(mainText).not.toContain('first outside');
    expect(mainText).not.toContain('second outside');
  });

  test('embed multiple includes in same table cell', async () => {
    await docsifyInit({
      markdown: {
        homepage: `
          # Embed Test

Command | Description | Parameters
---: | --- | ---
\`do-something\` | Does something. | [first include](_media/first.md ':include') middle table text [second include](_media/second.md ':include')
        `,
      },
      routes: {
        '_media/first.md': 'first table include content',
        '_media/second.md': 'second table include content',
      },
    });

    expect(
      await waitForText('#main', 'first table include content'),
    ).toBeTruthy();
    expect(
      await waitForText('#main', 'second table include content'),
    ).toBeTruthy();

    const mainText = document.querySelector('#main').textContent;
    const firstIndex = mainText.indexOf('first table include content');
    const middleIndex = mainText.indexOf('middle table text');
    const secondIndex = mainText.indexOf('second table include content');

    expect(firstIndex).toBeGreaterThan(-1);
    expect(middleIndex).toBeGreaterThan(-1);
    expect(secondIndex).toBeGreaterThan(-1);
    expect(firstIndex).toBeLessThan(middleIndex);
    expect(middleIndex).toBeLessThan(secondIndex);
    expect(mainText).not.toContain("_media/first.md ':include'");
    expect(mainText).not.toContain("_media/second.md ':include'");
  });

  test('embed file table cell', async () => {
    await docsifyInit({
      markdown: {
        homepage: `
          # Embed Test

Command | Description | Parameters
---: | --- | ---
**Something** | |
\`do-something\` | Does something. | [include content](_media/content.md ':include')
**Something else** | |
\`etc.\` | Etc. | |
        `,
      },
      routes: {
        '_media/content.md': `this is include content`,
      },
    });

    const mainText = document.querySelector('#main').textContent;
    expect(mainText).toContain('Something');
    expect(mainText).toContain('this is include content');
  });

  test.each([
    { type: 'iframe', selector: 'iframe' },
    { type: 'video', selector: 'video' },
    { type: 'audio', selector: 'audio' },
  ])('embed %s escapes URL for XSS safety', async ({ type, selector }) => {
    const dangerousUrl = 'https://example.com/?q="><svg/onload=alert(1)>';

    await docsifyInit({
      markdown: {
        homepage: `[media](${dangerousUrl} ':include :type=${type}')`,
      },
    });

    expect(
      await waitForFunction(() => !!document.querySelector(selector)),
    ).toBe(true);

    const mediaElm = document.querySelector(selector);
    expect(mediaElm.getAttribute('src')).toBe(dangerousUrl);
    expect(mediaElm.hasAttribute('onload')).toBe(false);
  });
});
