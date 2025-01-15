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
  
  // Generate or retrieve session ID
  window.fyenanceSessionId = sessionStorage.getItem('fyenance_session_id') || crypto.randomUUID();
  // Store it in sessionStorage
  sessionStorage.setItem('fyenance_session_id', window.fyenanceSessionId);

  function initializeClarity() {
    if (window.clarity) {
        console.log('Clarity already initialized');
        return;
    }

    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "pdpgebigrf");

    window.clarity("consent");
    
    // Send our session ID to Clarity
    window.clarity("set", "session_id", window.fyenanceSessionId);
    window.clarity("event", "session_start", {
        session_id: window.fyenanceSessionId
    });
    
    // Use our own session ID for all other analytics
    syncAnalyticsSessionId(window.fyenanceSessionId);
  }

  function syncAnalyticsSessionId(sessionId) {
    // Send to Meta Pixel
    if (typeof fbq === 'function') {
        fbq('track', 'CustomizeProduct', {
            session_id: sessionId
        });
    }

    // Send to Reddit Pixel
    if (typeof rdt === 'function') {
        rdt('track', 'Custom', {
            session_id: sessionId
        });
    }

    // Send to Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'session_start', {
            session_id: sessionId
        });
    }
  }
  
  // Initialize cookie consent system
  document.addEventListener('DOMContentLoaded', () => {
    new CookieConsent();
  });

  function debugTrackingIds() {
    console.group('🔍 Session Tracking Debug');
    
    // Check cookie consent status
    const hasConsent = localStorage.getItem('fyenance_cookie_consent') === 'true';
    console.log('Cookie Consent Status:', hasConsent ? '✅ Accepted' : '❌ Not Accepted');
    
    // Check session ID
    console.log('Session ID:', {
        id: window.fyenanceSessionId,
        storedSession: sessionStorage.getItem('fyenance_session_id'),
        matches: window.fyenanceSessionId === sessionStorage.getItem('fyenance_session_id') ? '✅' : '❌'
    });
    
    // Check analytics platforms
    console.log('Analytics Platforms:', {
        clarity: typeof window.clarity === 'function' ? '✅' : '❌',
        meta: typeof fbq === 'function' ? '✅' : '❌',
        reddit: typeof rdt === 'function' ? '✅' : '❌',
        gtag: typeof gtag === 'function' ? '✅' : '❌'
    });

    // Send test events if consent is given
    if (hasConsent && window.fyenanceSessionId) {
        // Test Meta Pixel
        if (typeof fbq === 'function') {
            fbq('track', 'ViewContent', {
                content_type: 'debug',
                session_id: window.fyenanceSessionId,
                timestamp: Date.now()
            });
            console.log('✅ Sent test event to Meta');
        }
        
        // Test Reddit Pixel
        if (typeof rdt === 'function') {
            rdt('track', 'Custom', {
                session_id: window.fyenanceSessionId,
                timestamp: Date.now()
            });
            console.log('✅ Sent test event to Reddit');
        }
        
        // Test Clarity
        if (typeof window.clarity === 'function') {
            window.clarity("event", "debug_check", {
                session_id: window.fyenanceSessionId,
                timestamp: Date.now()
            });
            console.log('✅ Sent test event to Clarity');
        }
        
        // Test Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'debug_check', {
                session_id: window.fyenanceSessionId,
                timestamp: Date.now()
            });
            console.log('✅ Sent test event to Google Analytics');
        }
    }
    
    // Instructions for marketing team
    console.log('\n📋 Marketing Team Instructions:');
    console.log('1. Session ID should persist across page refreshes');
    console.log('2. Session ID should reset when closing/reopening browser');
    console.log('3. All analytics platforms should show ✅');
    console.log('4. Test events should appear in respective platforms');
    
    console.groupEnd();
  }

  // Add keyboard shortcut listener
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        debugTrackingIds();
    }
  });

