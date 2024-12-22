
// Array para almacenar el carrito de compras
let carrito = [];

// Función para representar las cards de productos en la página de inicio
function representarCardsProductos() {
    let cards = '';

    if (productos.length) {
        cards = productos.map((producto, i) => ` 
            <section>
                <h3>${producto.nombre}</h3>
                <img src="${producto.foto}" alt="foto de ${producto.nombre} ${producto.marca}">
                <p><b>Precio:</b> $${producto.precio}</p>
                <p><b>Marca:</b> ${producto.marca}</p>
                <p><b>Categoría:</b> ${producto.categoria}</p>
                <p><b>Descripción Corta:</b> ${producto.descripcionCorta}</p>
                <p><b>Stock:</b> ${producto.stock}</p>
                <p><b>Envío:</b> ${producto.envio ? 'Sí' : 'No'}</p>
                <button class="add-to-cart-btn" data-index="${i}">Añadir al carrito</button>
            </section>
        `).join('');
    } else {
        cards = '<h2>No se encontraron productos para mostrar</h2>';
    }

    const sectionCardsBody = document.getElementsByClassName('section-cards-body')[0];
    sectionCardsBody.innerHTML = cards;

    agregarEventosBotonesCarrito();
}

// Función para agregar productos al carrito
function agregarProductoAlCarrito(index) {
    const producto = productos[index];
    const productoEnCarrito = carrito.find(item => item.producto.nombre === producto.nombre);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({
            producto,
            cantidad: 1
        });
    }

    mostrarMensajeAgregado(); // Mostrar el mensaje de confirmación
    actualizarModalCarrito();
}

// Función para mostrar el mensaje de que el producto se ha agregado al carrito
function mostrarMensajeAgregado() {
    const mensaje = document.getElementById('mensaje-confirmacion');
    mensaje.classList.remove('ocultar');  // Mostrar el mensaje

    // Ocultar el mensaje después de 2 segundos
    setTimeout(() => {
        mensaje.classList.add('ocultar');  // Ocultar el mensaje
    }, 2000);
}

// Función para actualizar el modal con los productos del carrito
function actualizarModalCarrito() {
    const modalCartList = document.getElementById('modal-cart-list');
    modalCartList.innerHTML = '';

    let total = 0;

    carrito.forEach(item => {
        const producto = item.producto;
        const cantidad = item.cantidad;
        const subtotal = producto.precio * cantidad;
        total += subtotal;

        modalCartList.innerHTML += `
            <li>
                <div>
                    <img src="${producto.foto}" alt="foto de ${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover;">
                    <span>${producto.nombre}</span>
                    <span>$${producto.precio}</span>
                    <label for="cantidad-${producto.nombre}">Cantidad:</label>
                    <input 
                        type="number" 
                        id="cantidad-${producto.nombre}" 
                        value="${cantidad}" 
                        min="1" 
                        max="${producto.stock}" 
                        class="cantidad-item" 
                        data-producto="${producto.nombre}">
                    <span>Subtotal: $${subtotal}</span>
                    <button class="remove-item" data-name="${producto.nombre}">Eliminar</button>
                </div>
            </li>
        `;
    });

    const modalFooter = document.getElementById('modal-cart-total');
    modalFooter.innerHTML = `<p>Total: $${total}</p>`;

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const nombreProducto = e.target.getAttribute('data-name');
            eliminarProductoDelCarrito(nombreProducto);
        });
    });

    document.querySelectorAll('.cantidad-item').forEach(input => {
        input.addEventListener('input', (e) => {
            const nombreProducto = e.target.getAttribute('data-producto');
            const nuevaCantidad = parseInt(e.target.value);
            actualizarCantidadProducto(nombreProducto, nuevaCantidad);
        });
    });
}

// Función para actualizar la cantidad de un producto en el carrito
function actualizarCantidadProducto(nombreProducto, nuevaCantidad) {
    const productoEnCarrito = carrito.find(item => item.producto.nombre === nombreProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad = Math.max(nuevaCantidad, 1);
        actualizarModalCarrito();
    }
}

// Función para eliminar un producto del carrito
function eliminarProductoDelCarrito(nombreProducto) {
    carrito = carrito.filter(item => item.producto.nombre !== nombreProducto);
    actualizarModalCarrito();
}

// Función para abrir el modal del carrito
function abrirModalCarrito() {
    const modal = document.getElementById('modal');
    modal.classList.remove('ocultar');
}

// Función para cerrar el modal
function cerrarModalCarrito() {
    const modal = document.getElementById('modal');
    modal.classList.add('ocultar');
}

// Función para agregar eventos a los botones "Añadir al carrito"
function agregarEventosBotonesCarrito() {
    const botones = document.querySelectorAll('.add-to-cart-btn');
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            agregarProductoAlCarrito(index);
        });
    });
}


async function enviarPedidoAlAPI() {
    if (carrito.length === 0) {
        console.log("Varukorgen är tom!");
        alert("Din varukorg är tom. Lägg till produkter innan du skickar.");
        return;  
    }

  //(pedido)
    const pedido = {
        productos: carrito.map(item => ({
            nombre: item.producto.nombre,
            cantidad: item.cantidad,
            precio: item.producto.precio
        })),
        total: carrito.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0),
        fecha: new Date().toISOString()  
    };

    console.log("Skickar beställning:", pedido); 

    const botonMandarPedido = document.getElementById('mandar-pedido');
    botonMandarPedido.disabled = true; 

    try {
        const response = await fetch('https://6759b3c8099e3090dbe2a238.mockapi.io/Carrito', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido) 
        });

        const data = await response.json();
        console.log("Svar från MockAPI:", data);

        if (response.ok) {
            alert('¡Tu pedido ha sido enviado con éxito!');
            carrito = []; 
            actualizarModalCarrito();  
            cerrarModalCarrito();  
        } else {
            alert('Hubo un error al enviar el pedido');
        }
    } catch (error) {
        console.error('Fel vid begäran', error);
        alert('Hubo un problema al enviar el pedido');
    } finally {
        botonMandarPedido.disabled = false; 
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const botonMandarPedido = document.getElementById('mandar-pedido');
    botonMandarPedido.addEventListener('click', function() {
        
        enviarPedidoAlAPI();
    });
});

// Función principal de inicio
function start() {
    representarCardsProductos();

    const botonCarrito = document.getElementById('boton-carrito');
    botonCarrito.addEventListener('click', abrirModalCarrito);

    const cerrarModal = document.querySelector('.cerrar-modal');
    cerrarModal.addEventListener('click', cerrarModalCarrito);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarModalCarrito();
        }
    });

    // Inicialmente ocultar el mensaje de confirmación
    const mensaje = document.getElementById('mensaje-confirmacion');
    mensaje.classList.add('ocultar');
}

// Ejecutar la función de inicio cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', start);
