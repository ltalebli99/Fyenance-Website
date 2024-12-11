async function animateCount(element, target, duration = 6000) {
    const start = 50;
    const frames = 60;
    const totalSteps = frames * (duration / 1000);
    let step = 0;
    
    const easeOutQuint = x => 1 - Math.pow(1 - x, 5);
    
    const animate = () => {
        step++;
        const progress = step / totalSteps;
        const easedProgress = easeOutQuint(progress);
        
        const current = start - (start - target) * easedProgress;
        
        if (progress >= 1) {
            element.textContent = Math.round(target);
            return;
        }
        
        element.textContent = Math.round(current);
        requestAnimationFrame(animate);
    };
    
    animate();
}

async function updateEarlyBirdCount() {
    try {
        const response = await fetch('https://api.fyenanceapp.com/v1/deal-status');
        const data = await response.json();
        
        // Get all elements that need updating
        const countElements = document.querySelectorAll('.remaining-count');
        
        countElements.forEach(element => {
            animateCount(element, data.remaining);
        });

        // Add urgency styling if running low
        if (data.remaining <= 10) {
            countElements.forEach(element => {
                element.style.color = '#dc3545';
            });
        }

        // Hide elements if sold out
        if (data.remaining <= 0) {
            const specialOffer = document.querySelector('.special-offer');
            const earlyBirdBadge = document.querySelector('.hero-badge');
            if (specialOffer) specialOffer.style.display = 'none';
            if (earlyBirdBadge) earlyBirdBadge.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching early bird status:', error);
    }
}

async function updateLicenseCount() {
    try {
        const response = await fetch('https://api.fyenanceapp.com/v1/admin/license-count', {
            headers: {
                'Authorization': `Bearer __ADMIN_API_KEY__`
            }
        });
        const data = await response.json();
        
        // Update all license count elements
        const countElements = document.querySelectorAll('.license-count');
        countElements.forEach(element => {
            element.textContent = data.count;
        });
    } catch (error) {
        console.error('Error fetching license count:', error);
    }
}

// Call immediately and then every 10 minutes
updateEarlyBirdCount();
setInterval(updateEarlyBirdCount, 600000);

// Initialize license count
document.addEventListener('DOMContentLoaded', () => {
    updateLicenseCount();
});