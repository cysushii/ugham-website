// ── Page Transitions ──
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('page-transition');
  if (overlay) { requestAnimationFrame(() => { overlay.classList.add('loaded'); setTimeout(() => overlay.style.display = 'none', 500); }); }
});
document.querySelectorAll('a').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = anchor.getAttribute('href');
    if (target && target.endsWith('.html') && !anchor.hasAttribute('target')) {
      e.preventDefault();
      const overlay = document.getElementById('page-transition');
      if (overlay) { overlay.style.display = 'block'; overlay.classList.remove('loaded'); overlay.classList.add('animating'); setTimeout(() => window.location.href = target, 400); }
      else { window.location.href = target; }
    }
  });
});

// ── Navbar scroll ──
const nav = document.querySelector('#navbar');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));

// ── Mobile menu ──
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => { navLinks.classList.toggle('open'); menuToggle.textContent = navLinks.classList.contains('open') ? '\u2715' : '\u2630'; });
}

// ── Scroll Animations (unique per section) ──
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.anim-el').forEach(el => animObserver.observe(el));

// ── Ugham Brand Orbit (Logo in Center) ──
const orbitCanvas = document.getElementById('orbitCanvas');
if (orbitCanvas) {
  const ctx = orbitCanvas.getContext('2d');
  const size = orbitCanvas.width;
  const cx = size / 2, cy = size / 2;
  let t = 0;
  const centerLogo = new Image();
  centerLogo.src = 'assets/img/logo.png';

  // SVG icon paths (professional)
  const icons = [
    { path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', r: size * 0.24, speed: 0.008, angle: 0, color: '#7C3AED' },       // layers
    { path: 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z', r: size * 0.37, speed: 0.005, angle: 2.1, color: '#C026D3' }, // star
    { path: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M18.364 18.364l-.707-.707M12 21v-1m-4.95-.636l-.707.707M4 12H3m3.343-5.657l-.707-.707', r: size * 0.24, speed: 0.008, angle: 4.2, color: '#4338CA' }, // sun
    { path: 'M13 10V3L4 14h7v7l9-11h-7z', r: size * 0.37, speed: 0.005, angle: 0.7, color: '#7C3AED' },    // bolt
    { path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z', r: size * 0.46, speed: 0.003, angle: 3.5, color: '#C026D3' }, // globe
  ];

  function drawOrbit() {
    ctx.clearRect(0, 0, size, size);
    t += 0.5;

    // Orbit rings
    const r1 = size * 0.24, r2 = size * 0.37, r3 = size * 0.46;
    [r1, r2, r3].forEach(r => {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(124,58,237,0.12)'; ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]); ctx.stroke(); ctx.setLineDash([]);
    });

    // Center glow
    const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, size * 0.18);
    grad.addColorStop(0, 'rgba(67,56,202,0.15)');
    grad.addColorStop(1, 'rgba(192,38,211,0.05)');
    ctx.beginPath(); ctx.arc(cx, cy, size * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();

    // Spinning arc
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.01);
    const arcGrad = ctx.createLinearGradient(-size * 0.18, 0, size * 0.18, 0);
    arcGrad.addColorStop(0, '#4338CA'); arcGrad.addColorStop(0.5, '#7C3AED'); arcGrad.addColorStop(1, '#C026D3');
    ctx.beginPath(); ctx.arc(0, 0, size * 0.18, -0.5, Math.PI + 0.5);
    ctx.strokeStyle = arcGrad; ctx.lineWidth = 4; ctx.stroke();
    ctx.restore();

    // Center logo
    if (centerLogo.complete && centerLogo.naturalWidth > 0) {
      const lw = size * 0.28, lh = size * 0.16;
      ctx.drawImage(centerLogo, cx - lw / 2, cy - lh / 2, lw, lh);
    }

    // Orbiting nodes (circles with FontAwesome icons)
    icons.forEach(node => {
      node.angle += node.speed;
      const nx = cx + Math.cos(node.angle) * node.r;
      const ny = cy + Math.sin(node.angle) * node.r;

      // White circle bg
      ctx.beginPath(); ctx.arc(nx, ny, size * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.shadowColor = node.color; ctx.shadowBlur = 15;
      ctx.fill(); ctx.shadowBlur = 0;

      // Colored dot in center of node
      ctx.beginPath(); ctx.arc(nx, ny, size * 0.02, 0, Math.PI * 2);
      ctx.fillStyle = node.color; ctx.fill();
    });

    requestAnimationFrame(drawOrbit);
  }
  // Wait for fonts then start
  if (document.fonts) document.fonts.ready.then(drawOrbit);
  else drawOrbit();
}

// ── DNA Helix (About page) ──
const dnaCanvas = document.getElementById('dnaCanvas');
if (dnaCanvas) {
  const ctx = dnaCanvas.getContext('2d'); let w, h, time = 0;
  function resizeDNA() { w = dnaCanvas.width = window.innerWidth; h = dnaCanvas.height = window.innerHeight; }
  window.addEventListener('resize', resizeDNA); resizeDNA();
  function drawDNA() {
    ctx.clearRect(0, 0, w, h); time += 0.018;
    const cols = Math.max(1, Math.floor(w / 200));
    for (let c = 0; c < cols; c++) {
      const cx2 = (c + 0.5) * (w / cols);
      const num = 20, spacing = h / (num + 2);
      for (let i = 0; i < num; i++) {
        const y = spacing * (i + 1), shift = (i / num) * Math.PI * 3 + c * 1.5;
        const x1 = cx2 + Math.sin(time + shift) * 50;
        const x2 = cx2 + Math.sin(time + shift + Math.PI) * 50;
        ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y);
        ctx.strokeStyle = 'rgba(124,58,237,0.15)'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(x1, y, 4, 0, Math.PI * 2); ctx.fillStyle = 'rgba(67,56,202,0.4)'; ctx.fill();
        ctx.beginPath(); ctx.arc(x2, y, 4, 0, Math.PI * 2); ctx.fillStyle = 'rgba(192,38,211,0.4)'; ctx.fill();
      }
    }
    requestAnimationFrame(drawDNA);
  }
  drawDNA();
}

// ── Starry Light (What We Do) ──
const stCanvas = document.getElementById('starryLightCanvas');
if (stCanvas) {
  const ctx = stCanvas.getContext('2d'); let w, h, stars = [];
  function resizeSt() { w = stCanvas.width = stCanvas.offsetWidth; h = stCanvas.height = stCanvas.offsetHeight; }
  window.addEventListener('resize', resizeSt); resizeSt();
  for (let i = 0; i < 120; i++) stars.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2.5, speed: Math.random() * 0.4 + 0.1, opacity: Math.random() });
  function drawSt() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      s.y -= s.speed; s.opacity += 0.01;
      if (s.y < 0) { s.y = h; s.x = Math.random() * w; s.opacity = 0; }
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124,58,237,${0.2 + Math.abs(Math.sin(s.opacity)) * 0.5})`; ctx.fill();
    });
    requestAnimationFrame(drawSt);
  }
  drawSt();
}

// ── Ripple (Collab) ──
const rippleCanvas = document.getElementById('rippleCanvas');
if (rippleCanvas) {
  const ctx = rippleCanvas.getContext('2d'); let w, h, t = 0;
  function resizeRip() { w = rippleCanvas.width = rippleCanvas.offsetWidth; h = rippleCanvas.height = rippleCanvas.offsetHeight; }
  window.addEventListener('resize', resizeRip); resizeRip();
  function drawRip() {
    ctx.clearRect(0, 0, w, h); t += 0.04;
    const cx = w / 2, cy = h / 2;
    for (let i = 0; i < 6; i++) {
      let radius = ((t * 15 + i * 60) % 350);
      let alpha = 1 - (radius / 350);
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(124,58,237,${alpha * 0.4})`; ctx.lineWidth = 2; ctx.stroke();
    }
    requestAnimationFrame(drawRip);
  }
  drawRip();
}

// Mobile scroll-activated animations (reliable width check)
if(window.innerWidth <= 768){
  const mio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) { e.target.classList.add('scroll-visible'); }
      else { e.target.classList.remove('scroll-visible'); }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
  
  const selectors = '.ia-card,.hex-card,.expertise-card,.info-card,.kanban-card,.flow-step,.bento-card,.price-card,.expertise-v2,.vm-panel,.reason-item,.ds-card,.trophy-card,.partner-pill,.ex-strip,.tower-item';
  document.querySelectorAll(selectors).forEach(el => mio.observe(el));
}

// Registration Form & Floating Button Logic
document.addEventListener('DOMContentLoaded', () => {
  const floatBtn = document.getElementById('floatingRegisterBtn');
  const regForm = document.getElementById('registration-form');
  
  if (floatBtn && regForm) {
    window.addEventListener('scroll', () => {
      const rect = regForm.getBoundingClientRect();
      // Hide button if form is fully in view or user scrolled past it
      if (rect.top < window.innerHeight - 100) {
        floatBtn.classList.remove('show');
      } else {
        floatBtn.classList.add('show');
      }
    });
    // trigger once
    window.dispatchEvent(new Event('scroll'));
  }

  const form = document.getElementById('ughamContactForm');
  if(form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...';
      btn.disabled = true;

      // EXCEL SHEET INTEGRATION (Google Apps Script)
      // Note: Replace this SCRIPT_URL with your actual Google Apps Script web app URL
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxTIk7_bfbH3OETWd-KEQgWlYxd3DrS7-nmFSG4zCDuSdAXxDrZijmA8HrulgjW8Z0cFA/exec'; 
      
      const formData = new FormData(form);
      
      fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Required for Google Scripts without CORS setup
      }).then(() => {
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      }).catch(err => {
        console.error(err);
        // Fallback UI just in case of actual network failure
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block'; 
      });
    });
  }
});
