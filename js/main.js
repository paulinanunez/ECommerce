// Lista de productos
let productos = [
    { nombre: 'Producto 1', precio: 100, foto: 'ruta_imagen_1', stock: 10 },
    { nombre: 'Producto 2', precio: 200, foto: 'ruta_imagen_2', stock: 5 },
    { nombre: 'Producto 3', precio: 300, foto: 'ruta_imagen_3', stock: 2 }
];

// Carrito inicializado vacío
let carrito = [];

// Función para cargar el carrito desde localStorage
function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    } else {
        carrito = [];
    }
}

function mostrarMensajeAgregado() {
    alert("Producto agregado al carrito!");
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

    // Guardar carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    mostrarMensajeAgregado(); 
    actualizarModalCarrito(); 
}

function actualizarCantidadProducto(nombreProducto, nuevaCantidad) {
    const productoEnCarrito = carrito.find(item => item.producto.nombre === nombreProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad = Math.max(nuevaCantidad, 1);
        // Guardar carrito actualizado en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarModalCarrito();
    }
}


function eliminarProductoDelCarrito(nombreProducto) {
    carrito = carrito.filter(item => item.producto.nombre !== nombreProducto);
    // Guardar carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarModalCarrito();
}


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

// Función para representar los productos (para agregar al carrito desde la página)
function representarCardsProductos() {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';
    productos.forEach((producto, index) => {
        contenedor.innerHTML += `
            <div class="producto">
                <img src="${producto.foto}" alt="Imagen de ${producto.nombre}" class="img-producto">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <button onclick="agregarProductoAlCarrito(${index})">Agregar al carrito</button>
            </div>
        `;
    });
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarCarritoDesdeLocalStorage(); 
    representarCardsProductos(); 
    actualizarModalCarrito(); 
});
