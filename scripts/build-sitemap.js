const fs = require('fs');
const path = require('path');

// Base URL of your website
const BASE_URL = 'https://fyenanceapp.com';

// Function to ensure directory exists
function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

// Function to generate sitemap
function buildSitemap() {
    // Static pages
    const staticPages = [
        '',  // homepage
        '/blog.html',
        '/privacy.html',
        '/terms.html',
        '/buy.html'
    ];

    // Start XML content
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    staticPages.forEach(page => {
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${BASE_URL}${page}</loc>\n`;
        sitemap += `    <changefreq>weekly</changefreq>\n`;
        sitemap += `  </url>\n`;
    });

    // Add blog posts
    const postsPath = path.join(__dirname, '../content/posts.json');
    if (fs.existsSync(postsPath)) {
        const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
        posts.forEach(post => {
            sitemap += `  <url>\n`;
            sitemap += `    <loc>${BASE_URL}${post.url}</loc>\n`;
            sitemap += `    <lastmod>${new Date(post.date).toISOString()}</lastmod>\n`;
            sitemap += `    <changefreq>monthly</changefreq>\n`;
            sitemap += `  </url>\n`;
        });
    }

    sitemap += '</urlset>';

    // Write sitemap file
    const sitemapPath = path.join(__dirname, '../sitemap.xml');
    ensureDirectoryExistence(sitemapPath);
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('Sitemap generated successfully!');
}

buildSitemap();