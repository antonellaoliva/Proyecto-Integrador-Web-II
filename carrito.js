            document.addEventListener('DOMContentLoaded', () => {
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            const DOMcarrito = document.querySelector('#carrito');
            const DOMtotal = document.querySelector('#total');
            const DOMbotonVaciar = document.querySelector('#boton-vaciar');
            const DOMbotonComprar = document.querySelector('#boton-comprar');

            function renderizarCarrito() {
                DOMcarrito.innerHTML = '';
                carrito.forEach((item) => {
                    const miNodo = document.createElement('li');
                    miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
                    
                    const imagen = document.createElement('img');
                    imagen.src = item.image; 
                    imagen.alt = item.title; 
                    imagen.classList.add('carrito-imagen');
                    miNodo.appendChild(imagen);

                    const textoProducto = document.createElement('span');
                    textoProducto.textContent = `${item.title} x ${item.cantidad} - $${(item.price * item.cantidad).toFixed(2)}`;
                    miNodo.appendChild(textoProducto);

                    const miBotonEliminar = document.createElement('button');
                    miBotonEliminar.classList.add('btn', 'btn-danger', 'mx-2');
                    miBotonEliminar.textContent = 'Eliminar';
                    miBotonEliminar.addEventListener('click', () => {
                        eliminarProducto(item.id);
                    });

                    const miBotonMas = document.createElement('button');
                    miBotonMas.classList.add('btn', 'btn-primary', 'mx-2');
                    miBotonMas.textContent = '+';
                    miBotonMas.addEventListener('click', () => {
                        aumentarCantidad(item.id);
                    });

                    const miBotonMenos = document.createElement('button');
                    miBotonMenos.classList.add('btn', 'btn-primary', 'mx-2');
                    miBotonMenos.textContent = '-';
                    miBotonMenos.addEventListener('click', () => {
                        disminuirCantidad(item.id);
                    });

                    miNodo.appendChild(miBotonEliminar);
                    miNodo.appendChild(miBotonMas);
                    miNodo.appendChild(miBotonMenos);
                    DOMcarrito.appendChild(miNodo);
                });
                DOMtotal.textContent = calcularTotal();
                
            }

            function calcularTotal() {
                let total = 0;
                carrito.forEach((item) => {
                    total += item.price * item.cantidad;
                });
                return total.toFixed(2);
            }

            function vaciarCarrito() {
                localStorage.removeItem('carrito');
                carrito = [];
                renderizarCarrito();
            }

            function eliminarProducto(id) {
                carrito = carrito.filter((item) => item.id !== id);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                renderizarCarrito();
            }

            function aumentarCantidad(id) {
                const producto = carrito.find((item) => item.id === id);
                producto.cantidad++;
                localStorage.setItem('carrito', JSON.stringify(carrito));
                renderizarCarrito();
            }

            function disminuirCantidad(id) {
                const producto = carrito.find((item) => item.id === id);
                if (producto.cantidad > 1) {
                    producto.cantidad--;
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    renderizarCarrito();
                }
            }
    

            renderizarCarrito();

            function comprar() {
                fetch('http://127.0.0.1:3000/compra', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(carrito)
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.mensaje);
                    
                    vaciarCarrito();
                })
                .catch(error => {
                    console.error('Error al enviar la compra al servidor:', error);
                });
            }

            DOMbotonVaciar.addEventListener('click', vaciarCarrito);
            DOMbotonComprar.addEventListener('click', comprar);
        });
   