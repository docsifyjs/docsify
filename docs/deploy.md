# Deploy

Similar to [GitBook](https://www.gitbook.com), you can deploy files to GitHub Pages, GitLab Pages or VPS.

## GitHub Pages

There're three places to populate your docs for your Github repository:

* `docs/` folder
* master branch
* gh-pages branch

It is recommended that you save your files to the `./docs` subfolder of the `master` branch of your repository. Then select `master branch /docs folder` as your Github Pages source in your repositories' settings page.

![github pages](_images/deploy-github-pages.png)

!> You can also save files in the root directory and select `master branch`.
You'll need to place a `.nojekyll` file in the deploy location (such as `/docs` or the gh-pages branch

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

## Firebase Hosting

!> You'll need to install the Firebase CLI using `npm i -g firebase-tools` after signing into the [Firebase Console](https://console.firebase.google.com) using a Google Account.  

Using Terminal determine and navigate to the directory for your Firebase Project - this could be `~/Projects/Docs` etc. From there, run `firebase init`, choosing `Hosting` from the menu (use **space** to select, **arrow keys** to change options and **enter** to confirm). Follow the setup instructions.

You should have your `firebase.json` file looking similar to this (depending on your deployment directory):
```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```

Once finished, build the starting template by running `docsify init ./public` (replacing public with the site folder you determined when running `firebase init` - public by default). Add/edit the documentation, then run `firebase deploy` from the base project directory.

## VPS

Try following nginx config.

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
