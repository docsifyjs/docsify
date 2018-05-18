# Развертывание

Подобно [GitBook](https://www.gitbook.com), вы можете развернуть файлы на страницы GitHub, страницы GitLab или VPS.

## GitHub Pages

Есть три места для заполнения ваших документов для вашего репозитория Github:

* `docs/` folder
* master branch
* gh-pages branch

Рекомендуется сохранять файлы в подпапке `./docs` раздела` master` вашего репозитория. Затем выберите папку `master branch /docs folder` в качестве источника Github Pages на странице настроек ваших репозиториев.

![github pages](../_images/deploy-github-pages.png)

!> Вы также можете сохранить файлы в корневом каталоге и выбрать `master branch`.
Вам нужно будет поместить файл `.nojekyll` в место развертывания (например в `/docs` или в ветвь gh-pages

## GitLab Pages

Если вы развертываете свою master ветку, включите `.gitlab-ci.yml` со следующим скриптом:

?> Обходной путь для `.public` - так бы что `cp` не копировал в себя `public/` в бесконечном цикле.

``` YAML
pages:
  stage: deploy
  script:
  - mkdir .public
  - cp -r * .public
  - mv .public public
  artifacts:
    paths:
    - public
  only:
  - master
```

!> Вы можете заменить скрипт на `- cp -r docs/. public`, если `./docs` является подпапкой Docsify.

## Firebase Hosting

!> После входа в [консоль Firebase](https://console.firebase.google.com) с помощью учётной записи Google, вам необходимо установить CLI Firebase с помощью `npm i -g firebase-tools`.

Используя терминал, определите и перейдите к каталогу для своего проекта Firebase - это может быть `~/Projects/Docs` и т.д. Оттуда запустите `firebase init`, выбирая `Hosting` из меню (используйте **пробел** для выбора , **стрелки** для изменения параметров и **ввод** для подтверждения). Следуйте инструкциям по установке.

У вас должен быть похожий файл `firebase.json` (я изменил каталог развёртывания с `public` на `site`):
```json
{
  "hosting": {
    "public": "site",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```
По завершении создайте исходный шаблон, запустив `docsify init. /site` (заменив сайт каталогом развертывания, который вы определили при запуске `firebase init` - public по умолчанию). Добавьте/отредактируйте документацию, затем запустите `firebase deploy` из базового каталога проекта.

## VPS

Попробуйте следовать конфигурации nginx.

```nginx
server {
  listen 80;
  server_name  your.domain.com;

  location / {
    alias /path/to/dir/of/docs;
    index index.html;
  }
}
```


