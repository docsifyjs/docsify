const fs = require('fs');
const path = require('path');

const docsDir = path.join(process.cwd(), 'docs');
const sitemapPath = path.join(process.cwd(), 'sitemap.xml');
const siteUrl = 'https://docsify.js.org/#/'; 

function walk(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (file.endsWith('.md')) {
      let relativePath = path.relative(docsDir, fullPath).replace(/\\/g, '/');
      files.push(relativePath);
    }
  }
  return files;
}

const files = walk(docsDir);
const now = new Date().toISOString().split('T')[0];

const urls = files.map(f => {
  let urlPath = f.replace(/\.md$/, '');
  if (urlPath.toLowerCase() === 'readme') urlPath = '';
  
  return `
  <url>
    <loc>${siteUrl}${urlPath.replace(/ /g, '%20')}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
}).join('');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync(sitemapPath, sitemapXml);
