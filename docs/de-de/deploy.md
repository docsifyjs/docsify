# Inbetriebnahme

Ähnlich wie bei [GitBook](https://www.gitbook.com), kannst du deine Dateien über [GitHub Pages](https://pages.github.com), [Gitlab Pages](https://about.gitlab.com/features/pages) oder VPS erstellen.

## GitHub Pages

Bei der Verwendung von [GitHub Pages](https://pages.github.com) kannst du folgende drei Orte verwenden, um die Dokumentation für dein GitHub repository zu verwalten:

- `docs/` Ordner
- master branch
- gh-pages branch

Es wird empfohlen, deine Dateien im `./docs` Unterordner im `master` branch deines repository zu speichern. Wechsle dann zu den Einstellungen deines repository und wähle `master branch /docs folder` als deine [GitHub Pages](https://pages.github.com) Quelle.

![GitHub Pages](../_images/deploy-github-pages.png)

!> Du kannst die Dateien auch im Hauptverzeichnis speichern und dann `master branch` in den Einstellungen auswählen.

## GitLab Pages

Wenn du mit [GitLab Pages](https://about.gitlab.com/features/pages) über den master branch deployst, verwende eine `.gitlab-ci.yml` Datei mit folgendem Code:

?> Der Trick mit dem `.public` Verzeichnis wird verwendet, damit `cp` nicht auch `public/` in sich selbst in einer ewigen Schleife kopiert.

```YAML
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

!> Du kannst auch script mit `- cp -r docs/. public`, sollte `./docs` dein **docsify** Unterverzeichnis sein.

## Firebase Hosting

!> Du musst das Firebase CLI mithilfe von `npm i -g firebase-tools` installieren, nachdem du dich unter [Firebase Console](https://console.firebase.google.com) mit einem Google Konto angemeldet hast.

Verwende das Terminal, um das Unterverzeichnis deines Firebase Projektes zu finden und anzusteuern - es könnte z.B. `~/Projects/Docs` sein. Führe dort `firebase init` aus, dann wähle `Hosting` über das Menü (verwende Leerzeichen, um auszuwählen, Pfeiltasten, um die Einstellungen zu ändern, and die Entertaste, um zu bestätigen). Folge den Anweisungen für die Einrichtung.

Deine `firebase.json` Datei sollte wie folgt aussehen (Ich habe mein deploy Verzeichnis von `public` zu `site` geändert):

```json
{
  "hosting": {
    "public": "site",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}
```

Sobald du fertig bist, baue die Vorlage, indem du `docsify init ./site` ausführst (ersetze `site` mit deinem deployment Verzeichnis, welches du beim Ausführen von `firebase init` gewählt hast - `public` ist hier die Standardeinstellung).
Nimm Änderungen an deiner Dokumentation vor und führe `firebase deploy` in dem Verzeichnis deines Projektes aus.

## VPS

Versuche es mit folgender nginx Einstellung:

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

## Netlify

1. Melde dich mit deinem [Netlify](https://www.netlify.com/) Konto an.
2. In den [Einstellungen](https://app.netlify.com/) wähle **New site from Git**.
3. Wähle das Verzeichnis, in dem du deine Dokumentation erstellst. Lasse **Build Command** leer, und wähle für die Einstellung **publish directory** jenes Unterverzeichnis, in welchem sich die Datei `index.html` von **docsify** für deine Dokumentation befindet. Meistens ist dies `docs`, weil `docs/index.html`.

### HTML5 router

Bei der Verwendung des HTML5 router musst du Umleitungsregeln erstellen, die alle Anfragen an `index.html` umleitet. Mit Netlify ist dies einfach. Erstelle eine `\redirects` Datei im `docs` Unterverzeichnis mit:

```sh
/*    /index.html   200
```
