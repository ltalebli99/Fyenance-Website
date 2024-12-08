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
    // Define paths relative to project root
    const postsDir = 'content/posts';
    const outputDir = 'content';
    const templatePath = 'content/templates/post.html';
    
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
                const description = data.description || post.body.replace(/<[^>]*>/g, '').slice(0, 160) + '...';
                let postHtml = template
                    .replace(/{{title}}/g, data.title)
                    .replace(/{{description}}/g, description)
                    .replace(/{{date}}/g, data.date)
                    .replace(/{{url}}/g, `/posts/${slug}.html`)
                    .replace(/{{formatDate date}}/g, formatDate(data.date))
                    .replace(/{{image}}/g, data.image || 'https://fyenanceapp.com/assets/images/og-image.png')
                    .replace(/{{{body}}}/g, marked.parse(markdown));

                // Write individual post HTML file
                const postPath = path.join(__dirname, `../posts/${slug}.html`);
                ensureDirectoryExistence(postPath);
                fs.writeFileSync(postPath, postHtml);

                return {
                    ...data,
                    body: marked.parse(markdown),
                    slug: slug,
                    url: `/posts/${slug}.html`,
                    image: data.image || null
                };
            });

        // Write posts.json for the blog listing
        const outputPath = path.join(outputDir, 'posts.json');
        ensureDirectoryExistence(outputPath);
        fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
    }
}

buildContent();