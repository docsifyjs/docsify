this.$docsify = {
	alias: {
    '.*?/awesome': 'https://raw.githubusercontent.com/docsifyjs/awesome-docsify/master/README.md',
    '.*?/changelog': 'https://raw.githubusercontent.com/docsifyjs/docsify/master/CHANGELOG.md',
    '/.*/_navbar.md': '/_navbar.md',
    '/zh-cn/(.*)': 'https://raw.githubusercontent.com/docsifyjs/docs-zh/master/$1',
    '/de-de/(.*)': 'https://raw.githubusercontent.com/docsifyjs/docs-de/master/$1',
    '/ru/(.*)': 'https://raw.githubusercontent.com/docsifyjs/docs-ru/master/$1',
    '/es/(.*)': 'https://raw.githubusercontent.com/docsifyjs/docs-es/master/$1'
  },
  auto2top: true,
  coverpage: true,
  executeScript: true,
  loadSidebar: true,
  loadNavbar: true,
  mergeNavbar: true,
  maxLevel: 4,
  subMaxLevel: 2,
  ga: 'UA-106147152-1',
  name: 'docsify',
  search: {
    noData: {
      '/de-de/': 'Keine Ergebnisse!',
      '/zh-cn/': '没有结果!',
      '/': 'No results!'
    },
    paths: 'auto',
    placeholder: {
      '/de-de/': 'Suche',
      '/zh-cn/': '搜索',
      '/': 'Search'
    }
  },
  formatUpdated: '{MM}/{DD} {HH}:{mm}'
}

this.SSR_CONFIG = {
  template: 'index.ssr.html',
  config: this.$docsify
}