/* ============================================================
   DARK / LIGHT MODE — MEGA ANIMATION TOGGLE
   Cole no final do seu script.js
   ============================================================ */

(function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    const overlay   = document.getElementById('themeAnimOverlay');
    const label     = document.getElementById('toggleLabel');
    const html      = document.documentElement;

    if (!toggleBtn || !overlay) return;

    /* Lê preferência salva ou do sistema */
    const saved       = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial     = saved || (prefersDark ? 'dark' : 'light');

    html.setAttribute('data-theme', initial);
    updateLabel(initial);

    let animating = false;

    toggleBtn.addEventListener('click', () => {
        if (animating) return;
        animating = true;

        const current = html.getAttribute('data-theme');
        const next    = current === 'dark' ? 'light' : 'dark';
        const rect    = toggleBtn.getBoundingClientRect();
        const cx      = rect.left + rect.width  / 2;
        const cy      = rect.top  + rect.height / 2;

        if (next === 'light') {
            animateSunrise(cx, cy, () => { applyTheme('light'); animating = false; });
        } else {
            animateMoonrise(cx, cy, () => { applyTheme('dark');  animating = false; });
        }
    });

    function applyTheme(theme) {
        html.classList.add('theme-transitioning');
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateLabel(theme);
        setTimeout(() => html.classList.remove('theme-transitioning'), 500);
    }

    function updateLabel(theme) {
        if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }

    /* ── Easings ── */
    function easeInOutCubic(t) {
        return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
    }
    function easeOutCubic(t) { return 1 - Math.pow(1-t, 3); }
    function easeOutBack(t) {
        const c = 1.70158 + 1;
        return 1 + c * Math.pow(t-1, 3) + (c-1) * Math.pow(t-1, 2);
    }
    function lerp(a, b, t) { return a + (b-a)*t; }
    function rand(a, b)     { return lerp(a, b, Math.random()); }

    /* ── Helper: cria elemento com estilos inline ── */
    function mkEl(tag, styles) {
        const el = document.createElement(tag);
        Object.assign(el.style, styles);
        return el;
    }

    /* ─────────────────────────────────────────────────────
       ☀️  SUNRISE — animação para LIGHT MODE
    ───────────────────────────────────────────────────── */
    function animateSunrise(cx, cy, onDone) {
        overlay.innerHTML = '';
        const radius = Math.hypot(
            Math.max(cx, window.innerWidth  - cx),
            Math.max(cy, window.innerHeight - cy)
        ) * 1.1;

        /* Ripple principal */
        const ripple = mkEl('div', {
            position: 'absolute', left: cx+'px', top: cy+'px',
            width: '0px', height: '0px', borderRadius: '50%',
            background: '#f5f0e0',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none', willChange: 'width,height,opacity',
        });
        overlay.appendChild(ripple);

        /* Halo laranja */
        const halo = mkEl('div', {
            position: 'absolute', left: cx+'px', top: cy+'px',
            width: '0px', height: '0px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,200,80,.55) 0%, rgba(255,160,40,.2) 50%, transparent 80%)',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none', willChange: 'width,height,opacity',
        });
        overlay.appendChild(halo);

        /* Raios */
        const rays = [];
        for (let i = 0; i < 20; i++) {
            const angle  = (i/20)*360;
            const length = rand(40, 90);
            const dist   = rand(14, 28);
            const w      = rand(1.5, 3);
            const el = mkEl('div', {
                position: 'absolute', left: cx+'px', top: cy+'px',
                width: w+'px', height: length+'px', borderRadius: '2px',
                background: `rgba(255,${(rand(180,220))|0},60,.9)`,
                transformOrigin: `${w/2}px ${-dist}px`,
                transform: `rotate(${angle}deg) scaleY(0)`,
                opacity: '0', pointerEvents: 'none', willChange: 'transform,opacity',
            });
            overlay.appendChild(el);
            rays.push({ el, angle, delay: rand(0, 0.25) });
        }

        /* Partículas */
        const particles = [];
        for (let i = 0; i < 35; i++) {
            const a    = rand(0, 360);
            const d    = rand(60, 200);
            const size = rand(3, 8);
            const el = mkEl('div', {
                position: 'absolute',
                left: (cx + Math.cos(a*Math.PI/180)*d)+'px',
                top:  (cy + Math.sin(a*Math.PI/180)*d)+'px',
                width: size+'px', height: size+'px', borderRadius: '50%',
                background: `rgba(255,${(rand(200,240))|0},${(rand(80,140))|0},.9)`,
                transform: 'translate(-50%,-50%) scale(0)',
                opacity: '0', pointerEvents: 'none', willChange: 'transform,opacity',
            });
            overlay.appendChild(el);
            particles.push({ el, delay: rand(0.05, 0.45) });
        }

        const DUR = 750;
        let start = null;
        function frame(ts) {
            if (!start) start = ts;
            const raw = Math.min((ts-start)/DUR, 1);
            const p   = easeInOutCubic(raw);

            const d = p * radius * 2;
            ripple.style.width   = d+'px';
            ripple.style.height  = d+'px';
            ripple.style.opacity = String(Math.min(raw*3, 1));

            const dh = p * radius * 2.4;
            halo.style.width   = dh+'px';
            halo.style.height  = dh+'px';
            halo.style.opacity = String(Math.sin(raw*Math.PI)*0.8);

            rays.forEach(({ el, angle, delay }) => {
                const rp = Math.max((raw-delay)/(1-delay), 0);
                const re = easeOutBack(Math.min(rp, 1));
                el.style.opacity   = String(Math.sin(Math.min(rp,1)*Math.PI)*0.9);
                el.style.transform = `rotate(${angle}deg) scaleY(${re})`;
            });

            particles.forEach(({ el, delay }) => {
                const pp = Math.max((raw-delay)/(1-delay), 0);
                const pe = easeOutCubic(Math.min(pp, 1));
                el.style.opacity   = String(Math.sin(Math.min(pp,1)*Math.PI)*0.85);
                el.style.transform = `translate(-50%,-50%) scale(${pe})`;
            });

            if (raw < 1) { requestAnimationFrame(frame); }
            else { setTimeout(() => { overlay.innerHTML=''; onDone(); }, 80); }
        }
        requestAnimationFrame(frame);
    }

    /* ─────────────────────────────────────────────────────
       🌙  MOONRISE — animação para DARK MODE
    ───────────────────────────────────────────────────── */
    function animateMoonrise(cx, cy, onDone) {
        overlay.innerHTML = '';
        const radius = Math.hypot(
            Math.max(cx, window.innerWidth  - cx),
            Math.max(cy, window.innerHeight - cy)
        ) * 1.1;

        /* Ripple escuro */
        const ripple = mkEl('div', {
            position: 'absolute', left: cx+'px', top: cy+'px',
            width: '0px', height: '0px', borderRadius: '50%',
            background: '#0d0d0f',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none', willChange: 'width,height,opacity',
        });
        overlay.appendChild(ripple);

        /* Halo roxo */
        const halo = mkEl('div', {
            position: 'absolute', left: cx+'px', top: cy+'px',
            width: '0px', height: '0px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(100,80,220,.45) 0%, rgba(60,40,140,.2) 50%, transparent 80%)',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none', willChange: 'width,height,opacity',
        });
        overlay.appendChild(halo);

        /* Lua crescente */
        const moonSize = 48;
        const moon = mkEl('div', {
            position: 'absolute',
            left: (cx - moonSize/2)+'px',
            top:  (cy - moonSize/2)+'px',
            width: moonSize+'px', height: moonSize+'px',
            opacity: '0', transform: 'scale(0) rotate(-30deg)',
            pointerEvents: 'none', willChange: 'transform,opacity',
        });
        moon.innerHTML = `<svg viewBox="0 0 24 24" width="${moonSize}" height="${moonSize}" fill="rgba(200,190,255,.95)"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
        overlay.appendChild(moon);

        /* Estrelas */
        const stars = [];
        for (let i = 0; i < 45; i++) {
            const a    = rand(0, 360);
            const d    = rand(50, Math.min(window.innerWidth, window.innerHeight)*0.45);
            const size = rand(1.5, 5);
            const color = Math.random() > 0.6 ? '#b0a8ff' : '#fffde8';
            const el = mkEl('div', {
                position: 'absolute',
                left: (cx + Math.cos(a*Math.PI/180)*d)+'px',
                top:  (cy + Math.sin(a*Math.PI/180)*d)+'px',
                width: size+'px', height: size+'px', borderRadius: '50%',
                background: color,
                boxShadow: `0 0 ${size*2}px ${color}`,
                transform: 'translate(-50%,-50%) scale(0)',
                opacity: '0', pointerEvents: 'none', willChange: 'transform,opacity',
            });
            overlay.appendChild(el);
            stars.push({ el, delay: rand(0.1, 0.6), twinkle: rand(0, Math.PI*2) });
        }

        /* Poeira espacial */
        const dust = [];
        for (let i = 0; i < 20; i++) {
            const a    = rand(0, 360);
            const d    = rand(30, 120);
            const size = rand(2, 5);
            const el = mkEl('div', {
                position: 'absolute',
                left: (cx + Math.cos(a*Math.PI/180)*d)+'px',
                top:  (cy + Math.sin(a*Math.PI/180)*d)+'px',
                width: size+'px', height: size+'px', borderRadius: '50%',
                background: `rgba(${(rand(140,180))|0},${(rand(120,160))|0},255,.7)`,
                transform: 'translate(-50%,-50%) scale(0)',
                opacity: '0', pointerEvents: 'none', willChange: 'transform,opacity',
            });
            overlay.appendChild(el);
            dust.push({ el, delay: rand(0, 0.3) });
        }

        const DUR = 800;
        let start = null;
        function frame(ts) {
            if (!start) start = ts;
            const raw = Math.min((ts-start)/DUR, 1);
            const p   = easeInOutCubic(raw);

            const d = p * radius * 2;
            ripple.style.width   = d+'px';
            ripple.style.height  = d+'px';
            ripple.style.opacity = String(Math.min(raw*2.5, 1));

            const dh = p * radius * 2.5;
            halo.style.width   = dh+'px';
            halo.style.height  = dh+'px';
            halo.style.opacity = String(Math.sin(raw*Math.PI)*0.75);

            const mp = Math.max((raw-0.05)/0.6, 0);
            const me = easeOutBack(Math.min(mp, 1));
            moon.style.opacity   = String(Math.min(mp*2, 1));
            moon.style.transform = `scale(${me}) rotate(${(1-me)*-30}deg)`;

            stars.forEach(({ el, delay, twinkle }) => {
                const sp = Math.max((raw-delay)/(1-delay), 0);
                const se = easeOutCubic(Math.min(sp, 1));
                const tw = Math.sin(raw*12 + twinkle)*0.2 + 0.8;
                el.style.opacity   = String(Math.sin(Math.min(sp,1)*Math.PI)*0.9*tw);
                el.style.transform = `translate(-50%,-50%) scale(${se})`;
            });

            dust.forEach(({ el, delay }) => {
                const dp = Math.max((raw-delay)/(1-delay), 0);
                const de = easeOutCubic(Math.min(dp, 1));
                el.style.opacity   = String(Math.sin(Math.min(dp,1)*Math.PI)*0.7);
                el.style.transform = `translate(-50%,-50%) scale(${de})`;
            });

            if (raw < 1) { requestAnimationFrame(frame); }
            else { setTimeout(() => { overlay.innerHTML=''; onDone(); }, 80); }
        }
        requestAnimationFrame(frame);
    }

})();