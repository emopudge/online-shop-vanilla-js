document.addEventListener('DOMContentLoaded', () => {

    function el(tag, props = {}, ...children) {
        const node = document.createElement(tag);
        for (const [key, value] of Object.entries(props)) {
            if (key === 'class') node.className = value;
            else if (key === 'dataset') Object.assign(node.dataset, value);
            else node.setAttribute(key, value);
        }
        for (const child of children) {
            if (typeof child === 'string' || typeof child === 'number') {
                node.appendChild(document.createTextNode(child));
            } else if (child) {
                node.appendChild(child);
            }
        }
        return node;
    }

    function renderCarousel(season) {
        const carousel = document.getElementById('carousel');
        if (!carousel) return;

        let items;
        if (season === 'all') {
            items = products.filter(p => p.featured).slice(0, 5);
        } else {
            items = products.filter(p => p.season === season && p.featured).slice(0, 5);
        }

        carousel.replaceChildren();

        items.forEach(item => {
            const card = el('article', { class: 'carousel-item' },
                el('div', { class: 'carousel-image' },
                    el('img', { src: item.image, alt: item.name, loading: 'lazy' })
                ),
                el('h3', {}, item.name),
                el('p', {}, `${item.price.toLocaleString('ru-RU')} ₽`)
            );
            carousel.appendChild(card);
        });
    }



    const savedSeason = localStorage.getItem('store-season') || 'all';
    const particlesContainer = document.getElementById('particles');
    
    const filterButtons = document.querySelectorAll('.filter-btn');


    function spawnParticles(season) {
        particlesContainer.innerHTML = '';

        const allTypes = ['spring', 'summer', 'autumn', 'winter'];

        let types, count;
        if (season === 'all') {
            types = allTypes;
            count = 20;                    
        } else {
            types = [season];
            count = 14;                   
        }

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            const type = types[i % types.length];
            p.className = 'particle particle-' + type;

            const size = 14 + Math.random() * 22;
            const left = Math.random() * 100;
            const duration = 14 + Math.random() * 14;
            const delay = -Math.random() * duration;

            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = left + 'vw';
            p.style.animationDuration = duration + 's';
            p.style.animationDelay = delay + 's';
            p.style.opacity = 0.35 + Math.random() * 0.35;

            particlesContainer.appendChild(p);
        }
    }

    function setSeason(season) {
        document.body.dataset.season = season;

        localStorage.setItem('store-season', season);

        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.season === season);
        });
        spawnParticles(season);

        if (season === 'all') {
            renderCatalog('all');
        } else {
            renderCarousel(season);
            renderCatalog(season);
        }
    }

    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (carousel && prevBtn && nextBtn) {
        const scrollAmount = 300;
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }


    const productGrid = document.getElementById('product-grid');

    function renderCatalog(season) {
        const list = season === 'all'
            ? products
            : products.filter(p => p.season === season);

        productGrid.replaceChildren();

        list.forEach(p => {
            const card = el('article', { class: 'product-card' },
                el('div', { class: 'product-image' },
                    el('img', { src: p.image, alt: p.name })
                ),
                el('h3', {}, p.name),
                el('p', { class: 'product-price' }, `${p.price.toLocaleString('ru-RU')} ₽`),
                el('button', { class: 'product-btn', 'data-id': p.id }, 'Добавить в корзину')
            );
            productGrid.appendChild(card);
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setSeason(btn.dataset.season);
        });
    });

    setSeason(savedSeason);


    /*корзина */

    const CART_KEY = 'store-cart';

    let cart = [];

    const cartPanel = document.getElementById('cart-panel');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartClose = document.getElementById('cart-close');
    const cartItemsBox = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountEl = document.getElementById('cart-count');
    const openCartBtn = document.getElementById('open-cart');
    const checkoutBtn = document.getElementById('checkout-btn');

    function loadCart() {
        try {
            const raw = localStorage.getItem(CART_KEY);
            cart = raw ? JSON.parse(raw) : [];
        } catch (e) {
            cart = [];
        }
    }

    function saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function addToCart(id) {
        const item = cart.find(x => x.id === id);
        if (item) {
            item.quantity += 1;
        } else {
            cart.push({ id: id, quantity: 1 });
        }
        saveCart();
        renderCart();
        if (cartCountEl) {
            cartCountEl.parentElement.classList.remove('pulse');
            void cartCountEl.parentElement.offsetWidth;  
            cartCountEl.parentElement.classList.add('pulse');
        }
    }

    function removeFromCart(id) {
        cart = cart.filter(x => x.id !== id);
        saveCart();
        renderCart();
    }

    function changeQuantity(id, delta) {
        const item = cart.find(x => x.id === id);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
            return;
        }
        saveCart();
        renderCart();
    }

    function renderCart() {
        if (!cart.length) {
            cartItemsBox.replaceChildren(
                el('p', { class: 'cart-empty' }, 'Корзина пуста')
            );
            cartTotalEl.textContent = '0';
            cartCountEl.textContent = '0';
            checkoutBtn.style.display = 'none';
            return;
        }

        checkoutBtn.style.display = '';  

        cartItemsBox.replaceChildren();

        let total = 0;
        let count = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return;

            const sum = product.price * item.quantity;
            total += sum;
            count += item.quantity;

            const img = el('img', { src: product.image, alt: product.name });
            const cartItem = el('div', { class: 'cart-item' },
                el('div', { class: 'cart-item-image' }, img),
                el('div', { class: 'cart-item-info' },
                    el('h4', {}, product.name),
                    el('p', { class: 'cart-item-price' }, `${product.price.toLocaleString('ru-RU')} ₽`),
                    el('div', { class: 'cart-item-controls' },
                        el('button', { class: 'qty-btn', 'data-action': 'minus', 'data-id': product.id }, '−'),
                        el('span', { class: 'qty-value' }, item.quantity),
                        el('button', { class: 'qty-btn', 'data-action': 'plus', 'data-id': product.id }, '+'),
                        el('button', { class: 'remove-btn', 'data-action': 'remove', 'data-id': product.id }, 'Удалить')
                    )
                )
            );
            cartItemsBox.appendChild(cartItem);
        });

        cartTotalEl.textContent = total.toLocaleString('ru-RU');
        cartCountEl.textContent = count;

        cartTotalEl.textContent = total.toLocaleString('ru-RU');
        cartCountEl.textContent = count;
    }

    function openCart() {
        cartPanel.classList.add('open');
        cartOverlay.classList.add('open');
    }

    function closeCart() {
        cartPanel.classList.remove('open');
        cartOverlay.classList.remove('open');
    }

    if (openCartBtn) openCartBtn.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.product-btn');
        if (addBtn) {
            const id = Number(addBtn.dataset.id);
            addToCart(id);
            return;
        }

        const actionBtn = e.target.closest('[data-action]');
        if (actionBtn && actionBtn.closest('#cart-items')) {
            const id = Number(actionBtn.dataset.id);
            const action = actionBtn.dataset.action;
            if (action === 'plus') changeQuantity(id, 1);
            if (action === 'minus') changeQuantity(id, -1);
            if (action === 'remove') removeFromCart(id);
        }
    });

    loadCart();
    renderCart();

    /*форма заказа*/

    const orderOverlay = document.getElementById('order-overlay');
    const orderModal = document.getElementById('order-modal');
    const orderClose = document.getElementById('order-close');
    const orderForm = document.getElementById('order-form');
    const orderSuccess = document.getElementById('order-success');

    function openOrder() {
        if (!cart.length) {
            return;
        }
        orderModal.classList.add('open');
        orderOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        orderForm.style.display = '';
        orderSuccess.classList.remove('show');
        orderForm.reset();
        clearErrors();
    }

    function closeOrder() {
        orderModal.classList.remove('open');
        orderOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    function clearErrors() {
        ['name', 'surname', 'address', 'phone'].forEach(f => {
            const el = document.getElementById('error-' + f);
            if (el) el.textContent = '';
        });
        orderForm.querySelectorAll('input').forEach(inp => {
            inp.classList.remove('invalid');
        });
    }

    function setError(field, message) {
        const err = document.getElementById('error-' + field);
        const input = document.getElementById('order-' + field);
        if (err) err.textContent = message;
        if (input) input.classList.add('invalid');
    }

    function validateForm() {
        clearErrors();
        let valid = true;

        const name = document.getElementById('order-name').value.trim();
        const surname = document.getElementById('order-surname').value.trim();
        const address = document.getElementById('order-address').value.trim();
        const phone = document.getElementById('order-phone').value.trim();

        if (name.length < 2) {
            setError('name', 'Введите имя (минимум 2 символа)');
            valid = false;
        }

        if (surname.length < 2) {
            setError('surname', 'Введите фамилию (минимум 2 символа)');
            valid = false;
        }

        if (address.length < 5) {
            setError('address', 'Введите адрес доставки');
            valid = false;
        }

        const digits = phone.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15) {
            setError('phone', 'Введите корректный номер телефона');
            valid = false;
        }

        return valid;
    }

    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }
            
            const items = cart.map(item => {
                const p = products.find(x => x.id === item.id);
                return {
                    name: p.name,
                    price: p.price,
                    quantity: item.quantity,
                    sum: p.price * item.quantity
                };
            });

            const total = items.reduce((acc, it) => acc + it.sum, 0);

            const order = {
                id: Date.now(),
                date: new Date().toLocaleString('ru-RU'),
                name: document.getElementById('order-name').value.trim(),
                surname: document.getElementById('order-surname').value.trim(),
                address: document.getElementById('order-address').value.trim(),
                phone: document.getElementById('order-phone').value.trim(),
                items: items,
                total: total,
            };

            const ORDERS_KEY = 'store-orders';
            const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
            orders.push(order);
            localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

            orderForm.style.display = 'none';
            orderSuccess.classList.add('show');

            cart = [];
            saveCart();
            renderCart();

            setTimeout(() => {
                closeOrder();
            }, 3000);
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            closeCart();
            openOrder();
        });
    }

    if (orderClose) orderClose.addEventListener('click', closeOrder);
    if (orderOverlay) orderOverlay.addEventListener('click', closeOrder);

    /*админ-панель*/

    const adminModal = document.getElementById('admin-modal');
    const adminClose = document.getElementById('admin-close');
    const adminBody = document.getElementById('admin-body');

    function renderAdmin() {
        const orders = JSON.parse(localStorage.getItem('store-orders') || '[]');

        if (!orders.length) {
            adminBody.replaceChildren(
                el('p', { class: 'admin-empty' }, 'Заказов пока нет')
            );
            return;
        }

        adminBody.replaceChildren();

        orders.slice().reverse().forEach(o => {
            const order = el('div', { class: 'admin-order' },
                el('div', { class: 'admin-order-header' },
                    el('span', { class: 'admin-order-id' }, `Заказ №${o.id}`),
                    el('span', { class: 'admin-order-date' }, o.date)
                ),
                el('div', { class: 'admin-order-client' },
                    el('strong', {}, `${o.surname} ${o.name}`),
                    el('br'),
                    o.phone,
                    el('br'),
                    o.address
                ),
                el('div', { class: 'admin-order-items' },
                    ...o.items.map(it =>
                        el('div', { class: 'admin-order-line' },
                            el('span', {}, `${it.name} × ${it.quantity}`),
                            el('span', {}, `${it.sum.toLocaleString('ru-RU')} ₽`)
                        )
                    )
                ),
                el('div', { class: 'admin-order-total' },
                    'Итого: ',
                    el('strong', {}, `${o.total.toLocaleString('ru-RU')} ₽`)
                )
            );
            adminBody.appendChild(order);
        });
    }

    function openAdmin() {
        renderAdmin();
        adminModal.classList.add('open');
    }

    if (adminClose) {
        adminClose.addEventListener('click', () => {
            adminModal.classList.remove('open');
        });
    }

    /* открытие админки по ?admin=1 в адресе */
    if (location.search.includes('admin=1')) {
        openAdmin();
    }
});