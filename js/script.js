// Espera a que el documento HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    // Obtén todos los elementos de entrada de cantidad y valor unitario
    const cantidadInputs = document.querySelectorAll('input[name^="cantidad"]');
    const vunitInputs = document.querySelectorAll('input[name^="vunit"]');
    const vtotalOutputs = document.querySelectorAll('input[name^="vtotal"]');
    
    // Agrega un event listener a cada campo de cantidad y valor unitario
    cantidadInputs.forEach((input, index) => {
        input.addEventListener("input", () => {
            // Obtiene el valor de cantidad y valor unitario en este índice
            const cantidad = parseFloat(input.value) || 0;
            const vunit = parseFloat(vunitInputs[index].value) || 0;
            
            // Calcula el valor total
            const vtotal = cantidad * vunit;
            
            // Actualiza el valor total en el campo correspondiente
            vtotalOutputs[index].value = vtotal.toFixed(2); // Redondea a 2 decimales
            
            // Actualiza los totales generales
            updateTotals();
        });
        
        // Agrega un event listener a cada campo de valor unitario
        vunitInputs[index].addEventListener("input", () => {
            // Obtiene el valor de cantidad y valor unitario en este índice
            const cantidad = parseFloat(input.value) || 0;
            const vunit = parseFloat(vunitInputs[index].value) || 0;
            
            // Calcula el valor total
            const vtotal = cantidad * vunit;
            
            // Actualiza el valor total en el campo correspondiente
            vtotalOutputs[index].value = vtotal.toFixed(2); // Redondea a 2 decimales
            
            // Actualiza los totales generales
            updateTotals();
        });
    });
    
    // Función para actualizar los totales generales
    function updateTotals() {
        // Inicializa las variables de totales
        let subtotal12 = 0;
        let subtotal0 = 0;
        let descuento = 0; // Puedes calcular el descuento si es necesario
        let totalUsd = 0;
        
        // Recorre los campos de valor total y suma los valores
        vtotalOutputs.forEach(output => {
            const vtotal = parseFloat(output.value) || 0;
            
            if (vtotal > 0) {
                if (parseFloat(output.getAttribute("data-tax")) === 12) {
                    subtotal12 += vtotal;
                } else {
                    subtotal0 += vtotal;
                }
            }
        });
        
        // Calcula el subtotal sumando los subtotales 12% y 0%
    const subtotal = (subtotal12 + subtotal0 - descuento).toFixed(2);

    // Calcula el IVA 12% en base al subtotal 12%
    const iva12 = (subtotal12 * 0.12).toFixed(2);

    // Calcula el total en USD sumando el subtotal y el IVA 12%
    totalUsd = (parseFloat(subtotal) + parseFloat(iva12)).toFixed(2);

    // Actualiza los campos de totales en la página
    document.getElementById("subtotal12").textContent = subtotal12.toFixed(2);
    document.getElementById("subtotal0").textContent = subtotal0.toFixed(2);
    document.getElementById("descuento").textContent = descuento.toFixed(2);
    document.getElementById("subtotal").textContent = subtotal;
    document.getElementById("iva12").textContent = iva12;
    document.getElementById("total-usd").textContent = totalUsd;
}

// Llama a la función para calcular y actualizar los totales iniciales
updateTotals();
    
    // Agrega un event listener al botón de reset
    const resetBtn = document.getElementById("reset-btn");
    resetBtn.addEventListener("click", function() {
        // Limpia todos los campos de cantidad, valor unitario y valor total
        cantidadInputs.forEach(input => (input.value = ""));
        vunitInputs.forEach(input => (input.value = ""));
        vtotalOutputs.forEach(output => (output.value = "0.00"));
        // Llama a la función para actualizar los totales para establecerlos en cero
        updateTotals();
    });
});


// Agrega un event listener al botón de descargar
const descargarBtn = document.getElementById("descargar-btn");
descargarBtn.addEventListener("click", function() {
    // Crea un nuevo objeto jsPDF
    const pdf = new jsPDF();

    // Define el contenido que deseas agregar al PDF
    const contenido = document.querySelector(".container");

    // Convierte el contenido HTML a una imagen base64 usando html2canvas
    html2canvas(contenido).then(canvas => {
        // Agrega la imagen al PDF
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        pdf.addImage(imgData, "JPEG", 0, 0);

        // Descarga el PDF con un nombre de archivo
        pdf.save("factura.pdf");
    });
});

