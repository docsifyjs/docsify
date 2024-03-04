import url from 'url';
import path from 'path';

/** Get a new path relative to the current module (pass import.meta). */
export const relative = (meta, ...to) =>
  path.resolve(path.dirname(url.fileURLToPath(meta.url)), ...to);
