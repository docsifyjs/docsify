import Prism from 'prismjs';
/**
 *
 * The dependencies map which syncs from
 * https://github.com/PrismJS/prism/blob/master/plugins/autoloader/prism-autoloader.js
 *
 */
const lang_dependencies = {
  javascript: 'clike',
  actionscript: 'javascript',
  apex: ['clike', 'sql'],
  arduino: 'cpp',
  aspnet: ['markup', 'csharp'],
  birb: 'clike',
  bison: 'c',
  c: 'clike',
  csharp: 'clike',
  cpp: 'c',
  cfscript: 'clike',
  chaiscript: ['clike', 'cpp'],
  cilkc: 'c',
  cilkcpp: 'cpp',
  coffeescript: 'javascript',
  crystal: 'ruby',
  'css-extras': 'css',
  d: 'clike',
  dart: 'clike',
  django: 'markup-templating',
  ejs: ['javascript', 'markup-templating'],
  etlua: ['lua', 'markup-templating'],
  erb: ['ruby', 'markup-templating'],
  fsharp: 'clike',
  'firestore-security-rules': 'clike',
  flow: 'javascript',
  ftl: 'markup-templating',
  gml: 'clike',
  glsl: 'c',
  go: 'clike',
  gradle: 'clike',
  groovy: 'clike',
  haml: 'ruby',
  handlebars: 'markup-templating',
  haxe: 'clike',
  hlsl: 'c',
  idris: 'haskell',
  java: 'clike',
  javadoc: ['markup', 'java', 'javadoclike'],
  jolie: 'clike',
  jsdoc: ['javascript', 'javadoclike', 'typescript'],
  'js-extras': 'javascript',
  json5: 'json',
  jsonp: 'json',
  'js-templates': 'javascript',
  kotlin: 'clike',
  latte: ['clike', 'markup-templating', 'php'],
  less: 'css',
  lilypond: 'scheme',
  liquid: 'markup-templating',
  markdown: 'markup',
  'markup-templating': 'markup',
  mongodb: 'javascript',
  n4js: 'javascript',
  objectivec: 'c',
  opencl: 'c',
  parser: 'markup',
  php: 'markup-templating',
  phpdoc: ['php', 'javadoclike'],
  'php-extras': 'php',
  plsql: 'sql',
  processing: 'clike',
  protobuf: 'clike',
  pug: ['markup', 'javascript'],
  purebasic: 'clike',
  purescript: 'haskell',
  qsharp: 'clike',
  qml: 'javascript',
  qore: 'clike',
  racket: 'scheme',
  cshtml: ['markup', 'csharp'],
  jsx: ['markup', 'javascript'],
  tsx: ['jsx', 'typescript'],
  reason: 'clike',
  ruby: 'clike',
  sass: 'css',
  scss: 'css',
  scala: 'java',
  'shell-session': 'bash',
  smarty: 'markup-templating',
  solidity: 'clike',
  soy: 'markup-templating',
  sparql: 'turtle',
  sqf: 'clike',
  squirrel: 'clike',
  stata: ['mata', 'java', 'python'],
  't4-cs': ['t4-templating', 'csharp'],
  't4-vb': ['t4-templating', 'vbnet'],
  tap: 'yaml',
  tt2: ['clike', 'markup-templating'],
  textile: 'markup',
  twig: 'markup-templating',
  typescript: 'javascript',
  v: 'clike',
  vala: 'clike',
  vbnet: 'basic',
  velocity: 'markup',
  wiki: 'markup',
  xeora: 'markup',
  'xml-doc': 'markup',
  xquery: 'markup',
};

const lang_aliases = {
  html: 'markup',
  xml: 'markup',
  svg: 'markup',
  mathml: 'markup',
  ssml: 'markup',
  atom: 'markup',
  rss: 'markup',
  js: 'javascript',
  g4: 'antlr4',
  ino: 'arduino',
  'arm-asm': 'armasm',
  art: 'arturo',
  adoc: 'asciidoc',
  avs: 'avisynth',
  avdl: 'avro-idl',
  gawk: 'awk',
  sh: 'bash',
  shell: 'bash',
  shortcode: 'bbcode',
  rbnf: 'bnf',
  oscript: 'bsl',
  cs: 'csharp',
  dotnet: 'csharp',
  cfc: 'cfscript',
  'cilk-c': 'cilkc',
  'cilk-cpp': 'cilkcpp',
  cilk: 'cilkcpp',
  coffee: 'coffeescript',
  conc: 'concurnas',
  jinja2: 'django',
  'dns-zone': 'dns-zone-file',
  dockerfile: 'docker',
  gv: 'dot',
  eta: 'ejs',
  xlsx: 'excel-formula',
  xls: 'excel-formula',
  gamemakerlanguage: 'gml',
  po: 'gettext',
  gni: 'gn',
  ld: 'linker-script',
  'go-mod': 'go-module',
  hbs: 'handlebars',
  mustache: 'handlebars',
  hs: 'haskell',
  idr: 'idris',
  gitignore: 'ignore',
  hgignore: 'ignore',
  npmignore: 'ignore',
  webmanifest: 'json',
  kt: 'kotlin',
  kts: 'kotlin',
  kum: 'kumir',
  tex: 'latex',
  context: 'latex',
  ly: 'lilypond',
  emacs: 'lisp',
  elisp: 'lisp',
  'emacs-lisp': 'lisp',
  md: 'markdown',
  moon: 'moonscript',
  n4jsd: 'n4js',
  nani: 'naniscript',
  objc: 'objectivec',
  qasm: 'openqasm',
  objectpascal: 'pascal',
  px: 'pcaxis',
  pcode: 'peoplecode',
  plantuml: 'plant-uml',
  pq: 'powerquery',
  mscript: 'powerquery',
  pbfasm: 'purebasic',
  purs: 'purescript',
  py: 'python',
  qs: 'qsharp',
  rkt: 'racket',
  razor: 'cshtml',
  rpy: 'renpy',
  res: 'rescript',
  robot: 'robotframework',
  rb: 'ruby',
  'sh-session': 'shell-session',
  shellsession: 'shell-session',
  smlnj: 'sml',
  sol: 'solidity',
  sln: 'solution-file',
  rq: 'sparql',
  sclang: 'supercollider',
  t4: 't4-cs',
  trickle: 'tremor',
  troy: 'tremor',
  trig: 'turtle',
  ts: 'typescript',
  tsconfig: 'typoscript',
  uscript: 'unrealscript',
  uc: 'unrealscript',
  url: 'uri',
  vb: 'visual-basic',
  vba: 'visual-basic',
  webidl: 'web-idl',
  mathematica: 'wolfram',
  nb: 'wolfram',
  wl: 'wolfram',
  xeoracube: 'xeora',
  yml: 'yaml',
};

// The `depTreeCache` is used to cache the dependency tree for each language,
// preventing duplicate calculations and avoiding repeated warning messages.
const depTreeCache = {};

/**
 * PrismJs language dependencies required a specific order to load.
 * Try to check and print a warning message if some dependencies missing or in wrong order.
 * @param {*} lang current lang to check dependencies
 */
export default function checkLangDependenciesAllLoaded(lang) {
  if (!lang) {
    return;
  }

  lang = lang_aliases[lang] || lang;

  const validLang = lang_dependencies[lang];
  if (!validLang) {
    return;
  }

  if (!depTreeCache[lang]) {
    /**
     * The dummy node constructs the dependency tree as the root
     * and maintains the final global loading status (dummy.loaded) for current lang.
     */
    const dummy = {
      cur: '',
      loaded: true,
      dependencies: [],
    };

    buildAndCheckDepTree(lang, dummy, dummy);

    const depTree = dummy.dependencies[0];
    depTreeCache[lang] = depTree;

    if (!dummy.loaded) {
      const prettyOutput = prettryPrint(depTree, 1);
      // eslint-disable-next-line no-console
      console.warn(
        `The language '${lang}' required dependencies for code block highlighting are not satisfied.`,
        `Priority dependencies from low to high, consider to place all the necessary dependencie by priority (higher first): \n`,
        prettyOutput,
      );
    }
  }
}

const buildAndCheckDepTree = (lang, parent, dummy) => {
  if (!lang) {
    return;
  }
  const cur = { cur: lang, loaded: true, dependencies: [] };
  let deps = lang_dependencies[lang] || [];

  if (!(lang in Prism.languages)) {
    dummy.loaded = false;
    cur.loaded = false;
  }

  if (typeof deps === 'string') {
    deps = [deps];
  }

  deps.forEach(dep => {
    buildAndCheckDepTree(dep, cur, dummy);
  });

  parent.dependencies.push(cur);
};

const prettryPrint = (depTree, level) => {
  let cur = `${'  '.repeat(level * 3)} ${depTree.cur} ${depTree.loaded ? '(+)' : '(-)'}`;
  if (depTree.dependencies.length) {
    depTree.dependencies.forEach(dep => {
      cur += prettryPrint(dep, level + 1, cur);
    });
  }
  return '\n' + cur;
};
