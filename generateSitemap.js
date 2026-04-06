import fs from 'fs';
import path from 'path';

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

const allFiles = walk(docsDir);
const now = new Date().toISOString().split('T')[0];

const urls = allFiles
  .filter(f => !f.startsWith('_')) 
  .map(f => {
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

try {
  fs.writeFileSync(sitemapPath, sitemapXml);
} catch (err) {
  console.error(err);
  process.exit(1);
}
