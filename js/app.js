document.addEventListener('DOMContentLoaded', () => {

    const seasonButtons = document.querySelectorAll('.season-btn');
    const savedSeason = localStorage.getItem('store-season') || 'autumn';
    const particlesContainer = document.getElementById('particles');

    function spawnParticles(season) {
        particlesContainer.innerHTML = '';

        const sizeRange = {
            summer: [10, 24],
            autumn: [24, 52],
            winter: [12, 30],
            spring: [20, 44]
        };

        const [minSize, maxSize] = sizeRange[season] || [6, 14];
        const count = 22;

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';

            const size = minSize + Math.random() * (maxSize - minSize);
            const left = Math.random() * 100;
            const duration = 8 + Math.random() * 12;
            const delay = -Math.random() * duration;

            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = left + 'vw';
            p.style.animationDuration = duration + 's';
            p.style.animationDelay = delay + 's';
            p.style.opacity = 0.6 + Math.random() * 0.4;

            particlesContainer.appendChild(p);
        }
    }

    function setSeason(season) {
        document.body.dataset.season = season;
        localStorage.setItem('store-season', season);

        seasonButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.season === season);
        });

        spawnParticles(season);
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

    setSeason(savedSeason);
});