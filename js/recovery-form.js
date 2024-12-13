document.getElementById('recovery-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('recovery-email').value;
    let messageDiv = document.getElementById('recovery-message');
    
    // Create message div if it doesn't exist
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'recovery-message';
        e.target.appendChild(messageDiv);
    }
    
    const submitButton = e.target.querySelector('button');
    const originalButtonHtml = submitButton.innerHTML;
    
    // Set loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recovering...';
    
    try {
        const response = await fetch('https://api.fyenanceapp.com/v1/recover-license', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        messageDiv.style.display = 'block';
        if (response.ok) {
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';
            messageDiv.style.marginTop = '1rem';
            messageDiv.style.padding = '1rem';
            messageDiv.style.borderRadius = '8px';
            messageDiv.innerHTML = '<i class="fas fa-check-circle"></i> We\'ve sent your license key to your email address.';
            
        } else {
            messageDiv.style.backgroundColor = '#f8d7da';
            messageDiv.style.color = '#721c24';
            messageDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${data.error || 'Failed to recover license'}`;
        }
    } catch (error) {
        messageDiv.style.display = 'block';
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to contact server';
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHtml;
        submitButton.style.backgroundColor = ''; // Reset background color
    }
});