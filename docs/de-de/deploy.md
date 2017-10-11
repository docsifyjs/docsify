# Inbetriebnahme

Ähnlich wie bei [GitBook](https://www.gitbook.com), kannst du deine Dateien über GitHub Pages oder VPS erstellen.

## GitHub Pages

Du kannst folgende drei Orte verwenden, um die Dokumentation für dein Github repository zu verwalten:

* `docs/` Ordner
* master branch
* gh-pages branch

Es wird empfohlen, deine Dateien im `./docs` Unterordner im `master` branch deines repository zu speichern. Wechsle dann zu den Einstellungen deines repository und wähle `master branch /docs folder` als deine Github Pages Quelle.

![github pages](_images/deploy-github-pages.png)

!> Du kannst die Dateien auch im Hauptverzeichnis speichern und dann `master branch` in den Einstellungen auswählen.


## GitLab Pages

If you are deploying your master branch, include `.gitlab-ci.yml` with the following script:

?> The `.public` workaround is so `cp` doesn't also copy `public/` to itself in an infinite loop.

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

!> You can replace script with `- cp -r docs/. public`, if `./docs` is your Docsify subfolder.


## VPS

Verwende folgende nginx config.

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
