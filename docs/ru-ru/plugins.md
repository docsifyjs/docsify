# Плагины

## Полно-текстовый поиск

По умолчанию гиперссылка на текущую страницу распознается и содержимое сохраняется в `localStorage`. Вы также можете указать путь к файлам.

```html
<script>
  window.$docsify = {
    search: 'auto', // default

    search : [
      '/',            // => /README.md
      '/guide',       // => /guide.md
      '/get-started', // => /get-started.md
      '/zh-cn/',      // => /zh-cn/README.md
    ],

    // полные параметры конфигурации
    search: {
      maxAge: 86400000, // Expiration time, the default one day
      paths: [], // or 'auto'
      placeholder: 'Type to search',

      // Локализация
      placeholder: {
        '/zh-cn/': '搜索',
        '/': 'Type to search'
      },

      noData: 'No Results!',

      // Локализация
      noData: {
        '/zh-cn/': '找不到结果',
        '/': 'No Results'
      },

      // Глубина по заголовкам, 1 - 6
      depth: 2
    }
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify/lib/plugins/search.min.js"></script>
```

## Google Analytics

Установите плагин и настройте track id.

```html
<script>
  window.$docsify = {
    ga: 'UA-XXXXX-Y'
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify/lib/plugins/ga.min.js"></script>
```

Настройте `data-ga`.

```html
<script src="//unpkg.com/docsify/lib/docsify.min.js" data-ga="UA-XXXXX-Y"></script>
<script src="//unpkg.com/docsify/lib/plugins/ga.min.js"></script>
```

## emoji

По умолчанию используется поддержка парсинга emoji. Например, `:100:` будет заменён на :100:. Но он не является точным, потому что нет соответствующей non-emoji стоки. Если вам нужно правильно разобрать строку emoji, вам нужно установить этот плагин.

```html
<script src="//unpkg.com/docsify/lib/plugins/emoji.min.js"></script>
```

## Внешний скрипт

Если скрипт на странице является внешним (импортирует файл js через атрибут `src`), вам понадобится этот плагин, чтобы он работал.

```html
<script src="//unpkg.com/docsify/lib/plugins/external-script.min.js"></script>
```

## Увеличить изображение

Среднее увеличение изображение. Основано на [medium-zoom](https://github.com/francoischalifour/medium-zoom).

```html
<script src="//unpkg.com/docsify/lib/plugins/zoom-image.min.js"></script>
```

Исключить специальное изображение

```markdown
![](image.png ':no-zoom')
```

## Редактировать на github

Добавляет кнопку `Редактировать на github` на каждой странице. Предоставлено [@njleonzhang](https://github.com/njleonzhang), проверить [документ](https://github.com/njleonzhang/docsify-edit-on-github)

## Демо code с мгновенным просмотром и интеграцией jsfiddle

С помощью этого плагина код образца можно мгновенно отобразить на странице, чтобы читатели могли сразу его просмотреть.
Когда читатели расширяют демонстрационный бокс, там отображаются исходный код и описание. если они нажмут кнопку  `Попробовать в Jsfiddle`,
`jsfiddle.net` будет открыт с кодом этого образца, который позволит читателям пересмотреть код и попробовать самостоятельно.

[Vue](https://njleonzhang.github.io/docsify-demo-box-vue/) и [React](https://njleonzhang.github.io/docsify-demo-box-react/) поддерживаются.

## Копировать в буфер обмена

Добавить простую кнопку `Click to copy` для всех отформатированных блоков кода, чтобы легко позволить пользователям копировать пример кода из списка документов. Предоставлено [@jperasmus](https://github.com/jperasmus)

```html
<script src="//unpkg.com/docsify-copy-code"></script>
```

Смотрите [здесь](https://github.com/jperasmus/docsify-copy-code/blob/master/README.md) для больших подробностей.

## Disqus

Disqus комментарии. https://disqus.com/

```html
<script>
  window.$docsify = {
    disqus: 'shortname'
  }
</script>
<script src="//unpkg.com/docsify/lib/plugins/disqus.min.js"></script>
```

## Gitalk

[Gitalk](https://github.com/gitalk/gitalk) представляет собой современный компонент комментариев, основанный на Github Issue и Preact.

```html
<link rel="stylesheet" href="//unpkg.com/gitalk/dist/gitalk.css">

<script src="//unpkg.com/docsify/lib/plugins/gitalk.min.js"></script>
<script src="//unpkg.com/gitalk/dist/gitalk.min.js"></script>
<script>
  const gitalk = new Gitalk({
    clientID: 'Github Application Client ID',
    clientSecret: 'Github Application Client Secret',
    repo: 'Github repo',
    owner: 'Github repo owner',
    admin: ['Github repo collaborators, only these guys can initialize github issues'],
    // facebook-like distraction free mode
    distractionFreeMode: false
  })
</script>
```

## Навигация

Пагинатор для docsify. От [@imyelo](https://github.com/imyelo)

```html
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify-pagination/dist/docsify-pagination.min.js"></script>
```

## codefund

[плагин](https://github.com/njleonzhang/docsify-plugin-codefund) легко объединяет с [codefund](https://codesponsor.io/)

> codefund ранее известен как "codeponsor"

```
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>

window.$docsify = {
  plugins: [
    DocsifyCodefund.create('xxxx-xxx-xxx') // change to your codefund id
  ]
}
```

