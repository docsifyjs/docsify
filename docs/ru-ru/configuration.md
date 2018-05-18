# Конфигурация

Вы можете настроить `window.$docsify`.

```html
<script>
  window.$docsify = {
    repo: 'QingWei-Li/docsify',
    maxLevel: 3,
    coverpage: true
  }
</script>
```

## el

* Type: `String`
* Default: `#app`

Элемент DOM должен быть установлен при инициализации. Это может быть строка селектора CSS или фактический элемент HTMLElement.

```js
window.$docsify = {
  el: '#app'
};
```

## repo

* Type: `String`
* Default: `null`

Настройте URL-адрес репозитория или строку `username/repo`, чтобы добавить виджет [GitHub Corner](http://tholman.com/github-corners/) в верхнем правом углу сайта.

```js
window.$docsify = {
  repo: 'QingWei-Li/docsify',
  // или
  repo: 'https://github.com/QingWei-Li/docsify/'
};
```

## maxLevel

* Type: `Number`
* Default: `6`

Таблица максимального уровня контента.

```js
window.$docsify = {
  maxLevel: 4
};
```

## loadNavbar

* Type: `Boolean|String`
* Default: `false`

Загружает навигационную панель из файла Markdown `_navbar.md`, если **true**, или из указанного пути.

```js
window.$docsify = {
  // загрузить из _navbar.md
  loadNavbar: true,

  // загрузить из nav.md
  loadNavbar: 'nav.md'
};
```

## loadSidebar

* Type: `Boolean|String`
* Default: `false`

Загружает боковую панель из файла Markdown `_sidebar.md`, если **true **, или из указанного пути.

```js
window.$docsify = {
  // загрузить из _sidebar.md
  loadSidebar: true,

  // загрузить из summary.md
  loadSidebar: 'summary.md'
};
```

## subMaxLevel

* Type: `Number`
* Default: `0`

Добавить оглавление (Table Of Contents) в боковую панель.

```js
window.$docsify = {
  subMaxLevel: 2
};
```

## auto2top

* Type: `Boolean`
* Default: `false`

Прокручивается к верхней части экрана, когда маршрут изменяется.

```js
window.$docsify = {
  auto2top: true
};
```

## homepage

* Type: `String`
* Default: `README.md`

`README.md` в папке ваших документов будет рассматриваться как домашняя страница вашего веб-сайта, но иногда вам может понадобиться использовать другой файл в качестве домашней страницы.

```js
window.$docsify = {
  // Поменять на /home.md
  homepage: 'home.md',

  // Или использовать readme из вашего репозитория
  homepage:
    'https://raw.githubusercontent.com/QingWei-Li/docsify/master/README.md'
};
```

## basePath

* Type: `String`

Базовый путь веб-сайта. Вы можете установить его в другой каталог или другое доменное имя.

```js
window.$docsify = {
  basePath: '/path/',

  // Загрузите файлы с другого сайта
  basePath: 'https://docsify.js.org/',

  // Даже может загружать файлы из другого репозитория
  basePath:
    'https://raw.githubusercontent.com/ryanmcdermott/clean-code-javascript/master/'
};
```

## coverpage

* Type: `Boolean|String|String[]|Object`
* Default: `false`

Активирует функцию [обложки](ru-ru/cover.md). Если значение true, оно будет загружаться из `_coverpage.md`.

```js
window.$docsify = {
  coverpage: true,

  // кастомный файл 
  coverpage: 'cover.md',

  // множество обложек
  coverpage: ['/', '/zh-cn/'],

  // множество обложек и кастомный файл
  coverpage: {
    '/': 'cover.md',
    '/zh-cn/': 'cover.md'
  }
};
```

## name

* Type: `String`

Название сайта, как показано на боковой панели.

```js
window.$docsify = {
  name: 'docsify'
};
```

## nameLink

* Type: `String`
* Default: `window.location.pathname`

Имя ссылки.

```js
window.$docsify = {
  nameLink: '/',

  // Для каждого маршрута
  nameLink: {
    '/zh-cn/': '/zh-cn/',
    '/': '/'
  }
};
```

## markdown

* Type: `Function`

Смотрите [Markdown конфигурацию](ru-ru/markdown.md).

```js
window.$docsify = {
  // object
  markdown: {
    smartypants: true,
    renderer: {
      link: function() {
        // ...
      }
    }
  },

  // function
  markdown: function(marked, renderer) {
    // ...
    return marked;
  }
};
```

## themeColor

* Type: `String`

Настройте цвет темы. Использование функции и полифилов [CSS3 переменных](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables) в старом браузере.

```js
window.$docsify = {
  themeColor: '#3F51B5'
};
```

## alias

* Type: `Object`

Установите псевдоним маршрута. Вы можете свободно управлять правилами маршрутизации. Поддерживает RegExp.feature и polyfill в старом браузере.

```js
window.$docsify = {
  alias: {
    '/foo/(+*)': '/bar/$1', // supports regexp
    '/zh-cn/changelog': '/changelog',
    '/changelog':
      'https://raw.githubusercontent.com/QingWei-Li/docsify/master/CHANGELOG',
    '/.*/_sidebar.md': '/_sidebar.md' // See #301
  }
};
```

## autoHeader

* type: `Boolean`

Если `loadSidebar` и` autoHeader` включены, для каждой ссылки в `_sidebar.md`, добавьте заголовок страницы, прежде чем преобразовать его в html.
Подробнее [#78](https://github.com/QingWei-Li/docsify/issues/78).

```js
window.$docsify = {
  loadSidebar: true,
  autoHeader: true
};
```

## executeScript

* type: `Boolean`

Выполняет скрипт на странице. Разбирает только первый тёг скрипта ([demo] (themes)). Если Vue присутствует, он включается по умолчанию.

```js
window.$docsify = {
  executeScript: true
};
```

```markdown
## Это тест

<script>
  console.log(2333)
</script>
```

Обратите внимание: если вы используете внешний скрипт, например, встроенная демонстрация jsfiddle, обязательно включите плагин [external-script](plugins.md?id=external-script).

## noEmoji

* type: `Boolean`

Отключает emoji парсинг.

```js
window.$docsify = {
  noEmoji: true
};
```

## mergeNavbar

* type: `Boolean`

Navbar будет объединен с боковой панелью на меньших экранах.

```js
window.$docsify = {
  mergeNavbar: true
};
```

## formatUpdated

* type: `String|Function`

Вы можете отобразить дату обновления файла с помощью переменной **{docsify-updated <span>}</span>**. И форматируйте его `formatUpdated`.
Смотрите https://github.com/lukeed/tinydate#patterns

```js
window.$docsify = {
  formatUpdated: '{MM}/{DD} {HH}:{mm}',

  formatUpdated: function(time) {
    // ...

    return time;
  }
};
```

## externalLinkTarget

* type: `String`
* default: `_blank`

Цель открыть внешние ссылки. По умолчанию `'_blank'` (new window/tab)

```js
window.$docsify = {
  externalLinkTarget: '_self' // default: '_blank'
};
```

## routerMode

* type: `String`
* default: `history`

```js
window.$docsify = {
  routerMode: 'history' // default: 'hash'
};
```

## noCompileLinks

* type: `Array`

Иногда мы не хотим, чтобы docsify обрабатывал наши ссылки. Смотрите [#203](https://github.com/QingWei-Li/docsify/issues/203)

```js
window.$docsify = {
  noCompileLinks: ['/foo', '/bar/.*']
};
```

## onlyCover

* type: `Boolean`

При посещении главной страницы загружается только обложка.

```js
window.$docsify = {
  onlyCover: false
};
```

## requestHeaders

* type: `Object`

Задаёт заголовок запроса ресурсов.

```js
window.$docsify = {
  requestHeaders: {
    'x-token': 'xxx'
  }
};
```

## ext

* type: `String`

Расширение файла запроса.

```js
window.$docsify = {
  ext: '.md'
};
```

## fallbackLanguages

* type: `Array<string>`

Список языков, которые будут возвращаться к языку по умолчанию, когда запрашиваемая страница не существует для данных локально.

Например:

- сначала попробует получить страницу `/de/overview`. Если эта страница существует, она будет отображаться
- затем попробует получить страницу по умолчанию `/overview` (в зависимости от языка по умолчанию). Если эта страница существует, она будет отображаться
- затем отобразит страницу 404.
   
```js
window.$docsify = {
  fallbackLanguages: [
    "ru",
    "de"
  ]
};
```


## notFoundPage

* type: `Boolean` | `String` | `Object`

Загружает файл `_404.md`:
```js
window.$docsify = {
  notFoundPage: true
};
```
Загрузит путь пользовательской страницы 404:
```js
window.$docsify = {
  notFoundPage: 'my404.md'
};
```

Загрузит страницу 404  в соответствии с локализацией:
```js
window.$docsify = {
  notFoundPage: {
    '/': '_404.md',
    '/ru': 'ru/_404.md',
  }
};
```
> Примечание: Параметры fallbackLanguages не работают с параметрами `notFoundPage`.

