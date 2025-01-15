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
            <p>We use cookies and tracking tools to understand how people use our site. This includes analytics (Google Analytics, Microsoft Clarity) and marketing pixels (Meta, Reddit) to measure our advertising effectiveness.</p>
            <p>View our <a href="privacy.html">Privacy Policy</a> for details.</p>
            <div class="cookie-actions">
              <button class="cookie-btn cookie-btn-accept">Accept</button>
              <button class="cookie-btn cookie-btn-decline">Decline</button>
            </div>
          </div>
        `;
      } else {
        popup.innerHTML = `
          <div class="cookie-content">
            <p>We use cookies and tracking tools to understand site usage and measure marketing effectiveness. This includes analytics and advertising pixels from Google, Microsoft, Meta, and Reddit.</p>
            <p>View our <a href="privacy.html">Privacy Policy</a> for details.</p>
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

      // Initialize Clarity with session tracking
      initializeClarity();
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
  
  window.claritySessionId = null;

  function initializeClarity() {
    // Don't reinitialize if Clarity is already there
    if (window.clarity) {
        console.log('Clarity already initialized');
        return;
    }

    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "pdpgebigrf");

    // Set consent
    window.clarity("consent");
    
    // Try to get session ID after a short delay
    setTimeout(() => {
        try {
            // Use the internal Clarity session ID if available
            const clarityContext = window.clarity || {};
            const sessionId = clarityContext.sessionId || 
                            (typeof clarity.getSessionId === 'function' && clarity.getSessionId());
            
            if (sessionId) {
                window.claritySessionId = sessionId;
                console.log('✅ Got Clarity session ID:', sessionId);
                syncAnalyticsSessionId(sessionId);
            }
        } catch (e) {
            console.warn('Failed to get Clarity session ID:', e);
        }
    }, 2000);
  }

  function syncAnalyticsSessionId(sessionId) {
    // Send to Meta Pixel
    if (typeof fbq === 'function') {
      fbq('track', 'CustomizeProduct', {
        clarity_session_id: window.claritySessionId
      });
    }

    // Send to Reddit Pixel
    if (typeof rdt === 'function') {
      rdt('track', 'Custom', {
        clarity_session_id: window.claritySessionId
      });
    }

    // Send to Google Analytics
    if (typeof gtag === 'function') {
      gtag('event', 'clarity_session_start', {
        clarity_session_id: window.claritySessionId
      });
    }
  }
  
  // Initialize cookie consent system
  document.addEventListener('DOMContentLoaded', () => {
    new CookieConsent();
  });

  function debugTrackingIds() {
    console.group('🔍 Tracking IDs Debug');
    
    const hasConsent = localStorage.getItem('fyenance_cookie_consent') === 'true';
    console.log('Cookie Consent Status:', hasConsent);
    
    // Try to get session ID directly from Clarity context
    const clarityContext = window.clarity || {};
    const sessionId = clarityContext.sessionId || 
                     (typeof clarity.getSessionId === 'function' && clarity.getSessionId());
    
    console.log('Direct Clarity Session ID:', sessionId);
    console.log('Global Clarity Session ID:', window.claritySessionId);
    
    if (sessionId && typeof fbq === 'function') {
        fbq('track', 'ViewContent', {
            content_type: 'debug',
            clarity_session_id: sessionId
        });
        console.log('✅ Sent test event to Meta');
    }
    
    console.groupEnd();
  }

  // Add keyboard shortcut listener
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        debugTrackingIds();
    }
  });