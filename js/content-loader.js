async function loadContent() {
    try {
        // Load posts
        const postsResponse = await fetch('/content/posts.json');
        const posts = await postsResponse.json();
        
        // Update posts section
        const postsContainer = document.querySelector('.posts-container');
        if (postsContainer && posts) {
            postsContainer.innerHTML = posts.map(post => `
                <article class="post">
                    <h2><a href="${post.url}">${post.title}</a></h2>
                    <div class="post-meta">
                        <time datetime="${post.date}">${new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</time>
                    </div>
                    <div class="post-content">
                        ${post.body.split('</p>')[0]}</p> <!-- Show only first paragraph -->
                    </div>
                    <a href="${post.url}" class="read-more">Read more →</a>
                </article>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadContent);