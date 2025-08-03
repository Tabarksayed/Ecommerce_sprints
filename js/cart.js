
function addToCart(productId) {//for products page
    const id = parseInt(productId);
    Toastify({
        text: "Item Added to the Cart",
        duration: 3000
    }).showToast();
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId: id, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');

    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
    }
}


async function displayCartItems() {
    let allProducts = JSON.parse(localStorage.getItem('products'));

    if (!allProducts) {
        console.log('Product cache not found. Fetching from API...');
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            allProducts = await response.json();
            localStorage.setItem('products', JSON.stringify(allProducts));
        } catch (error) {
            console.error('Failed to fetch products for cart:', error);
            document.getElementById('cart-container').innerHTML = '<p class="text-danger">Could not load product details. Please try again.</p>';
            return;
        }
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-container');
    const cartTotalElement = document.getElementById('cart-total');

    cartContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
        cartTotalElement.textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        const product = allProducts.find(p => p.id === item.productId);

        if (product) {
            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            cartContainer.innerHTML += `
                <div class="card mb-3">
                    <div class="card-body d-flex align-items-center">
                        <img src="${product.image}" alt="${product.title}" style="width: 100px; height: 100px; object-fit: contain;" class="me-3">
                        <div class="flex-grow-1">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">Quantity: ${item.quantity}</p>
                        </div>
                        <h5 class="text-end fw-bold">$${itemTotal.toFixed(2)}</h5>
                    </div>
                </div>
            `;
        }
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

function handleCheckout() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        Swal.fire('Login Required', 'You must be logged in to checkout.', 'warning').then(() => {
            window.location.href = '../auth/auth.html';
        });
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        Swal.fire('Empty Cart', 'Your cart is empty.', 'error');
        return;
    }

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const cartTotal = document.getElementById('cart-total').textContent.replace('$', '');

    const newOrder = {
        orderId: 'ORD' + Date.now(),
        userId: currentUser.username,
        items: cart,
        total: parseFloat(cartTotal),
        date: new Date().toISOString()
    };

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.removeItem('cart');

    Swal.fire('Thank You!', 'Your order has been placed successfully.', 'success').then(() => {
        window.location.href = '../products.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    if (window.location.pathname.endsWith('cart.html')) {
        displayCartItems();
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', handleCheckout);
        }
    }
});