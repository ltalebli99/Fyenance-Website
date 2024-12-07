const fs = require('fs');
const path = require('path');

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Build the content files
function buildContent() {
  const contentDir = path.join(__dirname, '../_content');
  const publicDir = path.join(__dirname, '../');

  // Process pages
  const pagesDir = path.join(contentDir, 'pages');
  if (fs.existsSync(pagesDir)) {
    const pages = fs.readdirSync(pagesDir);
    pages.forEach(page => {
      const content = fs.readFileSync(path.join(pagesDir, page), 'utf8');
      const outputPath = path.join(publicDir, 'content', 'pages', page);
      ensureDirectoryExistence(outputPath);
      fs.writeFileSync(outputPath, content);
    });
  }

  // Process features
  const featuresDir = path.join(contentDir, 'features');
  if (fs.existsSync(featuresDir)) {
    const features = fs.readdirSync(featuresDir);
    const allFeatures = features.map(feature => {
      return JSON.parse(fs.readFileSync(path.join(featuresDir, feature), 'utf8'));
    });
    const outputPath = path.join(publicDir, 'content', 'features.json');
    ensureDirectoryExistence(outputPath);
    fs.writeFileSync(outputPath, JSON.stringify(allFeatures));
  }
}

buildContent();