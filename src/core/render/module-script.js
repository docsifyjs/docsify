import { parse } from 'es-module-lexer/js';

/**
 * Resolve relative module specifiers without changing strings, comments,
 * import.meta, or computed dynamic imports. The JS lexer runs synchronously
 * and does not require WebAssembly initialization or eval permissions.
 *
 * @param {string} code
 * @param {string} baseURL URL of the Markdown content being rendered
 * @returns {string}
 */
export function resolveModuleSpecifiers(code, baseURL) {
  const [imports] = parse(code, baseURL);

  // Work backwards so replacements do not invalidate the lexer's offsets.
  for (let i = imports.length - 1; i >= 0; i--) {
    const entry = imports[i];
    const specifier = entry.specifier;
    const dynamic = entry.type === 'dynamic';

    if (
      !specifier ||
      !/^(?:\.\/|\.\.\/)/.test(specifier) ||
      (dynamic && (entry.glob || !['"', "'"].includes(code[entry.start])))
    ) {
      continue;
    }

    // Static offsets omit quotes; dynamic offsets include the whole literal.
    // Replace both quotes too, to safely encode URLs containing apostrophes.
    const start = dynamic ? entry.start : entry.start - 1;
    const end = dynamic ? entry.end : entry.end + 1;
    const url = new URL(specifier, baseURL).href;
    code = code.slice(0, start) + JSON.stringify(url) + code.slice(end);
  }

  return code;
}
