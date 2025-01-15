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
        external_id: window.fyenanceSessionId
    });
    
    fbq('track', 'Purchase', {
        value: 12.00,
        currency: 'USD',
        transaction_id: transactionId,
        session_id: window.fyenanceSessionId
    });
}

// Function to track lead when email is entered
function trackMetaLead(email) {
    fbq('init', '8909592305800884', {
        em: email,
        external_id: window.fyenanceSessionId
    });
    fbq('track', 'Lead', {
        session_id: window.fyenanceSessionId
    });
}