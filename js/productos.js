var productos = [
    { 
        nombre: 'Vestido negro', 
        precio: 77000, 
        stock: 44, 
        marca: 'Lily Phellera', 
        categoria: 'Vestidos', 
        envio: true, 
        foto: 'https://res.cloudinary.com/wolfandbadger/image/upload/s--l4hF7K42--/q_auto:eco/products/nora-strap-maxi-dress-with-open-back-in-midnight-black__66d1fb551459e0ffdf9a4f90d9bd9d69',
        descripcionCorta: 'Elegante vestido de noche en color negro.',
        descripcionLarga: 'Este vestido negro es perfecto para ocasiones especiales. Su diseño elegante lo convierte en una opción ideal para cualquier evento nocturno.' // Descripción larga agregada
    },
    { 
        nombre: 'Tacones plateados', 
        precio: 64000, 
        stock: 32, 
        marca: 'UP2STEP', 
        categoria: 'Zapatos', 
        envio: true, 
        foto: 'https://es.up2step.com/media/catalog/product/cache/6a6d315cae86edd96c1befecf2b28a4c/s/l/sliver_sequined_wedding_2_.jpg',
        descripcionCorta: 'Tacones brillantes perfectos para eventos especiales.',
        descripcionLarga: 'Tacones de alta calidad con brillo. Perfectos para combinar con cualquier outfit elegante.' // Descripción larga agregada
    },
    { 
        nombre: 'Aros de plata', 
        precio: 84000, 
        stock: 103, 
        marca: 'Lilly & Rose', 
        categoria: 'Joyas', 
        envio: true, 
        foto: 'https://arthurgulddesign.se/wp-content/uploads/2023/02/63061.jpg',
        descripcionCorta: 'Aros elegantes de Sterling silver 925 para cualquier ocasión.',
        descripcionLarga: 'Estos aros de plata son un clásico que nunca pasa de moda. Perfectos para añadir un toque de elegancia a cualquier look.' // Descripción larga agregada
    },
    { 
        nombre: 'Collar de plata', 
        precio: 72000, 
        stock: 21, 
        marca: 'Mery Satt', 
        categoria: 'Joyas', 
        envio: true, 
        foto: 'https://merysattjoyas.cl/wp-content/uploads/2022/09/99-3-2-341897-scaled-600x600.jpg',
        descripcionCorta: 'Collar delicado de Sterling silver 925, ideal para regalar.',
        descripcionLarga: 'Este collar delicado es perfecto para un regalo especial. Su diseño elegante lo hace adecuado para cualquier ocasión.' // Descripción larga agregada
    },
    { 
        nombre: 'Bolso negro de cuero', 
        precio: 93000, 
        stock: 20, 
        marca: 'Furla', 
        categoria: 'Bolsos', 
        envio: true, 
        foto: 'https://images.furla.com/public/edited/jpg/bags/furla-1927/mini/nero/WB00109_ARE000_1007_O6000_M1.jpg?im=Resize%3D%28375%2C375%29&format=webp&quality=high',
        descripcionCorta: 'Bolso de cuero negro, clásico y versátil.',
        descripcionLarga: 'Un bolso de cuero negro que combina con cualquier atuendo. Su diseño atemporal lo convierte en una elección perfecta para el día a día.' // Descripción larga agregada
    },
];

// Función para representar la tabla de productos
function representarTablaProductos() {
    var filasTabla = '';

    if (productos.length) {
        filasTabla += `
            <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Marca</th>
                <th>Categoría</th>
                <th>Descripción Corta</th>
                <th>Descripción Larga</th> <!-- Agregar encabezado para la descripción larga -->
                <th>Foto</th>
                <th>Envío</th>
            </tr>
        `;

        for (var i = 0; i < productos.length; i++) {
            var producto = productos[i];
            filasTabla += `
                <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.marca}</td>
                    <td>${producto.categoria}</td>
                    <td>${producto.descripcionCorta}</td> <!-- Mostrar descripción corta -->
                    <td>${producto.descripcionLarga}</td> <!-- Mostrar descripción larga -->
                    <td><img src="${producto.foto}" alt="Foto de ${producto.nombre} ${producto.marca}"></td>
                    <td>${producto.envio ? 'Sí' : 'No'}</td>
                </tr>
            `;
        }
    } else {
        filasTabla += '<tr><td colspan="9">No se encontraron productos para mostrar</td></tr>';
    }

    document.getElementById('tabla-productos').innerHTML = filasTabla;
}

// Llama a la función para que se represente la tabla al cargar la página
representarTablaProductos();
