document.addEventListener('DOMContentLoaded', () => {
    const dessertGrid = document.querySelector('.dessert-grid');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.total-price');
    const cartEmptyState = document.querySelector('.cart-empty-state');
    const confirmOrderButton = document.querySelector('.confirm-order');
    const cartCountElement = document.querySelector('.cart h2');

    let cart = JSON.parse(localStorage.getItem('dessertCart')) || [];

    const saveCart = () => {
        localStorage.setItem('dessertCart', JSON.stringify(cart));
    };

    const updateCartDisplay = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartEmptyState.style.display = 'block';
            confirmOrderButton.disabled = true;
        } else {
            cartEmptyState.style.display = 'none';
            confirmOrderButton.disabled = false;
        }

        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.dataset.name = item.name;

            const itemPrice = parseFloat(item.price.replace('$', ''));
            const subtotal = item.quantity * itemPrice;
            total += subtotal;
            totalItems += item.quantity;

            cartItemElement.innerHTML = `
                <div class="item-info">
                    <span class="item-quantity">${item.quantity}x</span>
                    <p class="item-name">${item.name}</p>
                </div>
                <div class="item-price-actions">
                    <p class="item-price">$${subtotal.toFixed(2)}</p>
                    <button class="remove-item-btn">
                        <img src="./assets/images/icon-remove-item.svg" alt="Remove item icon">
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        cartTotalElement.textContent = `$${total.toFixed(2)}`;
        cartCountElement.textContent = `Your Cart (${totalItems})`;
        saveCart();
    };

    dessertGrid.addEventListener('click', (event) => {
        const addButton = event.target.closest('.add-to-cart-btn');
        if (addButton) {
            const dessertItem = addButton.closest('.dessert-item');
            const name = dessertItem.querySelector('.product-name').textContent;
            const price = dessertItem.querySelector('.price').textContent;

            const existingItem = cart.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            
            updateCartDisplay();
        }
    });

    cartItemsContainer.addEventListener('click', (event) => {
        const removeButton = event.target.closest('.remove-item-btn');
        if (removeButton) {
            const cartItemElement = removeButton.closest('.cart-item');
            const itemName = cartItemElement.dataset.name;

            const itemIndex = cart.findIndex(item => item.name === itemName);

            if (itemIndex > -1) {
                cart[itemIndex].quantity--;
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1);
                }
            }
            updateCartDisplay();
        }
    });

    confirmOrderButton.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Order Confirmed!\nTotal: ' + cartTotalElement.textContent);
            cart = [];
            updateCartDisplay();
        } else {
            alert('Your cart is empty. Please add items before confirming.');
        }
    });

    updateCartDisplay();
});