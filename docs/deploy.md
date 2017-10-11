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
