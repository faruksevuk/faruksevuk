// ── Hide scroll hint on first scroll ──────────────────────────
const scrollHint = document.getElementById('scrollHint');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    scrollHint?.classList.add('hidden');
  } else {
    scrollHint?.classList.remove('hidden');
  }
}, { passive: true });

// ── Custom cursor ──────────────────────────────────────────────
document.addEventListener('mousemove', (e) => {
  document.body.style.setProperty('--cx', e.clientX + 'px');
  document.body.style.setProperty('--cy', e.clientY + 'px');
});

// ── Particle trail ─────────────────────────────────────────────
let lastParticle = 0;
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastParticle < 80) return;
  lastParticle = now;

  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 5 + 5;
  p.style.cssText = `
    left: ${e.clientX - size / 2}px;
    top: ${e.clientY - size / 2}px;
    width: ${size}px;
    height: ${size}px;
  `;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 1100);
});

// ── Stars canvas ───────────────────────────────────────────────
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];

function initStars() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.3,
    alpha: Math.random(),
    speed: Math.random() * 0.008 + 0.002,
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

initStars();
drawStars();
window.addEventListener('resize', initStars);

// ── Avatar double-click → Matrix Easter egg ───────────────────
const profileImage = document.getElementById('profileImage');
let audio;
let clickCount = 0;
let clickTimer = null;

profileImage.addEventListener('click', () => {
  clickCount++;
  if (clickCount === 2) {
    clickCount = 0;
    clearTimeout(clickTimer);
    clickTimer = null;

    profileImage.classList.add('revealed');

    try {
      audio = new Audio('sounds/matrix.mp3');
      audio.loop = false;
      audio.play();
    } catch (_) {}

    startMatrix();
    setTimeout(() => {
      stopMatrix("You found the treasure! It's me, hehe :)");
    }, 5200);
  } else {
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 400);
  }
});

function startMatrix() {
  const wrap = document.createElement('div');
  wrap.id = 'matrix';
  document.body.appendChild(wrap);

  const mc = document.createElement('canvas');
  wrap.appendChild(mc);
  mc.width = window.innerWidth;
  mc.height = window.innerHeight;

  const mctx = mc.getContext('2d');
  const alphabet = 'アァカサタナハマヤャラワガザダバパABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const fontSize = 16;
  const cols = Math.floor(mc.width / fontSize);
  const drops = new Array(cols).fill(1);

  function draw() {
    mctx.fillStyle = 'rgba(0,0,0,0.05)';
    mctx.fillRect(0, 0, mc.width, mc.height);
    mctx.fillStyle = '#0F0';
    mctx.font = `${fontSize}px monospace`;
    drops.forEach((y, i) => {
      mctx.fillText(alphabet[Math.floor(Math.random() * alphabet.length)], i * fontSize, y * fontSize);
      if (y * fontSize > mc.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  wrap._interval = setInterval(draw, 33);
}

function stopMatrix(msg) {
  const wrap = document.getElementById('matrix');
  if (!wrap) return;
  clearInterval(wrap._interval);

  const mc = wrap.querySelector('canvas');
  const mctx = mc.getContext('2d');
  mctx.fillStyle = '#ff2222';
  mctx.font = 'bold 48px Griffy, serif';
  mctx.textAlign = 'center';
  mctx.fillText(msg, mc.width / 2, mc.height / 2);

  setTimeout(() => {
    wrap.remove();
    if (audio) { audio.pause(); audio.currentTime = 0; }
  }, 3300);
}