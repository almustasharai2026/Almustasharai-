// Downloads functionality
document.addEventListener('DOMContentLoaded', function() {
    // PDF Download
    document.addEventListener('click', function(e) {
        if (e.target.id === 'download-pdf') {
            e.preventDefault();
            downloadPDF();
        }
    });

    // Word Download
    document.addEventListener('click', function(e) {
        if (e.target.id === 'download-word') {
            e.preventDefault();
            downloadWord();
        }
    });
});

function downloadPDF() {
    const content = document.getElementById('document-content');
    if (!content) return;

    // Simple text-based PDF (in a real app, use jsPDF library)
    const text = content.textContent || content.innerText;
    const blob = new Blob([text], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadWord() {
    const content = document.getElementById('document-content');
    if (!content) return;

    // Simple text-based Word document
    const text = content.textContent || content.innerText;
    const blob = new Blob([text], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

المادة الثانية: موضوع العقد
[وصف موضوع العقد]

التاريخ: ${new Date().toLocaleDateString('ar')}
            `;

            const blob = new Blob([content], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'contract.doc';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
});