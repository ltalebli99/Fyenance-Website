async function loadContent() {
    try {
        // Load posts
        const postsResponse = await fetch('/content/posts.json');
        const posts = await postsResponse.json();
        
        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Update main posts container
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
                        ${post.body.split('</p>')[0]}</p>
                    </div>
                    <a href="${post.url}" class="read-more">Read more →</a>
                </article>
            `).join('');
        }

        // Update recent posts in sidebar
        const recentPosts = document.querySelector('.recent-posts');
        if (recentPosts) {
            recentPosts.innerHTML = posts.slice(0, 5).map(post => `
                <div class="recent-post">
                    <a href="${post.url}">${post.title}</a>
                    <time datetime="${post.date}">${new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    })}</time>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// Load content when DOM is ready
document.addEventListener('DOMContentLoaded', loadContent);

// Handle mobile menu
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-toggle')) {
                navLinks.classList.remove('active');
            }
        });
    }
});