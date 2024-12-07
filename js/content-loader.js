async function loadContent() {
    try {
        // Load home page content
        const homeResponse = await fetch('/content/pages/home.json');
        const homeData = await homeResponse.json();
        
        // Update hero section
        if (homeData) {
            const heroTitle = document.querySelector('.hero-content h1');
            const heroSubtitle = document.querySelector('.hero-content .subtitle');
            const ctaButton = document.querySelector('.hero-cta .cta-button');
            
            if (heroTitle) heroTitle.textContent = homeData.heroTitle;
            if (heroSubtitle) heroSubtitle.textContent = homeData.heroSubtitle;
            if (ctaButton) ctaButton.textContent = homeData.ctaText;
        }
        
        // Load features
        const featuresResponse = await fetch('/content/features.json');
        const featuresData = await featuresResponse.json();
        
        const featureGrid = document.querySelector('.feature-grid');
        if (featureGrid && featuresData) {
            featureGrid.innerHTML = featuresData.map(feature => `
                <div class="feature-card">
                    <i class="${feature.icon}"></i>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `).join('');
        }
        
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadContent);