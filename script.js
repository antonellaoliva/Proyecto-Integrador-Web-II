document.addEventListener('DOMContentLoaded', () => {
    const DOMitems = document.querySelector('#items');
    let carrito = []; 
    let productosConDescuento = [];


    async function obtenerProductos() {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    }


    async function obtenerProductosConDescuento() {
        try {
            const response = await fetch('http://localhost:3000/descuentos'); 
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener productos con descuento:', error);
        }
    }

    
    async function traducirProductos(productos) {
        try {
            const productosTraducidos = await Promise.all(
                productos.map(async (producto) => {
                    const response = await fetch(`http://localhost:3000/traducir?title=${encodeURIComponent(producto.title)}&description=${encodeURIComponent(producto.description)}`);
                    const data = await response.json();
                    return { ...producto, title: data.title, description: data.description };
                })
            );
            return productosTraducidos;
        } catch (error) {
            console.error('Error al traducir productos:', error);
            return [];
        }
    }

    async function renderizarProductos(productos, productosConDescuento) {
        const productosTraducidos = await traducirProductos(productos);
        productosTraducidos.forEach((producto) => {


            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-md-3', 'col-sm-6', 'mb-4');

            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('card-img-top');
            miNodoImagen.setAttribute('src', producto.image);
            miNodoImagen.setAttribute('alt', producto.title);

             
            const productoConDescuento = productosConDescuento.find((descuento) => descuento.id === producto.id);
            if (productoConDescuento) {
            const bandaDeOferta = document.createElement('div');
            bandaDeOferta.classList.add('banda-oferta');
            bandaDeOferta.textContent = 'Oferta';
            miNodo.appendChild(bandaDeOferta);
             }

            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = producto.title;

            const miNodoDescription = document.createElement('p');
            miNodoDescription.classList.add('card-text', 'card-description');
            miNodoDescription.textContent = producto.description.slice(0, 30); 

            miNodoDescription.addEventListener('mouseover', () => {
                miNodoDescription.textContent = producto.description; 
            });

            miNodoDescription.addEventListener('mouseleave', () => {
                miNodoDescription.textContent = producto.description.slice(0, 30); 
            });

            const miNodoCategoria = document.createElement('p');
            miNodoCategoria.classList.add('card-text');
            miNodoCategoria.textContent = `Categoría: ${producto.category}`;

            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');

            aplicarDescuento(producto, productosConDescuento, miNodoCardBody); 

            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Agregar al Carrito';
            miNodoBoton.addEventListener('click', () => {
                
                agregarAlCarrito(producto);
            });

            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoDescription);
            miNodoCardBody.appendChild(miNodoCategoria);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);

            DOMitems.appendChild(miNodo);
        });
    }

        const aplicarDescuento = (producto, productosConDescuento, nodoCardBody) => {
        const productoConDescuento = productosConDescuento.find((descuento) => descuento.id === producto.id);

            if (productoConDescuento) {
            const montoDescontado = producto.price * (productoConDescuento.descuento / 100);
            
            const precioFinal = producto.price - montoDescontado;

            
                if (!isNaN(precioFinal) && isFinite(precioFinal) && precioFinal >= 0) {
                
                const nodoDescuento = document.createElement('p');
                nodoDescuento.classList.add('card-text', 'descuento');
                nodoDescuento.textContent = `Precio: $${producto.price.toFixed(2)} Descuento: ${productoConDescuento.descuento}% ($${montoDescontado.toFixed(2)}) Precio final: $${precioFinal.toFixed(2)}`;

                nodoCardBody.appendChild(nodoDescuento);
                } else {
                console.error('Error al calcular el precio final:', precioFinal);
            }
                } else {
            
            const nodoPrecio = document.createElement('p');
            nodoPrecio.classList.add('card-text');
            nodoPrecio.textContent = `Precio: $${producto.price.toFixed(2)}`;

            nodoCardBody.appendChild(nodoPrecio);
        }
    }

    Promise.all([obtenerProductos(), obtenerProductosConDescuento()])
        .then(([productos, descuentos]) => {
            
            productosConDescuento = descuentos;

            renderizarProductos(productos, productosConDescuento);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        

    function agregarAlCarrito(producto) {
        const productoExistenteIndex = carrito.findIndex((item) => item.id === producto.id);

        if (productoExistenteIndex !== -1) {
        carrito[productoExistenteIndex].cantidad++;
        } else {
        producto.cantidad = 1;

    const productoConDescuento = productosConDescuento.find((descuento) => descuento.id === producto.id);
        if (productoConDescuento) {
    
    const montoDescontado = producto.price * (productoConDescuento.descuento / 100);
    
    const precioFinal = producto.price - montoDescontado;
    producto.price = precioFinal;
}

        carrito.push(producto);
         }

         const DOMcontadorCarrito = document.querySelector('#contador-carrito');
         DOMcontadorCarrito.textContent = parseInt(DOMcontadorCarrito.textContent) + 1;

        localStorage.setItem('carrito', JSON.stringify(carrito));
         }

});

