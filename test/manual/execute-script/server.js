import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { create } from 'browser-sync';

const html = await readFile(new URL('./index.html', import.meta.url), 'utf8');

create().init({
  listen: '127.0.0.1',
  port: 4173,
  open: false,
  ui: false,
  notify: false,
  snippet: false,
  server: {
    baseDir: fileURLToPath(new URL('../../../', import.meta.url)),
    middleware: [
      {
        route: '/module-demo',
        handle(request, response) {
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(html);
        },
      },
    ],
  },
});
