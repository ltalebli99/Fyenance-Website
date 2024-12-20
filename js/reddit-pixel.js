!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);

// Initial page setup
rdt('init','a2_g5tvpc00kw9p');
rdt('track', 'PageVisit');

// Function to track purchase with advanced matching
function trackRedditPurchase(email, transactionId) {
    console.log('trackRedditPurchase called with:', { email, transactionId });
    
    // Reinitialize with user data
    rdt('init', 'a2_g5tvpc00kw9p', {
        email: email,
        externalId: transactionId
    });
    
    // Add small delay to ensure initialization completes
    setTimeout(() => {
        console.log('Sending Reddit Purchase event');
        rdt('track', 'Purchase');
    }, 100);
}