const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

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
    const postsDir = path.join(__dirname, '../content/posts');
    const outputDir = path.join(__dirname, '../content');

    // Process posts
    if (fs.existsSync(postsDir)) {
        const posts = fs.readdirSync(postsDir)
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
                const { data, content: markdown } = matter(content);
                return {
                    ...data,
                    body: marked(markdown),
                    slug: file.replace('.md', '')
                };
            });

        // Write posts.json
        const outputPath = path.join(outputDir, 'posts.json');
        ensureDirectoryExistence(outputPath);
        fs.writeFileSync(outputPath, JSON.stringify(posts));
    }
}

buildContent();