!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

// Initialize once with default parameters
fbq('init', '8909592305800884');
fbq('track', 'PageView', {
    session_id: window.fyenanceSessionId
});

// Function to track purchase with advanced matching
function trackMetaPurchase(email, transactionId) {
    // Track the purchase event
    fbq('track', 'Purchase', {
        value: 12.00,
        currency: 'USD',
        transaction_id: transactionId,
        session_id: window.fyenanceSessionId,
        content_type: 'product',
        content_name: 'Fyenance License',
        em: email
    });
}

// Function to track add to cart
function trackMetaAddToCart(email) {
    fbq('track', 'AddToCart', {
        value: 12.00,
        currency: 'USD',
        content_type: 'product',
        content_name: 'Fyenance License',
        session_id: window.fyenanceSessionId,
        em: email
    });
}

// Function to track lead when email is entered
function trackMetaLead(email) {
    fbq('track', 'Lead', {
        value: 12.00,
        currency: 'USD',
        content_type: 'product',
        content_name: 'Fyenance License',
        session_id: window.fyenanceSessionId,
        em: email
    });
}