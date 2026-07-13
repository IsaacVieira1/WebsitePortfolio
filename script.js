document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();

    /* ── SLIDESHOW ────────────────────────────────────── */
    const slides = document.querySelectorAll('.slideshow .slide-item');
    const dotsContainer = document.getElementById('slideDots');
    let current = 0;

    if (slides.length && dotsContainer) {
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function goTo(n) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = n;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
        }

        setInterval(() => goTo((current + 1) % slides.length), 4500);
    }

    /* ── MOBILE MENU ──────────────────────────────────── */
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    }
    window.closeMobileMenu = function () {
        if (mobileMenu) mobileMenu.classList.remove('open');
    };

    /* ── HEADER SCROLL STATE ──────────────────────────── */
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 12);
        }, { passive: true });
    }

    /* ── SCROLL REVEAL (fade + rise only) ─────────────── */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }
});