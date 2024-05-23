// Exports
// =============================================================================
export const config = {
  matcher: ['/preview/(index.html)?'],
};

// Rewrite rules shared with local server configurations
export const rewriteRules = [
  // Replace CDN URLs with local paths
  {
    match: /https?.*\/CHANGELOG.md/g,
    replace: '/CHANGELOG.md',
  },
  {
    // CDN versioned default
    // Ex1: //cdn.com/package-name
    // Ex2: http://cdn.com/package-name@1.0.0
    // Ex3: https://cdn.com/package-name@latest
    match: /(?:https?:)*\/\/.*cdn.*docsify[@\d.latest]*(?=["'])/g,
    replace: '/dist/docsify.min.js',
  },
  {
    // CDN paths to local paths
    // Ex1: //cdn.com/package-name/path/file.js => /path/file.js
    // Ex2: http://cdn.com/package-name@1.0.0/dist/file.js => /dist/file.js
    // Ex3: https://cdn.com/package-name@latest/dist/file.js => /dist/file.js
    match: /(?:https?:)*\/\/.*cdn.*docsify[@\d.latest]*\/(?:dist\/)/g,
    replace: '/dist/',
  },
];

// Serve virtual /preview/index.html
// Note: See vercel.json for preview routing configuration
// 1. Fetch index.html from /docs/ directory
// 2. Replace CDN URLs with local paths (see rewriteRules)
// 3. Return preview HTML
export default async function middleware(request) {
  const { origin } = new URL(request.url);
  const indexURL = `${origin}/docs/index.html`;
  const indexHTML = await fetch(indexURL).then(res => res.text());
  const previewHTML = rewriteRules.reduce(
    (html, rule) => html.replace(rule.match, rule.replace),
    indexHTML,
  );

  return new Response(previewHTML, {
    status: 200,
    headers: {
      'content-type': 'text/html',
      'x-robots-tag': 'noindex',
    },
  });
}
