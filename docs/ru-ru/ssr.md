# Server-Side Rendering

Посморите https://docsify.now.sh

Репозиторий здесь https://github.com/QingWei-Li/docsify-ssr-demo

## Почему SSR?
- Лучший для SEO
- Почувствовать себя крутым

## Быстрый старт

Установите `now` и `docsify-cli` в ваш проект.

```bash
npm i now docsify-cli -D
```

Отредактируйте `package.json`. Если в документации `./docs` есть подкаталоги.

```json
{
  "name": "my-project",
  "scripts": {
    "start": "docsify start . -c ssr.config.js",
    "deploy": "now -p"
  },
  "files": [
    "docs"
  ],
  "docsify": {
    "config": {
      "basePath": "https://docsify.js.org/",
      "loadSidebar": true,
      "loadNavbar": true,
      "coverpage": true,
      "name": "docsify"
    }
  }
}
```

!> `basePath` потому что в webpack `publicPath`. Мы можем использовать локальные или удаленные файлы.

Мы можем просмотреть локально, чтобы убедиться работает ли он.

```bash
npm start

# open http://localhost:4000
```

Опубликовать его!

```bash
now -p
```

Теперь у вас есть поддержка SSR для сайта документации.

## Собственный шаблон

Вы можете предоставить шаблон для всех HTML страниц. Как пример

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>docsify</title>
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <link rel="stylesheet" href="//unpkg.com/docsify/themes/vue.css" title="vue">
</head>
<body>
  <!--inject-app-->
  <!--inject-config-->
  <script src="//unpkg.com/docsify/lib/docsify.js"></script>
  <script src="//unpkg.com/docsify/lib/plugins/search.js"></script>
  <script src="//unpkg.com/prismjs/components/prism-bash.min.js"></script>
  <script src="//unpkg.com/prismjs/components/prism-markdown.min.js"></script>
  <script src="//unpkg.com/prismjs/components/prism-nginx.min.js"></script>
</body>
</html>
```

Шаблон должен содержать эти комментарии для отображаемого содержимого приложения.
 - `<!--inject-app-->`
 - `<!--inject-config-->`

## Конфигурация

Вы можете настроить его в специальном файле конфигурации, или `package.json`.

```js
module.exports = {
  template: './ssr.html',
  maxAge: 60 * 60 * 1000, // lru-cache config
  config: {
   // docsify config
  }
}
```

## Развертывание на VPS

Вы можете запустить `docsify start` непосредственно на Node сервере, или написать свой собственный сервер приложения с `docsify-server-renderer`.

```js
var Renderer = require('docsify-server-renderer')
var readFileSync = require('fs').readFileSync

// init
var renderer = new Renderer({
  template: readFileSync('./docs/index.template.html', 'utf-8').,
  config: {
    name: 'docsify',
    repo: 'qingwei-li/docsify'
  }
})

renderer.renderToString(url)
  .then(html => {})
  .catch(err => {})
```


