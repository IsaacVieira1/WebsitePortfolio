/* ═══════════════════════════════════════════
   ISAAC VIEIRA — PREMIUM PORTFOLIO JS
   Ultra-advanced animations & interactions
═══════════════════════════════════════════ */

lucide.createIcons();

// ── CURSOR ──────────────────────────────────────────────────────────
const ring = document.getElementById('cursorRing');
const dot  = document.getElementById('cursorDot');
const glow = document.getElementById('magGlow');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  glow.style.left = mx + 'px'; glow.style.top = my + 'px';
}, { passive: true });

(function cursorLoop() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(cursorLoop);
})();

document.querySelectorAll('a, button, .proj-card, .exp-card, .case-card, .contact-card, .spill').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});


// ── BACKGROUND CANVAS — ANIMATED GRADIENT MESH ─────────────────────
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
let bgW, bgH;

function resizeBg() {
  bgW = bgCanvas.width  = window.innerWidth;
  bgH = bgCanvas.height = window.innerHeight;
}
resizeBg();
window.addEventListener('resize', resizeBg);

const blobs = [
  { x: 0.15, y: 0.2,  r: 0.35, color: 'rgba(0,122,255,0.06)', vx: 0.0003, vy: 0.0002 },
  { x: 0.8,  y: 0.15, r: 0.30, color: 'rgba(90,200,250,0.05)', vx: -0.0002, vy: 0.0003 },
  { x: 0.5,  y: 0.7,  r: 0.40, color: 'rgba(191,90,242,0.04)', vx: 0.0002, vy: -0.0002 },
  { x: 0.9,  y: 0.8,  r: 0.25, color: 'rgba(52,199,89,0.04)',  vx: -0.0003, vy: -0.0002 },
];

function drawBg(t) {
  bgCtx.clearRect(0, 0, bgW, bgH);
  blobs.forEach(b => {
    b.x += b.vx * Math.sin(t * 0.5);
    b.y += b.vy * Math.cos(t * 0.4);
    if (b.x < 0 || b.x > 1) b.vx *= -1;
    if (b.y < 0 || b.y > 1) b.vy *= -1;

    const grd = bgCtx.createRadialGradient(
      b.x * bgW, b.y * bgH, 0,
      b.x * bgW, b.y * bgH, b.r * Math.max(bgW, bgH)
    );
    grd.addColorStop(0, b.color);
    grd.addColorStop(1, 'transparent');
    bgCtx.fillStyle = grd;
    bgCtx.fillRect(0, 0, bgW, bgH);
  });
  requestAnimationFrame(t2 => drawBg(t2 * 0.001));
}
requestAnimationFrame(t => drawBg(t * 0.001));


// ── HERO PARTICLES ───────────────────────────────────────────────────
const hpc = document.getElementById('heroParticles');
const hpx = hpc.getContext('2d');
let hpW, hpH;

function resizeHp() {
  hpW = hpc.width  = hpc.offsetWidth;
  hpH = hpc.height = hpc.offsetHeight;
}
resizeHp();
window.addEventListener('resize', resizeHp);

const particles = Array.from({ length: 60 }, () => ({
  x: Math.random(),
  y: Math.random(),
  size: Math.random() * 2 + 0.5,
  vx: (Math.random() - 0.5) * 0.0003,
  vy: (Math.random() - 0.5) * 0.0003,
  alpha: Math.random() * 0.4 + 0.1,
  pulse: Math.random() * Math.PI * 2
}));

let mouseHpX = 0.5, mouseHpY = 0.5;
hpc.addEventListener('mousemove', e => {
  const r = hpc.getBoundingClientRect();
  mouseHpX = (e.clientX - r.left) / hpW;
  mouseHpY = (e.clientY - r.top)  / hpH;
});

function drawParticles(t) {
  hpx.clearRect(0, 0, hpW, hpH);
  particles.forEach((p, i) => {
    p.pulse += 0.01;
    const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

    // Mouse repulsion
    const dx = p.x - mouseHpX, dy = p.y - mouseHpY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.12) {
      p.x += dx * 0.001 / (dist + 0.001);
      p.y += dy * 0.001 / (dist + 0.001);
    }

    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
    if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;

    // Draw connections
    particles.forEach((p2, j) => {
      if (j <= i) return;
      const dx2 = p.x - p2.x, dy2 = p.y - p2.y;
      const d2 = Math.sqrt(dx2*dx2 + dy2*dy2);
      if (d2 < 0.12) {
        hpx.beginPath();
        hpx.strokeStyle = `rgba(0,122,255,${0.06 * (1 - d2/0.12)})`;
        hpx.lineWidth = 0.5;
        hpx.moveTo(p.x * hpW, p.y * hpH);
        hpx.lineTo(p2.x * hpW, p2.y * hpH);
        hpx.stroke();
      }
    });

    hpx.beginPath();
    hpx.arc(p.x * hpW, p.y * hpH, p.size, 0, Math.PI * 2);
    hpx.fillStyle = `rgba(0,122,255,${a})`;
    hpx.fill();
  });
  requestAnimationFrame(drawParticles);
}
requestAnimationFrame(drawParticles);


// ── FOOTER PARTICLES ─────────────────────────────────────────────────
const fpc = document.getElementById('footerParticles');
if (fpc) {
  const fpx = fpc.getContext('2d');
  let fpW, fpH;
  function resizeFp() {
    fpW = fpc.width  = fpc.offsetWidth;
    fpH = fpc.height = fpc.offsetHeight;
  }
  resizeFp();
  window.addEventListener('resize', resizeFp);

  const fp = Array.from({ length: 40 }, () => ({
    x: Math.random() * fpW,
    y: Math.random() * fpH,
    size: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -Math.random() * 0.5 - 0.2,
    alpha: Math.random() * 0.3 + 0.05
  }));

  function drawFooterParticles() {
    fpx.clearRect(0, 0, fpW, fpH);
    fp.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.alpha -= 0.0005;
      if (p.y < -5 || p.alpha <= 0) {
        p.x = Math.random() * fpW;
        p.y = fpH + 5;
        p.alpha = Math.random() * 0.3 + 0.05;
        p.vy = -Math.random() * 0.5 - 0.2;
      }
      fpx.beginPath();
      fpx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fpx.fillStyle = `rgba(0,122,255,${p.alpha})`;
      fpx.fill();
    });
    requestAnimationFrame(drawFooterParticles);
  }
  requestAnimationFrame(drawFooterParticles);
}


// ── SLIDESHOW ────────────────────────────────────────────────────────
const slides = document.querySelectorAll('.slideshow img');
const dotsWrap = document.getElementById('slideDots');
let cur = 0;

slides.forEach((_, i) => {
  const d = document.createElement('button');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.setAttribute('aria-label', 'Photo ' + (i + 1));
  d.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(d);
});

const dots = document.querySelectorAll('.dot');

function goTo(n) {
  slides[cur].classList.remove('active');
  dots[cur].classList.remove('active');
  cur = n;
  slides[cur].classList.add('active');
  dots[cur].classList.add('active');
}

setInterval(() => goTo((cur + 1) % slides.length), 4200);


// ── SCROLL REVEAL ────────────────────────────────────────────────────
const revEls = document.querySelectorAll('.reveal, .reveal-hero');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.07 });
revEls.forEach(el => revObs.observe(el));


// ── HEADER SCROLL ────────────────────────────────────────────────────
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


// ── MOBILE MENU ───────────────────────────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (menuToggle) menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobileMenu() { mobileMenu.classList.remove('open'); }
window.closeMobileMenu = closeMobileMenu;


// ── COUNTER ANIMATION ─────────────────────────────────────────────────
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  if (isNaN(target)) return;
  const duration = 1600;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num[data-target], .istat-num.counter[data-target]').forEach(animateCount);
      cntObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.hero-stats, .impact-row').forEach(el => cntObs.observe(el));


// ── 3D CARD TILT ──────────────────────────────────────────────────────
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    const tx = x * 8, ty = -y * 8;
    card.style.transform = `perspective(1000px) rotateY(${tx}deg) rotateX(${ty}deg) translateZ(8px)`;

    // Glow follows mouse
    const glow = card.querySelector('.exp-card-glow, .case-glow, .proj-bg-glow');
    if (glow) {
      glow.style.left = (e.clientX - r.left - 150) + 'px';
      glow.style.top  = (e.clientY - r.top  - 150) + 'px';
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    const glow = card.querySelector('.exp-card-glow, .case-glow');
    if (glow) { glow.style.left = ''; glow.style.top = ''; }
  });
});


// ── MAGNETIC BUTTONS ──────────────────────────────────────────────────
document.querySelectorAll('.mag-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    setTimeout(() => { btn.style.transition = ''; }, 500);
  });
});


// ── SIDEBAR NAV DOTS ──────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id], footer[id]');
const sdots    = document.querySelectorAll('.sdot');

const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      sdots.forEach(d => d.classList.remove('active'));
      const active = document.querySelector(`.sdot[data-section="${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => secObs.observe(s));

sdots.forEach(d => {
  d.addEventListener('click', () => {
    const target = document.getElementById(d.dataset.section);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});


// ── CICD HOVER ANIMATION ──────────────────────────────────────────────
document.querySelectorAll('.cicd-flow').forEach(flow => {
  const steps = flow.querySelectorAll('.cicd-step');
  const parent = flow.closest('.case-card');
  if (!parent) return;
  parent.addEventListener('mouseenter', () => {
    steps.forEach((s, i) => {
      setTimeout(() => {
        s.querySelector('.cicd-icon').style.transform = 'scale(1.1) translateY(-3px)';
        s.querySelector('.cicd-icon').style.background = 'rgba(0,122,255,0.12)';
        s.querySelector('.cicd-icon').style.borderColor = 'rgba(0,122,255,0.3)';
        s.querySelector('.cicd-icon svg').style.color = '#007AFF';
      }, i * 80);
    });
  });
  parent.addEventListener('mouseleave', () => {
    steps.forEach(s => {
      const ico = s.querySelector('.cicd-icon');
      ico.style.transform = '';
      if (!s.classList.contains('accent') && !s.classList.contains('success')) {
        ico.style.background = '';
        ico.style.borderColor = '';
        ico.querySelector('svg').style.color = '';
      }
    });
  });
});


// ── SECTION TRANSITIONS ───────────────────────────────────────────────
// Text scramble effect for section titles
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const old = this.el.innerText;
    const len = Math.max(old.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < len; i++) {
      const from = old[i] || '';
      const to   = newText[i] || '';
      const start = Math.floor(Math.random() * 10);
      const end   = start + Math.floor(Math.random() * 12);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = ''; let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) { complete++; output += to; }
      else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="opacity:0.4;color:#007AFF">${char}</span>`;
      } else { output += from; }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) { this.resolve(); return; }
    this.frameRequest = requestAnimationFrame(this.update);
    this.frame++;
  }
}

// Apply scramble to eyebrow texts on section entry
const scrambleObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const labels = e.target.querySelectorAll('.section-label');
      labels.forEach(label => {
        const ts = new TextScramble(label);
        ts.setText(label.textContent.trim());
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('section').forEach(s => scrambleObs.observe(s));


// ── PARALLAX HERO ─────────────────────────────────────────────────────
const heroSection = document.querySelector('.hero');
window.addEventListener('scroll', () => {
  const st = window.scrollY;
  if (!heroSection) return;
  const heroH = heroSection.offsetHeight;
  if (st > heroH) return;
  const p = st / heroH;
  const photoWrap = document.querySelector('.hero-photo-wrap');
  const heroText  = document.querySelector('.hero-text');
  if (photoWrap) photoWrap.style.transform = `translateY(${p * 40}px)`;
  if (heroText)  heroText.style.transform  = `translateY(${p * 20}px)`;
  heroSection.style.opacity = 1 - p * 0.5;
}, { passive: true });


// ── STACK PILLS STAGGER ───────────────────────────────────────────────
document.querySelectorAll('.spill').forEach((pill, i) => {
  pill.style.transitionDelay = (i * 0.04) + 's';
});


// ── SKILLS LIST STAGGER ───────────────────────────────────────────────
document.querySelectorAll('.skills-list li, .exp-highlights .hl-item').forEach((el, i) => {
  el.style.animationDelay = (i * 0.06) + 's';
});


// ── ORB MOUSE TRACKING ────────────────────────────────────────────────
document.addEventListener('mousemove', e => {
  const orbs = document.querySelectorAll('.orb');
  const cx = e.clientX / window.innerWidth  - 0.5;
  const cy = e.clientY / window.innerHeight - 0.5;
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 8;
    orb.style.transform = `translateX(${cx * factor}px) translateY(${cy * factor}px)`;
  });
}, { passive: true });


// ── SMOOTH ANCHOR SCROLL ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── PROJ CARD 3D TILT (extra) ─────────────────────────────────────────
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-6px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});


// ── PHOTO WRAP 3D MOUSE ───────────────────────────────────────────────
const photoWrap = document.querySelector('.hero-photo-wrap');
if (photoWrap) {
  document.addEventListener('mousemove', e => {
    const r = photoWrap.getBoundingClientRect();
    const px = r.left + r.width / 2, py = r.top + r.height / 2;
    const dx = (e.clientX - px) / window.innerWidth;
    const dy = (e.clientY - py) / window.innerHeight;
    const curr = parseFloat(photoWrap.style.getPropertyValue('--parallax-y') || 0);
    photoWrap.querySelector('.photo-glass-card').style.transform =
      `perspective(1000px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg)`;
  }, { passive: true });
}