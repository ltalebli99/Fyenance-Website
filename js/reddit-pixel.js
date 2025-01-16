!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);

// Initial page setup
rdt('init','a2_g5tvpc00kw9p');
rdt('track', 'PageVisit', {
    session_id: window.fyenanceSessionId
});

// Function to track purchase with advanced matching
function trackRedditPurchase(email, transactionId) {
    rdt('init', 'a2_g5tvpc00kw9p', {
        email: email,
        external_id: transactionId,
        session_id: window.fyenanceSessionId
    });
    
    setTimeout(() => {
        rdt('track', 'Purchase', {
            value: 12.00,
            currency: 'USD',
            transaction_id: transactionId,
            session_id: window.fyenanceSessionId,
            item_count: 1
        });
    }, 100);
}

// Function to track lead when email is entered
function trackRedditLead(email) {
    rdt('init', 'a2_g5tvpc00kw9p', {
        email: email,
        external_id: window.fyenanceSessionId
    });
    rdt('track', 'Lead', {
        session_id: window.fyenanceSessionId,
        value: 12.00,
        currency: 'USD'
    });
}
