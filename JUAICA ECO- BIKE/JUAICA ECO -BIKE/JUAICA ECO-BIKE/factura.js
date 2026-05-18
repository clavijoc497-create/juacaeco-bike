function descargarPDF() {
    setTimeout(function() {
        const elemento = document.querySelector('#facturaModal .modal-content');
        if (elemento) {
            html2pdf().set({
                margin: 0.5,
                filename: 'factura_juaica.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            }).from(elemento).save();
        } else {
            alert("No se encontró la factura");
        }
    }, 500);
}

document.addEventListener('DOMContentLoaded', function() {
    const btnPDF = document.getElementById('btnDescargarPDF');
    if (btnPDF) {
        btnPDF.onclick = descargarPDF;
    }
    function descargarFactura() {
    const elemento = document.querySelector('#facturaModal .modal-content');
    if (elemento) {
        html2pdf().from(elemento).save();
    }
}
});