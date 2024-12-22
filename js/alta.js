function agregar(event) {
    event.preventDefault(); // Evita el envío del formulario

    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;
    const marca = document.getElementById('marca').value;
    const categoria = document.getElementById('categoria').value;
    const descripcion1 = document.getElementById('descripcion1').value;
    const descripcion2 = document.getElementById('descripcion2').value; // Captura la descripción larga
    const foto = document.getElementById('foto').value;
    const envio = document.getElementById('envio').checked;

    const edadDesde = parseInt(document.getElementById('edad-desde').value, 10); // Convertir a entero
    const edadHasta = parseInt(document.getElementById('edad-hasta').value, 10); // Convertir a entero

    // Comprobar si los campos de edad están vacíos
    if (isNaN(edadDesde) || isNaN(edadHasta)) {
        alert('Por favor, ingresa valores válidos para edad desde y hasta.');
        return;
    }

    const nuevoProducto = {
        nombre,
        precio,
        stock,
        marca,
        categoria,
        descripcion1,
        descripcion2,
        foto,
        envio,
        edadDesde,
        edadHasta
    };

    // Enviar el producto a MockAPI
    enviarProductoAAPI(nuevoProducto);

    // Agregar producto a la lista de productos locales
    productos.push(nuevoProducto);

    // Actualizar las vistas
    representarTablaProductos();
    representarCardsProductos();
}

function enviarProductoAAPI(producto) {
    fetch('https://6759b3c8099e3090dbe2a238.mockapi.io/Alta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Producto enviado exitosamente:', data);
        alert('Producto agregado correctamente');
        
        // Mostrar el mensaje "El formulario está enviado"
        const mensajeEnviado = document.getElementById('mensaje-enviado');
        mensajeEnviado.classList.remove('ocultar'); // Mostrar el mensaje
        
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
            mensajeEnviado.classList.add('ocultar'); // Ocultar el mensaje
        }, 3000);
    })
    .catch(error => {
        console.error('Error al enviar el producto:', error);
        alert('Hubo un error al agregar el producto');
    });
}
