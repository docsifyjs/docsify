# Vanilla ESM TypeScript Example

This is an example of a project that imports Docsify via plain ESM in browser,
with type checking with TypeScript to prove that type definitions are working.

This ensures that downstream projects that consume Docsify via ESM get
intellisense in their IDE (f.e. `Go To Definition` in VS Code will take the user
to Docsify source code).

This example is not using a build tool, but relying on native ESM in the
browser, using an `importmap` script (`<script type="importmap">` in
`index.html`) to tell the browser to find dependencies in node_modules.

## Commands

### `npm run typecheck`

Run type checking for the project.

### `npm run serve`

Serve the example at http://localhost:5500 to verify vanilla ESM usage works.

## Notes

- We use a service worker to fix Docsify dependencies that use non-standard
  import paths (without file extensions). See `sw.js` for more details.
- We use `prism.js` in the `importmap` to map PrismJS from CommonJS to ESM. See
  `prism.js` for more details.
- We use `await import()` instead of `import` statements when importing Docsify
  to ensure we load PrismJS and create a global `Prism` variable before Docsify is
  imported. See `example.js` for more details.
