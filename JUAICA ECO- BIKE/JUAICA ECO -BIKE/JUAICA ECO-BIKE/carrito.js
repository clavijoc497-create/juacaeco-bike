let cart = [];
const cartBadge = document.getElementById("cartBadge");
const drawerItems = document.getElementById("drawerItems");
const drawerTotal = document.getElementById("drawerTotal");

function formatPrice(price) {
    return "$" + price.toLocaleString('es-CO');
}

function updateCart() {
    cartBadge.textContent = cart.reduce((a, b) => a + b.qty, 0);
    drawerItems.innerHTML = cart.map((i, index) => `
        <div class="d-flex justify-content-between mb-2 align-items-center">
            <span>${i.title} (${i.qty})</span>
            <div class="d-flex align-items-center">
                <span class="me-2 fw-bold">${formatPrice(i.price * i.qty)}</span>
                <button class="btn btn-sm btn-outline-secondary me-1 remove-one-btn" data-index="${index}">-</button>
                <button class="btn btn-sm btn-danger delete-item-btn" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>`).join("");
    const total = cart.reduce((a, b) => a + b.price * b.qty, 0);
    drawerTotal.textContent = formatPrice(total);
    setupDrawerListeners();
}

function setupDrawerListeners() {
    document.querySelectorAll(".remove-one-btn").forEach(btn => {
        btn.onclick = () => {
            const index = parseInt(btn.dataset.index);
            if (cart[index].qty > 1) {
                cart[index].qty--;
            } else {
                cart.splice(index, 1);
            }
            updateCart();
        };
    });
    document.querySelectorAll(".delete-item-btn").forEach(btn => {
        btn.onclick = () => {
            const index = parseInt(btn.dataset.index);
            cart.splice(index, 1);
            updateCart();
        };
    });
}

function setupCartLogic() {
    document.querySelectorAll(".add-btn").forEach(btn => {
        btn.onclick = () => {
            const title = btn.dataset.title;
            const price = parseInt(btn.dataset.price);
            const item = cart.find(p => p.title === title);
            if (item) {
                item.qty++;
            } else {
                cart.push({ title, price, qty: 1 });
            }
            updateCart();
        };
    });
    
    const clearBtn = document.getElementById("drawerClear");
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (cart.length === 0) {
                alert("El carrito ya está vacío.");
                return;
            }
            if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
                cart = [];
                updateCart();
            }
        };
    }
    
    const checkoutBtn = document.getElementById("drawerCheckout");
    if (checkoutBtn) {
        checkoutBtn.onclick = (e) => {
            if (cart.length === 0) {
                e.stopPropagation();
                alert("Tu carrito está vacío. Agrega una ruta para finalizar la compra.");
                return;
            }
            generateFactura();
        };
    }
}

function generateFactura() {
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked')?.value || "No seleccionado";
    const now = new Date();
    const facturaDate = now.toLocaleDateString('es-CO') + ' ' + now.toLocaleTimeString('es-CO');
    const orderNumber = 'ORD-' + Date.now().toString().slice(-6);
    const total = cart.reduce((a, b) => a + b.price * b.qty, 0);

    const fechaSpan = document.getElementById("facturaFecha");
    const numeroSpan = document.getElementById("facturaNumero");
    const metodoSpan = document.getElementById("facturaMetodoPago");
    const totalSpan = document.getElementById("facturaTotal");
    const itemsDiv = document.getElementById("facturaItems");

    if (fechaSpan) fechaSpan.textContent = facturaDate;
    if (numeroSpan) numeroSpan.textContent = orderNumber;
    if (metodoSpan) metodoSpan.textContent = metodoPago;
    if (totalSpan) totalSpan.textContent = formatPrice(total);
    if (itemsDiv) {
        itemsDiv.innerHTML = cart.map(i => `
            <div class="d-flex justify-content-between">
                <span>${i.qty} x ${i.title}</span>
                <span>${formatPrice(i.price)} c/u = ${formatPrice(i.price * i.qty)}</span>
            </div>
        `).join('');
    }

    setTimeout(() => {
        cart = [];
        updateCart();
        const cartDrawer = bootstrap.Offcanvas.getInstance(document.getElementById('cartDrawer'));
        if(cartDrawer) cartDrawer.hide();
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    setupCartLogic();
    updateCart();
});