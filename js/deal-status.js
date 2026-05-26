function formatDealPrice(dollars) {
    const n = Number(dollars);
    if (!Number.isFinite(n)) return '$0';
    if (Number.isInteger(n) || Math.round(n * 100) % 100 === 0) {
        return '$' + Math.round(n);
    }
    return '$' + n.toFixed(2);
}

function normalizeDealData(data) {
    const earlyBirdPrice = data.earlyBirdPrice ?? data.currentPrice;
    const regularPrice = data.regularPrice ?? data.currentPrice;
    return { ...data, earlyBirdPrice, regularPrice };
}

function updateDealPrices(data) {
    data = normalizeDealData(data);
    const currentDollars = data.isEarlyBird ? data.earlyBirdPrice : data.regularPrice;
    const formatted = {
        current: formatDealPrice(currentDollars),
        early: formatDealPrice(data.earlyBirdPrice),
        regular: formatDealPrice(data.regularPrice),
    };

    window.fyenanceDeal = {
        ...data,
        currentPrice: currentDollars,
        formatted,
    };

    document.querySelectorAll('.deal-price-current').forEach((el) => {
        el.textContent = formatted.current;
    });
    document.querySelectorAll('.deal-price-early').forEach((el) => {
        el.textContent = formatted.early;
    });
    document.querySelectorAll('.deal-price-regular').forEach((el) => {
        el.textContent = formatted.regular;
    });

    document.querySelectorAll('.price-increase-warning, .original-price').forEach((el) => {
        el.style.display = data.isEarlyBird ? '' : 'none';
    });
}

async function animateCount(element, target, duration = 6000) {
    const start = 100;
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
        const data = normalizeDealData(await response.json());
        
        updateDealPrices(data);

        const countElements = document.querySelectorAll('.remaining-count');
        
        countElements.forEach(element => {
            animateCount(element, data.remaining);
        });

        if (data.remaining <= 10) {
            countElements.forEach(element => {
                element.style.color = '#dc3545';
            });
        }

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
        const response = await fetch('https://api.fyenanceapp.com/v1/license-count');
        const data = await response.json();
        
        const countElements = document.querySelectorAll('.license-count');
        countElements.forEach(element => {
            element.textContent = data.count;
        });
    } catch (error) {
        console.error('Error fetching license count:', error);
    }
}

updateEarlyBirdCount();
setInterval(updateEarlyBirdCount, 600000);

document.addEventListener('DOMContentLoaded', () => {
    updateLicenseCount();
});
