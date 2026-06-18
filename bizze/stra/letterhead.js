document.addEventListener('DOMContentLoaded', () => {
    
    const downloadBtn = document.getElementById('download-letterhead-btn');
    const letterheadElement = document.getElementById('letterhead-container');

    downloadBtn.addEventListener('click', () => {
        
        // Remove the dashed border from the editable area before generating the PDF
        const editableArea = document.querySelector('.editable-content');
        editableArea.style.border = 'none';

        const originalText = downloadBtn.innerText;
        downloadBtn.innerText = "Generating A4 PDF...";
        downloadBtn.disabled = true;

        // Configure the PDF settings strictly for A4
        const opt = {
            margin:       0, // Margins are handled by the CSS padding of the container
            filename:     `Bizze_Letterhead_${new Date().getTime()}.pdf`,
            image:        { type: 'jpeg', quality: 1.0 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Trigger the download
        html2pdf().set(opt).from(letterheadElement).save().then(() => {
            // Restore button state and editable border
            downloadBtn.innerText = originalText;
            downloadBtn.disabled = false;
            editableArea.style.border = '1px dashed #edf1f7';
        }).catch(err => {
            console.error("PDF Generation Error: ", err);
            alert("Failed to generate Letterhead. Please try again.");
            downloadBtn.innerText = originalText;
            downloadBtn.disabled = false;
            editableArea.style.border = '1px dashed #edf1f7';
        });
    });
});
