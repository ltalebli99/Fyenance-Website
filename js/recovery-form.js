document.getElementById('recovery-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('recovery-email').value;
    const messageDiv = document.getElementById('recovery-message');
    const submitButton = e.target.querySelector('button');
    
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
    }
    
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-sync"></i> Recover License';
});