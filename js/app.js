document.addEventListener('DOMContentLoaded', () => {

    const products = [
        { id: 1,  name: 'Винтажный светильник-цветок', price: 1900, season: 'spring', featured: true,  image: 'images/spring/lamps.png' },
        { id: 2,  name: 'Лиана coquette-core',         price: 900,  season: 'spring', featured: true,  image: 'images/spring/flowers.jpg' },
        { id: 3,  name: 'Сказочный ночник',            price: 1500, season: 'spring', featured: true,  image: 'images/spring/cube.png' },
        { id: 4,  name: 'Парящий стол-бабочка',        price: 9000, season: 'spring', featured: true,  image: 'images/spring/table.jpg' },
        { id: 5,  name: 'Клубничное постельное бельё', price: 4000, season: 'spring', featured: true,  image: 'images/spring/bed.jpg' },
        { id: 6,  name: 'Ваза-клубника',            price: 3500, season: 'spring', featured: false, image: 'images/spring/vase.jpg' },

        { id: 7,  name: 'Мыло-виноград',                price: 1200, season: 'summer', featured: true,  image: 'images/summer/soap.jpg' },
        { id: 8,  name: 'Стол Mermaid-Core',             price: 15000, season: 'summer', featured: true,  image: 'images/summer/table.jpg' },
        { id: 9,  name: 'Ракушка-бокал набор',             price: 7000,  season: 'summer', featured: true,  image: 'images/summer/cups.jpg' },
        { id: 10, name: 'Светильник-медуза',            price: 4000, season: 'summer', featured: true,  image: 'images/summer/lamp.png' },
        { id: 11, name: 'Корзина для пикника',           price: 6000, season: 'summer', featured: true,  image: 'images/summer/basket.jpg' },
        { id: 12, name: 'Свеча в кокосе',               price: 1000, season: 'summer', featured: false, image: 'images/summer/coconut.jpg' },

        { id: 13, name: 'Настольный биокамин',              price: 4200, season: 'winter', featured: true,  image: 'images/winter/fire.jpg' },
        { id: 14, name: 'Зимнее кашемировое мыло',             price: 4000,  season: 'winter', featured: true,  image: 'images/winter/cream.jpg' },
        { id: 15, name: 'Кружка-пряничный домик',           price: 1500, season: 'winter', featured: false,  image: 'images/winter/mug.jpg' },
        { id: 16, name: 'Свеча-глинтвейн',                price: 2000, season: 'winter', featured: true,  image: 'images/winter/candle.jpg' },
        { id: 17, name: 'Ночник «Маленький принц»',                 price: 4000, season: 'winter', featured: true,  image: 'images/winter/ball.jpg' },
        { id: 18, name: 'Постельное белье "Шерстка оленя"',              price: 3500, season: 'winter', featured: true, image: 'images/winter/deer.png' },

        { id: 19, name: 'Кружка-гриб',         price: 1500, season: 'autumn', featured: true,  image: 'images/autumn/cup.jpg' },
        { id: 21, name: 'Свеча «Тыквенный латте»',               price: 1100, season: 'autumn', featured: true,  image: 'images/autumn/candle.png' },
        { id: 22, name: 'Котелок-тыква',            price: 5000,  season: 'autumn', featured: true,  image: 'images/autumn/pot.png' },
        { id: 23, name: 'Пушистые тапочки Снупи',           price: 2600, season: 'autumn', featured: true,  image: 'images/autumn/slippers.png' },
        { id: 24, name: 'Мыло Cozy Autumn',               price: 500, season: 'autumn', featured: true, image: 'images/autumn/soap.png' },
        { id: 20, name: 'Плюшевая подушка-тыква',              price: 2000,  season: 'autumn', featured: false,  image: 'images/autumn/pillow.png' },

    ];

    function renderCarousel(season) {
        const carousel = document.getElementById('carousel');
        if (!carousel) return;

        let items;
        if (season === 'all') {
            items = products.filter(p => p.featured).slice(0, 5);
        } else {
            items = products.filter(p => p.season === season && p.featured).slice(0, 5);
        }

        carousel.innerHTML = items.map(item => `
            <article class="carousel-item">
                <div class="carousel-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <h3>${item.name}</h3>
                <p>${item.price.toLocaleString('ru-RU')} ₽</p>
            </article>
        `).join('');
    }



    const seasonButtons = document.querySelectorAll('.season-btn');
    const savedSeason = localStorage.getItem('store-season') || 'autumn';
    const particlesContainer = document.getElementById('particles');

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

        if (season !== 'all') {
            localStorage.setItem('store-season', season);
        }

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

    seasonButtons.forEach(btn => {
        btn.addEventListener('click', () => setSeason(btn.dataset.season));
    });

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
    const filterButtons = document.querySelectorAll('.filter-btn');

    function renderCatalog(season) {
        const list = season === 'all'
            ? products
            : products.filter(p => p.season === season);

        productGrid.innerHTML = '';

        list.forEach(p => {
            const card = document.createElement('article');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <img src="${p.image}" alt="${p.name}">
                </div>
                <h3>${p.name}</h3>
                <p class="product-price">${p.price.toLocaleString('ru-RU')} ₽</p>
                <button class="product-btn" data-id="${p.id}">Добавить в корзину</button>
            `;
            productGrid.appendChild(card);
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setSeason(btn.dataset.season);
        });
    });

    setSeason(savedSeason);

});