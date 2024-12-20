document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const recalculateButton = document.querySelector('.recalculate');
    const sendReportButton = document.querySelector('#sendReport');

    let currentStep = 0;
    let currentPage = 1;
    const rowsPerPage = 12;
    let fullSchedule = [];
    let pdfBlob = null;
    const IS_TEST_MODE = true; // Toggle this for testing
    
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        currentStep = stepIndex;
    }

    // Navigation event listeners
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Validate current step
            if (currentStep === 0) {
                const homePrice = parseFloat(document.getElementById('homePrice').value);
                const downPayment = parseFloat(document.getElementById('downPayment').value);
                
                if (!homePrice || !downPayment) {
                    alert('Please fill in all fields');
                    return;
                }
                
                if (downPayment >= homePrice) {
                    alert('Down payment cannot be greater than or equal to home price');
                    return;
                }
            }
            
            if (currentStep === 1) {
                const interestRate = parseFloat(document.getElementById('interestRate').value);
                const loanTerm = document.getElementById('loanTerm').value;
                
                if (!interestRate || !loanTerm) {
                    alert('Please fill in all fields');
                    return;
                }
                
                // Calculate before showing results
                calculateMortgage();
            }
            
            showStep(currentStep + 1);
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            showStep(currentStep - 1);
        });
    });

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    function formatDate(monthsFromNow) {
        const date = new Date();
        date.setMonth(date.getMonth() + monthsFromNow);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }

    function updateScheduleTable(schedule, page = 1) {
        const tableBody = document.getElementById('scheduleBody');
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = schedule.slice(start, end);
        
        tableBody.innerHTML = paginatedData.map(row => `
            <tr>
                <td>${row.month}</td>
                <td>${formatDate(row.month)}</td>
                <td>$${formatCurrency(row.payment)}</td>
                <td>$${formatCurrency(row.principal)}</td>
                <td>$${formatCurrency(row.interest)}</td>
                <td>$${formatCurrency(row.remainingBalance)}</td>
                <td>$${formatCurrency(row.totalInterestPaid)}</td>
            </tr>
        `).join('');

        // Update pagination
        const totalPages = Math.ceil(schedule.length / rowsPerPage);
        document.getElementById('pageInfo').textContent = `Page ${page} of ${totalPages}`;
        document.getElementById('prevPage').disabled = page === 1;
        document.getElementById('nextPage').disabled = page === totalPages;
    }

    function calculateMortgage() {
        const homePrice = parseFloat(document.getElementById('homePrice').value);
        const downPayment = parseFloat(document.getElementById('downPayment').value);
        const interestRate = parseFloat(document.getElementById('interestRate').value);
        const loanTerm = parseInt(document.getElementById('loanTerm').value);
        
        const calculationResults = {
            loanAmount: homePrice - downPayment,
            interestRate: interestRate,
            loanTerm: loanTerm * 12, // Convert years to months
            monthlyRate: interestRate / 100 / 12
        };

        // Calculate monthly payment
        calculationResults.monthlyPayment = (calculationResults.loanAmount * 
            calculationResults.monthlyRate * 
            Math.pow(1 + calculationResults.monthlyRate, calculationResults.loanTerm)) / 
            (Math.pow(1 + calculationResults.monthlyRate, calculationResults.loanTerm) - 1);

        // Calculate total payment and interest
        calculationResults.totalPayment = calculationResults.monthlyPayment * calculationResults.loanTerm;
        calculationResults.totalInterest = calculationResults.totalPayment - calculationResults.loanAmount;

        // Generate and store full schedule
        fullSchedule = generateAmortizationSchedule(calculationResults);
        
        // Update UI with formatted numbers
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        };

        // Update all UI elements
        updateElement('monthlyPaymentForm', formatCurrency(calculationResults.monthlyPayment));
        updateElement('monthlyPaymentResults', formatCurrency(calculationResults.monthlyPayment));
        updateElement('totalPrincipal', formatCurrency(calculationResults.loanAmount));
        updateElement('totalInterest', formatCurrency(calculationResults.totalInterest));
        updateElement('totalInterestMonthly', formatCurrency(calculationResults.totalInterest));
        updateElement('totalCost', formatCurrency(calculationResults.totalPayment));
        updateElement('principalInterest', `$${formatCurrency(calculationResults.monthlyPayment)}`);
        updateElement('principalInterestMonthly', `$${formatCurrency(calculationResults.monthlyPayment)}`);
        updateElement('totalPayment', formatCurrency(calculationResults.totalPayment));
        updateElement('totalPaymentMonthly', formatCurrency(calculationResults.totalPayment));
        
        // Update key details
        updateElement('loanAmount', `$${formatCurrency(calculationResults.loanAmount)}`);
        updateElement('downPaymentAmount', `$${formatCurrency(downPayment)}`);
        updateElement('interestRateDisplay', `${interestRate.toFixed(2)}%`);
        updateElement('loanTermDisplay', `${loanTerm} years`);

        console.log(calculationResults);

        // Make sure the overview tab is visible initially
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        const overviewTab = document.querySelector('[data-tab="overview"]');
        const overviewContent = document.getElementById('overview');
        
        if (overviewTab) overviewTab.classList.add('active');
        if (overviewContent) overviewContent.classList.add('active');

        // Update schedule table if it exists
        if (fullSchedule.length > 0) {
            updateScheduleTable(fullSchedule, 1);
        }
        
        // Update charts if they exist
        if (typeof updateCharts === 'function') {
            updateCharts(fullSchedule, calculationResults.loanAmount, calculationResults.totalInterest);
        }

        // Remove the overlay if it exists
        const overlay = document.querySelector('.calculator-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }

        document.querySelectorAll('.tab-button').forEach(button => {
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
        });

        // Add to calculateMortgage function after existing calculations
        const monthlyInterest = calculationResults.monthlyPayment - (calculationResults.loanAmount / calculationResults.loanTerm);
        const loanToValue = (calculationResults.loanAmount / homePrice) * 100;
        const downPaymentRatio = (downPayment / homePrice) * 100;

        updateElement('monthlyPrincipal', formatCurrency(calculationResults.monthlyPayment - monthlyInterest));
        updateElement('monthlyInterest', formatCurrency(monthlyInterest));
        updateElement('loanToValue', loanToValue.toFixed(1));
        updateElement('downPaymentRatio', downPaymentRatio.toFixed(1));

        return calculationResults;
    }

    function generateAmortizationSchedule(calculationResults) {
        const schedule = [];
        let remainingBalance = calculationResults.loanAmount;
        let totalInterestPaid = 0;

        for (let month = 1; month <= calculationResults.loanTerm; month++) {
            const interestPayment = remainingBalance * calculationResults.monthlyRate;
            const principalPayment = calculationResults.monthlyPayment - interestPayment;
            remainingBalance = Math.max(0, remainingBalance - principalPayment);
            totalInterestPaid += interestPayment;

            schedule.push({
                month,
                payment: calculationResults.monthlyPayment,
                principal: principalPayment,
                interest: interestPayment,
                remainingBalance: remainingBalance,
                totalInterestPaid: totalInterestPaid
            });
        }

        return schedule;
    }

    async function generatePDF(calculationResults, schedule) {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            console.error('jsPDF not loaded');
            throw new Error('PDF generation library not loaded');
        }

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                precision: 2
            });

            // Brand colors from variables.css
            const primaryColor = [46, 125, 50];     // #2E7D32
            const primaryDark = [27, 94, 32];       // #1B5E20
            const primaryLight = [76, 175, 80];     // #4CAF50
            const grayLight = [248, 250, 248];      // #F8FAF8
            const grayDark = [18, 25, 18];         // #121912
            const grayMedium = [75, 85, 99];       // #4B5563
            const grayBorder = [232, 235, 232];    // #E8EBE8

            // Create gradient header
            const headerHeight = 40;
            const gradientSteps = 40; // More steps = smoother gradient
            const baseColor = [46, 125, 50]; // Primary green #2E7D32
            const darkColor = [27, 94, 32];  // Darker green #1B5E20

            for (let i = 0; i < gradientSteps; i++) {
                // Calculate color for this step
                const ratio = i / gradientSteps;
                const color = [
                    Math.round(baseColor[0] + (darkColor[0] - baseColor[0]) * ratio),
                    Math.round(baseColor[1] + (darkColor[1] - baseColor[1]) * ratio),
                    Math.round(baseColor[2] + (darkColor[2] - baseColor[2]) * ratio)
                ];
                
                // Draw a thin rectangle for this gradient step
                doc.setFillColor(...color);
                const y = (i * headerHeight) / gradientSteps;
                const height = headerHeight / gradientSteps + 0.5; // Slight overlap to prevent gaps
                doc.rect(0, y, doc.internal.pageSize.width, height, 'F');
            }

            // Add logo (you'll need to replace with your actual logo)
            doc.addImage('../assets/images/favicon-96x96.png', 'PNG', 15, 12, 16, 16);

            // Header text
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('Mortgage Calculator Report', 40, 18);

            // Add product tagline and URL
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Created on Fyenance - Your Privacy-First Financial Planning App', 40, 23);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.textWithLink('Get started at fyenanceapp.com', 40, 27, { url: 'https://fyenanceapp.com' });

            // Rest of the content starts lower to accommodate larger header
            doc.setTextColor(...grayDark);
            doc.setFontSize(16);
            doc.text('Your Mortgage Analysis', 15, 55);

            // Adjust all subsequent Y positions by +10 to account for larger header
            let yPos = 65;  // Starting position for metrics box

            // Key metrics box - More compact
            doc.setFillColor(...grayLight);
            doc.roundedRect(15, yPos, 180, 55, 3, 3, 'F');
            doc.setDrawColor(...primaryColor);
            doc.setLineWidth(0.5);
            doc.roundedRect(15, yPos, 180, 55, 3, 3, 'S');

            // Metrics with smaller fonts and tighter spacing
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            const metrics = [
                ['Monthly Payment', `$${formatCurrency(calculationResults.monthlyPayment)}`, 'Loan Amount', `$${formatCurrency(calculationResults.loanAmount)}`],
                ['Total Interest', `$${formatCurrency(calculationResults.totalInterest)}`, 'Interest Rate', `${calculationResults.interestRate}%`],
                ['Total Cost', `$${formatCurrency(calculationResults.totalPayment)}`, 'Loan Term', `${calculationResults.loanTerm / 12} years`],
                ['Monthly Interest', `$${formatCurrency(calculationResults.monthlyPayment - (calculationResults.loanAmount / calculationResults.loanTerm))}`, 
                 'Loan-to-Value', `${((calculationResults.loanAmount / (calculationResults.loanAmount + parseFloat(document.getElementById('downPayment').value))) * 100).toFixed(1)}%`]
            ];

            yPos += 8;
            metrics.forEach(row => {
                // Labels in gray
                doc.setTextColor(...grayMedium);
                doc.text(row[0], 25, yPos);
                doc.text(row[2], 120, yPos);
                
                // Values in dark color
                doc.setTextColor(...grayDark);
                doc.setFont('helvetica', 'bold');
                doc.text(row[1], 25, yPos + 5);
                doc.text(row[3], 120, yPos + 5);
                doc.setFont('helvetica', 'normal');
                
                yPos += 12;
            });

            // Key insights section
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...primaryColor);
            doc.text('Key Insights', 15, 130);

            const insights = [
                {
                    title: 'Payment Breakdown',
                    text: `Your monthly payment of $${formatCurrency(calculationResults.monthlyPayment)} consists of principal and interest. ` +
                          `In the first month, $${formatCurrency(calculationResults.monthlyPayment - (calculationResults.loanAmount / calculationResults.loanTerm))} goes to interest.`
                },
                {
                    title: 'Interest Impact',
                    text: `Over the full term, you'll pay $${formatCurrency(calculationResults.totalInterest)} in interest, ` +
                          `which is ${((calculationResults.totalInterest / calculationResults.loanAmount) * 100).toFixed(1)}% of your original loan amount.`
                },
                {
                    title: 'Early Payoff Strategy',
                    text: `Making an extra payment of $${formatCurrency(calculationResults.monthlyPayment)} once per year could save you approximately ` +
                          `$${formatCurrency(calculationResults.totalInterest * 0.08)} in interest over the life of your loan.`
                }
            ];
            yPos += 18;
            insights.forEach(insight => {
                // Draw insight box
                doc.setFillColor(...grayLight);
                doc.roundedRect(15, yPos - 5, 180, 22, 2, 2, 'F');
                
                // Add light gray border
                doc.setDrawColor(...grayBorder);
                doc.setLineWidth(0.1);
                doc.roundedRect(15, yPos - 5, 180, 22, 2, 2, 'S');
                
                // Title
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...primaryColor);
                doc.text(insight.title, 25, yPos + 2);
                
                // Content
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...grayDark);
                const lines = doc.splitTextToSize(insight.text, 155);
                doc.text(lines, 25, yPos + 9);
                
                yPos += 28;
            });

            // Smart Money Moves section
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...primaryColor);
            doc.text('Smart Money Moves', 15, yPos + 10);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...grayDark);
            const recommendations = [
                '• Consider making bi-weekly payments (26 half-payments per year) to reduce your loan term',
                '• Set up an emergency fund of 3-6 months of mortgage payments',
                '• Review your mortgage terms annually for refinancing opportunities',
                '• Consider mortgage insurance if your down payment is less than 20%'
            ];

            yPos += 20;
            recommendations.forEach(tip => {
                doc.text(tip, 20, yPos);
                yPos += 7;
            });

            // Start new page for amortization schedule
            doc.addPage();

            // Amortization schedule header
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...primaryColor);
            doc.text('Amortization Schedule', 15, 25);

            // Enhanced table styling
            if (typeof doc.autoTable === 'function') {
                await doc.autoTable({
                    startY: 35,
                    head: [['Payment #', 'Date', 'Payment', 'Principal', 'Interest', 'Remaining Balance']],
                    body: schedule.map(row => [
                        row.month,
                        formatDate(row.month),
                        `$${formatCurrency(row.payment)}`,
                        `$${formatCurrency(row.principal)}`,
                        `$${formatCurrency(row.interest)}`,
                        `$${formatCurrency(row.remainingBalance)}`
                    ]),
                    styles: {
                        fontSize: 8,
                        cellPadding: 3,
                        lineColor: grayBorder,
                        lineWidth: 0.1
                    },
                    headStyles: {
                        fillColor: primaryColor,
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        fontSize: 9
                    },
                    alternateRowStyles: {
                        fillColor: grayLight
                    },
                    margin: { top: 10, right: 15, bottom: 10, left: 15 },
                    tableWidth: 'auto'
                });
            }

            // Reset text color for the rest of the document
            doc.setTextColor(...grayDark);

            // Add footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(...grayMedium);
                doc.text(
                    `Generated by Fyenance App - Page ${i} of ${pageCount}`,
                    doc.internal.pageSize.width / 2,
                    doc.internal.pageSize.height - 10,
                    { align: 'center' }
                );
            }

            // Create blob and URL
            const pdfBlob = doc.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            
            return { blob: pdfBlob, url: pdfUrl };
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    }

    async function sendReport(email, calculationResults) {
        try {
            const sendReportButton = document.querySelector('#sendReport');
            sendReportButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
            sendReportButton.disabled = true;

            // Generate PDF
            const pdf = await generatePDF(calculationResults, fullSchedule);
            
            if (IS_TEST_MODE) {
                // Test mode: Just download the PDF
                const link = document.createElement('a');
                link.href = pdf.url;
                link.download = 'mortgage-schedule.pdf';
                link.click();
                
                sendReportButton.innerHTML = '<i class="fas fa-check"></i> PDF Downloaded!';
                sendReportButton.disabled = true;
                return;
            }

            // Production mode: Send to backend
            const formData = new FormData();
            formData.append('email', email);
            formData.append('pdf', pdf.blob, 'mortgage-schedule.pdf');
            formData.append('calculationResults', JSON.stringify(calculationResults));

            const response = await fetch('https://api.fyenanceapp.com/v1/send-mortgage-report', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to send report');
            }

            // Show success message
            sendReportButton.innerHTML = '<i class="fas fa-check"></i> Report Sent!';
            sendReportButton.disabled = true;

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
            const sendReportButton = document.querySelector('#sendReport');
            sendReportButton.innerHTML = '<i class="fas fa-envelope"></i> Send Report';
            sendReportButton.disabled = false;
        }
    }

    recalculateButton.addEventListener('click', () => {
        showStep(0);
        sendReportButton.innerHTML = '<i class="fas fa-envelope"></i> Send My Report';
        sendReportButton.disabled = false;
    });

    sendReportButton.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        if (!email) {
            alert('Please enter your email address');
            return;
        }

        sendReportButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        sendReportButton.disabled = true;

        const calculationResults = calculateMortgage();
        await sendReport(email, calculationResults);
    });

    // Input validation
    document.getElementById('homePrice').addEventListener('input', (e) => {
        const downPaymentInput = document.getElementById('downPayment');
        downPaymentInput.max = e.target.value;
    });

    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Update button states
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            // Update content visibility
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Pagination handlers
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateScheduleTable(fullSchedule, currentPage);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(fullSchedule.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateScheduleTable(fullSchedule, currentPage);
        }
    });

    // Search functionality
    document.getElementById('paymentSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredSchedule = fullSchedule.filter(row => 
            Object.values(row).some(value => 
                String(value).toLowerCase().includes(searchTerm)
            )
        );
        currentPage = 1;
        updateScheduleTable(filteredSchedule, currentPage);
    });

    // Year filter
    document.getElementById('yearFilter').addEventListener('change', (e) => {
        const selectedYear = e.target.value;
        const filteredSchedule = selectedYear === 'all' 
            ? fullSchedule 
            : fullSchedule.filter(row => Math.floor(row.month / 12) === parseInt(selectedYear) - 1);
        currentPage = 1;
        updateScheduleTable(filteredSchedule, currentPage);
    });
    

});




