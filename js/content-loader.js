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
                    <h2>${post.title}</h2>
                    <div class="post-content">
                        ${post.body}
                    </div>
                </article>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadContent);