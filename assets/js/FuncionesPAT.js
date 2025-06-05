// Menú desplegable para móviles
function inicializarMenuHamburguesa() {
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.getElementById('nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', function () {
            navLinks.classList.toggle('show');
        });
    }
}
document.addEventListener("DOMContentLoaded", inicializarMenuHamburguesa);

// Mostrar botones según la cuenta guardada
function controlarBotonesDeSesion() {
    const cuenta = JSON.parse(localStorage.getItem("cuenta"));

    if (cuenta) {
        const logoutBtn = document.getElementById('logout-btn-item');
        if (logoutBtn) logoutBtn.style.display = "block";

        if (cuenta.Rol == 'Administrador') {
            const adminBtn = document.getElementById('admin-btn-item');
            if (adminBtn) adminBtn.style.display = "block";
        }
    }
}

// Conectar evento de logout
function asignarCierreSesion() {
    const btnLogout = document.getElementById('logout-btn');
    if (btnLogout) {
        btnLogout.addEventListener('click', function () {
            localStorage.removeItem("cuenta");
            alert("Gracias por usar la aplicación. ¡Hasta luego!");
            window.location.href = "login.html";
        });
    }
}


const carouselIndices = {};
/*Carrousel Productos */
function moveCarousel(id, direction) {
    const carousel = document.getElementById(`carousel-${id}`);
    const images = carousel.querySelectorAll('.carousel-image');
    const total = images.length;

    // Init index for this carousel if needed
    if (!(id in carouselIndices)) carouselIndices[id] = 0;

    carouselIndices[id] += direction;

    if (carouselIndices[id] < 0) carouselIndices[id] = total - 1;
    if (carouselIndices[id] >= total) carouselIndices[id] = 0;

    const offset = carouselIndices[id] * images[0].clientWidth;
    carousel.style.transform = `translateX(-${offset}px)`;
}
/*Funcion Añadir al carrito*/
function addToCart(id, name, price, urlimg) {
    const qtyInput = document.getElementById(`qty-${id}`);
    const quantity = parseInt(qtyInput.value);
    const qtyStock = document.getElementById(`stock-${id}`);
    const stock = parseInt(qtyStock.textContent.trim());


    if (isNaN(quantity) || quantity < 1) {
        alert("Por favor ingresa una cantidad válida.");
        return;
    }
    if (quantity > stock) {
        alert("No se pudo agregar al carrito. Cantidad seleccionada mayor al stock disponible.");
        return;
    }

    const cartItem = {
        idProducto: id,
        nombre: name,
        precio: price,
        cantidad: quantity,
        imagen: urlimg
    };

    // Obtener carrito existente o crear uno nuevo
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Verificar si el producto ya existe
    const index = carrito.findIndex(p => p.idProducto === id);
    if (index !== -1) {
        carrito[index].cantidad += quantity;
    } else {
        carrito.push(cartItem);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`"${name}" agregado al carrito (${quantity}).`);
}
/*Funcion calcular totales mi carrito */
document.addEventListener("DOMContentLoaded", function () {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const container = document.getElementById("carrito-container");
    const summary = document.getElementById("carrito-summary");
    const subtotalEl = document.getElementById("subtotal");
    const ivaEl = document.getElementById("iva");
    const totalEl = document.getElementById("total");

    if (carrito.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>Tu carrito está vacío.</p>";
        summary.style.display = "none";
        return;
    }

    container.innerHTML = "";  // limpiar contenedor para evitar duplicados

    let subtotal = 0;

    carrito.forEach((p, index) => {
        const item = document.createElement("div");
        item.className = "carrito-item";

        // Imagen
        const imagen = document.createElement("img");
        imagen.src = p.imagen || "/images/default-placeholder.png";
        item.appendChild(imagen);

        // Info y cantidad editable
        const info = document.createElement("div");
        info.className = "item-info";

        const nombre = document.createElement("h4");
        nombre.textContent = p.nombre;
        info.appendChild(nombre);

        const cantidadLabel = document.createTextNode("Cantidad: ");
        info.appendChild(cantidadLabel);

        const cantidadInput = document.createElement("input");
        cantidadInput.type = "number";
        cantidadInput.min = 1;
        cantidadInput.value = p.cantidad;
        cantidadInput.style.width = "50px";
        cantidadInput.dataset.index = index;
        cantidadInput.addEventListener("change", function (e) {
            const nuevoValor = parseInt(e.target.value);
            if (isNaN(nuevoValor) || nuevoValor < 1) {
                alert("Cantidad inválida. Debe ser al menos 1.");
                e.target.value = carrito[index].cantidad;
                return;
            }
            carrito[index].cantidad = nuevoValor;
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarVistaCarrito();
        });
        info.appendChild(cantidadInput);

        item.appendChild(info);

        // Precio total producto
        const precio = document.createElement("div");
        precio.className = "item-precio";
        const totalItem = p.precio * p.cantidad;
        precio.textContent = `$${totalItem.toFixed(2)}`;
        item.appendChild(precio);

        // Botón eliminar
        const botonEliminar = document.createElement("button");
        botonEliminar.className = "btn-eliminar";
        botonEliminar.textContent = "❌";
        botonEliminar.onclick = () => {
            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            alert("Producto eliminado");
            actualizarVistaCarrito();
        };
        item.appendChild(botonEliminar);

        container.appendChild(item);

        subtotal += totalItem;
    });

    const iva = subtotal * 0.15;
    const total = subtotal + iva;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    ivaEl.textContent = `$${iva.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
    summary.style.display = "block";
});

function actualizarVistaCarrito() {
    // Simula el mismo código para refrescar el carrito
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const container = document.getElementById("carrito-container");
    const summary = document.getElementById("carrito-summary");
    const subtotalEl = document.getElementById("subtotal");
    const ivaEl = document.getElementById("iva");
    const totalEl = document.getElementById("total");

    if (carrito.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>Tu carrito está vacío.</p>";
        summary.style.display = "none";
        return;
    }

    container.innerHTML = "";

    let subtotal = 0;

    carrito.forEach((p, index) => {
        const item = document.createElement("div");
        item.className = "carrito-item";

        const imagen = document.createElement("img");
        imagen.src = p.imagen || "/images/default-placeholder.png";
        item.appendChild(imagen);

        const info = document.createElement("div");
        info.className = "item-info";

        const nombre = document.createElement("h4");
        nombre.textContent = p.nombre;
        info.appendChild(nombre);

        const cantidadLabel = document.createTextNode("Cantidad: ");
        info.appendChild(cantidadLabel);

        const cantidadInput = document.createElement("input");
        cantidadInput.type = "number";
        cantidadInput.min = 1;
        cantidadInput.value = p.cantidad;
        cantidadInput.style.width = "50px";
        cantidadInput.dataset.index = index;
        cantidadInput.addEventListener("change", function (e) {
            const nuevoValor = parseInt(e.target.value);
            if (isNaN(nuevoValor) || nuevoValor < 1) {
                alert("Cantidad inválida. Debe ser al menos 1.");
                e.target.value = carrito[index].cantidad;
                return;
            }
            carrito[index].cantidad = nuevoValor;
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarVistaCarrito();
        });
        info.appendChild(cantidadInput);

        item.appendChild(info);

        const precio = document.createElement("div");
        precio.className = "item-precio";
        const totalItem = p.precio * p.cantidad;
        precio.textContent = `$${totalItem.toFixed(2)}`;
        item.appendChild(precio);

        const botonEliminar = document.createElement("button");
        botonEliminar.className = "btn-eliminar";
        botonEliminar.textContent = "❌";
        botonEliminar.onclick = () => {
            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            alert("Producto eliminado");
            actualizarVistaCarrito();
        };
        item.appendChild(botonEliminar);

        container.appendChild(item);

        subtotal += totalItem;
    });

    const iva = subtotal * 0.15;
    const total = subtotal + iva;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    ivaEl.textContent = `$${iva.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
    summary.style.display = "block";
}


function eliminarDelCarrito(index) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Producto eliminado");
    window.location.reload(true);
}

/*Funcion para Inicio de Sesion*/
/*Verificar que haya una sesion iniciada */
function validarSesionAntesDePagar() {
    const cuenta = JSON.parse(localStorage.getItem("cuenta"));

    if (!cuenta || !cuenta.IdUsuario) {
        alert("Debes iniciar sesión para finalizar la compra.");
        window.location.href = "/Login";
        return;
    }
    finalizarCompra();

    // Aquí podrías continuar con el proceso de pago real, enviar datos, etc.
}
function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const cuenta = JSON.parse(localStorage.getItem("cuenta"));

    if (!cuenta) {
        alert("⚠️ Debes iniciar sesión para realizar la compra.");
        return;
    }

    if (carrito.length === 0) {
        alert("⚠️ Tu carrito está vacío.");
        return;
    }

    const payload = {
        detalles: carrito.map(p => ({
            idProducto: p.idProducto,
            cantidad: p.cantidad
        })),
        direccion: document.getElementById("direccion").value,
        metodoPago: document.getElementById("metodoPago").value,
        IdUsuario: cuenta.IdUsuario
    };

    fetch('/Carrito/CrearFacturaConDetalle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("✅ Compra realizada con éxito");
                localStorage.removeItem("carrito");
                window.location.href = "/"; // Redirige a inicio o gracias
            } else {
                alert("❌ Error al procesar la compra");
                console.error(data.error);
            }
        })
        .catch(err => {
            console.error("Error en fetch:", err);
            alert("❌ Error de conexión");
        });
}