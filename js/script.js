// Espera a que el documento HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    // Obtener elementos para la carga del logo de la empresa
    const logoUploadInput = document.getElementById('logo-upload');
    const uploadedLogo = document.getElementById('uploaded-logo');
    const removeLogoButton = document.getElementById('remove-logo');
    const logoLabel = document.querySelector('.logo-label');

    // Obtén todos los elementos de entrada de cantidad y valor unitario
    const cantidadInputs = document.querySelectorAll('input[name^="cantidad"]');
    const vunitInputs = document.querySelectorAll('input[name^="vunit"]');
    const vtotalOutputs = document.querySelectorAll('input[name^="vtotal"]');
    const detalleCompra = document.querySelectorAll('input[name^="detalle"]');

    // Escuchar cambios en el input de carga de archivos
    logoUploadInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            // Mostrar la imagen cargada
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadedLogo.src = e.target.result;
                uploadedLogo.style.display = 'block';
                removeLogoButton.style.display = 'block';
                logoLabel.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Manejar la eliminación del logo
    removeLogoButton.addEventListener('click', function () {
        uploadedLogo.src = '';
        uploadedLogo.style.display = 'none';
        removeLogoButton.style.display = 'none';
        logoUploadInput.value = ''; // Restablecer el valor del input de carga de archivos
        logoLabel.style.display = 'block';
    });

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
    resetBtn.addEventListener("click", function () {
 
        // Limpia todos los campos de entrada en la información de la empresa
        document.getElementById("company-name").value = "";
        document.getElementById("company-ruc").value = "";
        document.getElementById("company-address").value = "";
        document.getElementById("company-region").value = "";

        // Limpia los campos de número de factura y autorización
        document.getElementById("invoice-number-input").value = "";
        document.getElementById("authorization-input").value = "";

        // Limpia todos los campos de entrada del cliente
        document.getElementById("cliente").value = "";
        document.getElementById("cliente-ruc").value = "";
        document.getElementById("cliente-telefono").value = "";
        document.getElementById("cliente-direccion").value = "";

        // Limpia todos los campos de cantidad, valor unitario y valor total
        cantidadInputs.forEach(input => (input.value = ""));
        vunitInputs.forEach(input => (input.value = ""));
        vtotalOutputs.forEach(output => (output.value = ""));
        detalleCompra.forEach(output => (output.value = ""));
        // Llama a la función para actualizar los totales para establecerlos en cero
        updateTotals();
    });
});
