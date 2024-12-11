document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('support-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = {
                email: formData.get('email'),
                issue: formData.get('issue'),
                message: formData.get('message')
            };

            try {
                // Show loading state
                const submitButton = form.querySelector('.submit-button');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitButton.disabled = true;

                // Send to your API
                const response = await fetch('https://api.fyenanceapp.com/v1/support', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Failed to send message');
                }

                // Replace only the form with success message
                form.innerHTML = `
                    <div class="success-message">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>Message Sent!</h3>
                        <p>Thanks for reaching out. We'll get back to you as soon as possible at ${data.email}.</p>
                        <button onclick="location.reload()" class="submit-button">
                            <i class="fas fa-paper-plane"></i>
                            Send Another Message
                        </button>
                    </div>
                `;

            } catch (error) {
                console.error('Error:', error);
                
                // Show error message above the form
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Sorry, we couldn't send your message. Please try again or email us directly.</p>
                `;
                
                form.insertBefore(errorDiv, form.firstChild);
                
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
});