var modal = document.getElementById('modal');
var botonCarrito = document.getElementById('boton-carrito');
var cerrarModal = document.querySelector('.cerrar-modal');

// Cuando se hace clic en "Carrito", se muestra la modal
botonCarrito.addEventListener('click', function() {
    modal.classList.remove('ocultar');  // Eliminar la clase "ocultar" para mostrar la modal
});

// Cuando se hace clic en el botón de cerrar, se oculta la modal
cerrarModal.addEventListener('click', function() {
    modal.classList.add('ocultar');  // Añadir la clase "ocultar" para esconder la modal
});
