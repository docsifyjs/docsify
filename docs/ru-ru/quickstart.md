# Быстрый старт

Рекомендуется установить `docsify-cli` глобально, что помогает инициализировать и просматривать веб-сайт на локальном компьютере.

```bash
npm i docsify-cli -g
```

## Инициализация

Если вы хотите написать документацию в подкаталоге `./docs`, вы можете использовать команду `init`.

```bash
docsify init ./docs
```

## Написание контента

После завершения `init` вы можете увидеть список файлов в подкаталоге `./docs`.

* `index.html`  файл входа
* `README.md`   домашняя страница
* `.nojekyll`   предотвращает игнорирование GitHub Pages, файлов начинающиеся с символа `_` подчеркивания

Вы можете легко обновить документацию в `./docs/README.md`, конечно, вы можете добавить [больше страниц](more-pages.md).

## Предварительный просмотр

Запустите локальный сервер `docsify serve`. Вы можете просмотреть свой сайт в браузере по адресу `http://localhost:3000`.

```bash
docsify serve docs
```

?> Для использования более практичных случаев `docsify-cli`, перейдите к [docsify-cli документации](https://github.com/QingWei-Li/docsify-cli).

## Ручная инициализация

Если вам не нравится `npm` или у вас возникли проблемы с установкой инструмента, вы можете вручную создать `index.html`:

```html
<!-- index.html -->

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta charset="UTF-8">
  <link rel="stylesheet" href="//unpkg.com/docsify/themes/vue.css">
</head>
<body>
  <div id="app"></div>
  <script>
    window.$docsify = {
      //...
    }
  </script>
  <script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
</body>
</html>
```

Если вы установили python в свою систему, вы можете легко использовать его для запуска статичного сервера для предварительного просмотра вашего сайта.

```bash
cd docs && python -m SimpleHTTPServer 3000
```

## Диалог загрузки

Если вы хотите, вы можете показать диалог загрузки, прежде чем docsify начнет визуализировать вашу документацию:

```html
  <!-- index.html -->

  <div id="app">Please wait...</div>
```

Вы должны установить атрибут `data-app`, если вы изменили `el`:

```html
  <!-- index.html -->

  <div data-app id="main">Please wait...</div>

  <script>
    window.$docsify = {
      el: '#main'
    }
  </script>
```

Подробнее про [el конфигурацию](ru-ru/configuration.md#el).


