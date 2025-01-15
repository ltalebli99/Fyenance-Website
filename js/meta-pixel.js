!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '8909592305800884');
fbq('track', 'PageView');

// Function to track purchase with advanced matching
function trackMetaPurchase(email, transactionId) {
    fbq('init', '8909592305800884', {
        em: email,
        external_id: window.claritySessionId
    });
    
    fbq('track', 'Purchase', {
        value: 12.00,
        currency: 'USD',
        transaction_id: transactionId,
        clarity_session_id: window.claritySessionId
    });
}

// Function to track lead when email is entered
function trackMetaLead(email) {
    fbq('init', '8909592305800884', {
        em: email,
        external_id: claritySessionId
    });
    fbq('track', 'Lead', {
        clarity_session_id: claritySessionId
    });
}

// Add this debug function
function debugTrackingIds() {
    console.group('🔍 Tracking IDs Debug');
    
    // Check Clarity ID
    const clarityId = window.clarity ? window.clarity.sessionId : null;
    console.log('Clarity Session ID:', clarityId);
    
    // Send test event to Meta
    if (typeof fbq === 'function') {
        fbq('track', 'ViewContent', {
            content_type: 'debug',
            clarity_session_id: clarityId,
            timestamp: Date.now()
        });
        console.log('Meta test event sent with Clarity ID');
    }
    
    // Send test event to Reddit
    if (typeof rdt === 'function') {
        rdt('track', 'Custom', {
            clarity_session_id: clarityId,
            timestamp: Date.now()
        });
        console.log('Reddit test event sent with Clarity ID');
    }
    
    console.groupEnd();
}

// Add keyboard shortcut to trigger debug
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        debugTrackingIds();
    }
});

// Add this debug UI code
function addDebugButton() {
    // Only show debug in development or if debug parameter exists
    const isDebugMode = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.search.includes('debug=true');
    
    if (isDebugMode) {
        const debugButton = document.createElement('button');
        debugButton.innerHTML = '🔍 Debug Tracking';
        debugButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 10000;
            padding: 8px 16px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
            font-family: monospace;
        `;
        debugButton.onclick = debugTrackingIds;
        document.body.appendChild(debugButton);
    }
}

// Call this when document is ready
document.addEventListener('DOMContentLoaded', addDebugButton);