// Cargar el contenido del modal dinámicamente desde modal.html
fetch('modal.html')
    .then(response => response.text())
    .then(data => {
        // Agregar el contenido del modal al body
        document.body.insertAdjacentHTML('beforeend', data);

        // Selección del modal y el botón de cerrar
        const modal = document.getElementById('modal');
        const closeModalButton = document.querySelector('.cerrar-modal');

        // Función para cerrar el modal
        function cerrarModal() {
            modal.classList.add('ocultar'); // Agregar la clase 'ocultar' para ocultar el modal
        }

        // Abrir el modal cuando se hace clic en el botón "Carrito"
        document.getElementById('boton-carrito').addEventListener('click', () => {
            modal.classList.remove('ocultar'); // Eliminar la clase 'ocultar', mostrando el modal
            mostrarCarritoEnModal(); // Mostrar los productos en el modal cuando se abre
        });

        // Cerrar el modal cuando se hace clic en el botón "X"
        closeModalButton.addEventListener('click', cerrarModal);

        // Cerrar el modal cuando se presiona la tecla ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                cerrarModal(); // Cerrar el modal cuando se presiona ESC
            }
        });
    })
    .catch(error => {
        console.error('Error al cargar modal.html:', error);
    });

// Cargar el carrito desde localStorage
function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    } else {
        carrito = [];
    }
}

// Actualizar el carrito en localStorage
function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarritoEnModal(); // Mostrar el carrito actualizado en el modal
}

// Función para mostrar los productos en el modal
function mostrarCarritoEnModal() {
    cargarCarritoDesdeLocalStorage(); // Asegurarse de cargar el carrito
    const modalCartList = document.getElementById('modal-cart-list');
    modalCartList.innerHTML = '';  // Limpiar el contenido anterior

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

    // Agregar eventos a los botones de eliminar y cantidad
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

    mostrarMensajeAgregado();  // Mostrar el mensaje de confirmación
    actualizarCarrito();  // Guardar el carrito actualizado en localStorage
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

// Función para eliminar un producto del carrito
function eliminarProductoDelCarrito(nombreProducto) {
    carrito = carrito.filter(item => item.producto.nombre !== nombreProducto);
    actualizarCarrito();  // Guardar el carrito actualizado en localStorage
}

// Función para actualizar la cantidad de un producto en el carrito
function actualizarCantidadProducto(nombreProducto, nuevaCantidad) {
    const productoEnCarrito = carrito.find(item => item.producto.nombre === nombreProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad = Math.max(nuevaCantidad, 1);
        actualizarCarrito();  // Guardar el carrito actualizado en localStorage
    }
}

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
