function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
}

document.getElementById('check-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const licenseKey = document.getElementById('license-key').value.trim();
    const resultDiv = document.getElementById('license-result');
    const submitButton = e.target.querySelector('button');
    const originalButtonHtml = submitButton.innerHTML;

    // Set loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';

    try {
        const response = await fetch(`https://api.fyenanceapp.com/v1/check-license/${licenseKey}`);
        const data = await response.json();
        
        if (data.status === 'found') {
            resultDiv.innerHTML = `
                <h4>License Status</h4>
                <p>Status: <strong>${data.license.status}</strong></p>
                <p>Email: <strong>${data.license.email}</strong></p>
                <p>Activations: <strong>${data.license.activations.used}/${data.license.activations.total}</strong></p>
                
                <div class="next-steps">
                    <h4>Next Steps</h4>
                    <ul>
                        ${data.nextSteps.map(step => `
                            <li>
                                <strong>${step.issue}</strong>
                                ${step.action}
                                <small>${step.details}</small>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="support-reference">
                    Support Reference: ${data.support.reference}
                </div>
            `;
            resultDiv.className = 'success';
        } else {
            resultDiv.innerHTML = `
                <h4>Error</h4>
                <p>${data.message}</p>
                ${data.details ? `<p><small>${data.details}</small></p>` : ''}
            `;
            resultDiv.className = 'error';
        }
        resultDiv.style.display = 'block';
    } catch (error) {
        resultDiv.innerHTML = `
            <h4>Error</h4>
            <p>There was an error checking your license. Please try again later.</p>
        `;
        resultDiv.className = 'error';
        resultDiv.style.display = 'block';
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHtml;
    }
});