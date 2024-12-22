// Función para cargar el carrito desde localStorage
function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        console.log("Varukorgen laddades från localStorage:", carrito); // För att verifiera
    } else {
        carrito = [];
    }
}

// Función para mostrar los productos en el carrito en el modal
function mostrarCarritoEnModal() {
    cargarCarritoDesdeLocalStorage();  // Asegúrate de que el carrito esté actualizado desde localStorage
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

// Función para actualizar el carrito en localStorage
function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log("Varukorgen sparades till localStorage:", carrito); // För att verifiera
    mostrarCarritoEnModal();  // Actualizar el modal con los productos del carrito
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

    actualizarCarrito();  // Guardar el carrito actualizado en localStorage
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

// Función para enviar el pedido al MockAPI
async function enviarPedidoAlAPI() {
    if (carrito.length === 0) {
        console.log("El carrito está vacío!");
        alert("Tu carrito está vacío. Agrega productos antes de enviar.");
        return;  // Evita enviar un pedido vacío
    }

    // Crear el pedido (pedido)
    const pedido = {
        productos: carrito.map(item => ({
            nombre: item.producto.nombre,
            cantidad: item.cantidad,
            precio: item.producto.precio
        })),
        total: carrito.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0),
        fecha: new Date().toISOString()  // Fecha actual en formato ISO
    };

    console.log("Enviando pedido:", pedido); // Log para verificar los datos

    const botonMandarPedido = document.getElementById('mandar-pedido');
    botonMandarPedido.disabled = true;  // Deshabilita el botón para evitar envíos duplicados

    try {
        const response = await fetch('https://6759b3c8099e3090dbe2a238.mockapi.io/Carrito', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)  // Envia el pedido al API
        });

        const data = await response.json();
        console.log("Respuesta de MockAPI:", data);

        if (response.ok) {
            alert('¡Tu pedido ha sido enviado con éxito!');
            carrito = [];  // Vacía el carrito
            actualizarCarrito();  // Actualiza el modal
            cerrarModalCarrito();  // Cierra el modal
        } else {
            alert('Hubo un error al enviar el pedido');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud', error);
        alert('Hubo un problema al enviar el pedido');
    } finally {
        botonMandarPedido.disabled = false;  // Habilita el botón nuevamente cuando la solicitud termine
    }
}

// Función principal de inicio
function start() {
    // Ladda varukorgen vid varje sidladdning
    cargarCarritoDesdeLocalStorage();
    mostrarCarritoEnModal(); // Visa uppdaterad varukorg i modalen

    const botonCarrito = document.getElementById('boton-carrito');
    botonCarrito.addEventListener('click', abrirModalCarrito);

    const cerrarModal = document.querySelector('.cerrar-modal');
    cerrarModal.addEventListener('click', cerrarModalCarrito);

    agregarEventosBotonesCarrito();

    // Lägg till event för att skicka beställningen till API
    const botonMandarPedido = document.getElementById('mandar-pedido');
    botonMandarPedido.addEventListener('click', function() {
        enviarPedidoAlAPI();
    });

    // Hantera formulär
    const formulario = document.getElementById('contacto-form');
    formulario.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const mail = document.getElementById('mail').value;
        const comentarios = document.getElementById('comentarios').value;

        console.log('Nombre:', nombre);
        console.log('Apellido:', apellido);
        console.log('Email:', mail);
        console.log('Comentarios:', comentarios);
    });
}

// Ejecutar la función de inicio cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', start);
