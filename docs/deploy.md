# Deploy

As as GitBook, you can deploy files to GitHub Pages or VPS.

## GitHub Pages

There're three places to populate your docs

- `docs/` folder
- master branch
- gh-pages branch

You can save your files in `./docs` and setting `master branch /docs folder`.

![github pages](_images/deploy-github-pages.png)

!> You can also save files in the root directory and select `master branch`.

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
