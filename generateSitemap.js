const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
const siteUrl = 'https://docsify.js.org/#/';

function walk(dir) {
  let files = [];
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (file.endsWith('.md')) {
      files.push(path.relative(docsDir, fullPath).replace(/\\/g, '/'));
    }
  }
  return files;
}

const files = walk(docsDir);
const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const urls = files.map(f => `
  <url>
    <loc>${siteUrl}${f}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`).join('');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync(sitemapPath, sitemapXml);
console.log('Sitemap XML generated:', sitemapPath);
