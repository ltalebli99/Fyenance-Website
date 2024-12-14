class CookieConsent {
    constructor() {
      this.cookieConsentKey = 'fyenance_cookie_consent';
      this.initializeConsent();
    }
  
    async initializeConsent() {
      // Get country from response header
      const countryCode = await this.getCountryCode();
      
      // List of EU countries + EEA
      const euCountries = [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
        'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
        'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'IS', 'LI',
        'NO', 'CH'
      ];
  
      const isEU = euCountries.includes(countryCode);
  
      if (isEU) {
        // Strict opt-in for EU users
        if (!this.hasUserConsented()) {
          this.showConsentBanner('eu');
        } else {
          this.initializeAnalytics();
        }
      } else {
        // Opt-out approach for non-EU users
        this.initializeAnalytics();
        if (localStorage.getItem(this.cookieConsentKey) === null) {
          this.showConsentBanner('non-eu');
        }
      }
    }
  
    async getCountryCode() {
      try {
        const response = await fetch(window.location.href);
        return response.headers.get('X-User-Country') || 'XX';
      } catch (error) {
        console.error('Error getting country code:', error);
        return 'EU'; 
      }
    }
  
    createConsentBanner(type) {
      const banner = document.createElement('div');
      banner.className = 'cookie-consent';
  
      // Create the cookie icon container
      const iconContainer = document.createElement('div');
      iconContainer.className = 'cookie-icon';
      iconContainer.innerHTML = '<i class="fas fa-cookie-bite" style="color: var(--primary);"></i>';
  
      // Create the popup content
      const popup = document.createElement('div');
      popup.className = 'cookie-popup';
  
      if (type === 'eu') {
        popup.innerHTML = `
          <div class="cookie-content">
            <p>We need your consent to use analytics cookies. Just to get an idea of how many people are here. No funny business!</p>
            View our <a href="privacy.html">Privacy Policy</a> here.
            <div class="cookie-actions">
              <button class="cookie-btn cookie-btn-accept">Accept</button>
              <button class="cookie-btn cookie-btn-decline">Decline</button>
            </div>
          </div>
        `;
      } else {
        popup.innerHTML = `
          <div class="cookie-content">
            <p>We use analytics cookies. Opt out anytime. Just to get an idea of how many people are here. No funny business!</p>
            View our <a href="privacy.html">Privacy Policy</a> here.
            <div class="cookie-actions">
              <button class="cookie-btn cookie-btn-accept">Continue</button>
              <button class="cookie-btn cookie-btn-decline">Opt-out</button>
            </div>
          </div>
        `;
      }
  
      banner.appendChild(iconContainer);
      banner.appendChild(popup);
      return banner;
    }
  
    showConsentBanner(type) {
      const banner = this.createConsentBanner(type);
      document.body.appendChild(banner);
      
      setTimeout(() => banner.classList.add('visible'), 100);
  
      banner.querySelector('.cookie-btn-accept').addEventListener('click', () => {
        this.setConsent(true);
        this.hideBanner(banner);
        if (type === 'eu') {
          this.initializeAnalytics();
        }
      });
  
      banner.querySelector('.cookie-btn-decline').addEventListener('click', () => {
        this.setConsent(false);
        this.hideBanner(banner);
        if (type === 'non-eu') {
          this.disableAnalytics();
        }
      });
    }
  
    hideBanner(banner) {
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 300);
    }
  
    hasUserConsented() {
      return localStorage.getItem(this.cookieConsentKey) === 'true';
    }
  
    setConsent(consent) {
      localStorage.setItem(this.cookieConsentKey, consent);
    }
  
    initializeAnalytics() {
      // Google Analytics
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-21G8LJFM86');
  
      // Microsoft Clarity
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "pdpgebigrf");
    }
  
    disableAnalytics() {
      // Disable Google Analytics
      window['ga-disable-G-21G8LJFM86'] = true;
      
      // Clear existing analytics cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Prevent future tracking
      window.clarity = function(){};
    }
  }
  
  // Initialize cookie consent system
  document.addEventListener('DOMContentLoaded', () => {
    new CookieConsent();
  });