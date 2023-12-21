import rewriteRules from './rewriterules.config.js';

// Exports
// =============================================================================
export const config = {
  matcher: ['/preview/(index.html)?'],
};

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
    indexHTML
  );

  return new Response(previewHTML, {
    status: 200,
    headers: {
      'content-type': 'text/html',
      'x-robots-tag': 'noindex',
    },
  });
}
