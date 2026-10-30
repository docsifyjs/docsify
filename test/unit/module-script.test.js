import { resolveModuleSpecifiers } from '../../src/core/render/module-script.js';

const base = 'https://example.test/content/guide/page.md';

describe('resolveModuleSpecifiers', () => {
  test.each([
    [
      "import value from './dep.js';",
      'import value from "https://example.test/content/guide/dep.js";',
    ],
    [
      "import /* comment */ './dep.js';",
      'import /* comment */ "https://example.test/content/guide/dep.js";',
    ],
    [
      "export { value } from '../shared.js';",
      'export { value } from "https://example.test/content/shared.js";',
    ],
    [
      "export * from './dep.js';",
      'export * from "https://example.test/content/guide/dep.js";',
    ],
    [
      "import(/* comment */ './dep.js');",
      'import(/* comment */ "https://example.test/content/guide/dep.js");',
    ],
    [
      "import('./data.json', { with: { type: 'json' } });",
      'import("https://example.test/content/guide/data.json", { with: { type: \'json\' } });',
    ],
    [
      String.raw`import './\u0061.js?version=1#test';`,
      'import "https://example.test/content/guide/a.js?version=1#test";',
    ],
    [
      String.raw`import './it\'s.js';`,
      'import "https://example.test/content/guide/it\'s.js";',
    ],
    [
      'import "./quote\\".js";',
      'import "https://example.test/content/guide/quote%22.js";',
    ],
  ])('rewrites %s', (code, expected) => {
    expect(resolveModuleSpecifiers(code, base)).toBe(expected);
  });

  test('rewrites multiple imports without changing intervening source', () => {
    const code =
      "import './a.js';\n/* import './ignored.js' */\nexport * from '../b.js';";
    expect(resolveModuleSpecifiers(code, base)).toBe(
      'import "https://example.test/content/guide/a.js";\n/* import \'./ignored.js\' */\nexport * from "https://example.test/content/b.js";',
    );
  });

  test.each([
    '',
    'const text = "import \'./example.js\'";',
    "const text = `export * from './example.js'`;",
    "// import './example.js'\n/* export * from '../other.js' */",
    String.raw`const pattern = /import '.\/example.js'/;`,
    'const object = { import(value) { return value; } }; object.import("./a.js");',
    "import '/root.js'; import 'https://cdn.example/dep.js'; import '//cdn.example/dep.js';",
    "import 'vue'; import 'data:text/javascript,export default 1';",
    "import.meta.url; import(path); import('./' + name);",
    // eslint-disable-next-line no-template-curly-in-string -- Source code under test.
    'import(`./${name}.js`); import(`./dep.js`);',
  ])(
    'leaves non-relative imports and non-import syntax unchanged: %s',
    code => {
      expect(resolveModuleSpecifiers(code, base)).toBe(code);
    },
  );

  test('rejects an unterminated import', () => {
    expect(() => resolveModuleSpecifiers('import {', base)).toThrow();
  });
});
