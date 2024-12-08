const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Build the content files
function buildContent() {
    const postsDir = path.join(__dirname, '../content/posts');
    const outputDir = path.join(__dirname, '../content');
    const templatePath = path.join(__dirname, '../content/templates/post.html');
    
    // Read the template
    const template = fs.readFileSync(templatePath, 'utf8');

    // Process posts
    if (fs.existsSync(postsDir)) {
        const posts = fs.readdirSync(postsDir)
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
                const { data, content: markdown } = matter(content);
                const slug = file.replace('.md', '');
                
                // Create individual post HTML
                let postHtml = template
                    .replace(/{{title}}/g, data.title)
                    .replace(/{{date}}/g, data.date)
                    .replace(/{{formatDate date}}/g, formatDate(data.date))
                    .replace(/{{{body}}}/g, marked.parse(markdown));

                // Write individual post HTML file
                const postPath = path.join(__dirname, `../posts/${slug}.html`);
                ensureDirectoryExistence(postPath);
                fs.writeFileSync(postPath, postHtml);

                return {
                    ...data,
                    body: marked.parse(markdown),
                    slug: slug,
                    url: `/posts/${slug}.html`
                };
            });

        // Write posts.json for the blog listing
        const outputPath = path.join(outputDir, 'posts.json');
        ensureDirectoryExistence(outputPath);
        fs.writeFileSync(outputPath, JSON.stringify(posts));
    }
}

buildContent();