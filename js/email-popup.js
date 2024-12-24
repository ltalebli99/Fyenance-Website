document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('email-popup').style.display = 'flex';
    }, 60000); // 1 minute

    window.closeModal = function() {
        document.getElementById('email-popup').style.display = 'none';
    };

    window.submitEmail = async function() {
        const email = document.getElementById('popup-email').value;
        if (email) {
            try {
                const response = await fetch('https://your-server-endpoint.com/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                if (response.ok) {
                    console.log('Email submitted:', email);
                    closeModal();
                } else {
                    throw new Error('Failed to send email');
                }
            } catch (error) {
                alert('There was an error submitting your email. Please try again.');
                console.error('Error:', error);
            }
        } else {
            alert('Please enter a valid email address.');
        }
    };
});