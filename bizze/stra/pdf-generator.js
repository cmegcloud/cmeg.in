document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Session Verification & Data Injection
    const userName = sessionStorage.getItem("userName") || "System Admin";
    
    // Inject the name of the staff member who generated the bill
    document.getElementById('bill-generated-by').innerText = userName;
    document.getElementById('bill-generated-time').innerText = new Date().toLocaleString();

    // 2. PDF Generation Logic
    const downloadBtn = document.getElementById('download-pdf-btn');
    const invoiceElement = document.getElementById('invoice-container');

    downloadBtn.addEventListener('click', () => {
        
        // Temporarily change button state to show progress
        const originalText = downloadBtn.innerText;
        downloadBtn.innerText = "Generating...";
        downloadBtn.disabled = true;

        // Configure the PDF settings
        const opt = {
            margin:       0.5,
            filename:     `Bizze_Bill_PAT839201.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Trigger the download
        html2pdf().set(opt).from(invoiceElement).save().then(() => {
            // Restore button state after download completes
            downloadBtn.innerText = originalText;
            downloadBtn.disabled = false;
        }).catch(err => {
            console.error("PDF Generation Error: ", err);
            alert("Failed to generate PDF. Please try again.");
            downloadBtn.innerText = originalText;
            downloadBtn.disabled = false;
        });
    });
});
