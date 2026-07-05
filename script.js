/* =====================================================================
   DRENCHED — minimal JS
   1) Scroll/entrance reveals (progressive enhancement — content is fully
      visible without JS; we only OPT IN to animating once JS runs and
      only when reduced-motion is not requested).
   2) The signature easter egg: double-click (or press Enter/Space twice)
      on the portrait -> ~5s green matrix rain -> "You found the treasure!"
      -> self-cleanup.
   No custom cursor, no particle trail, no perpetual background loop.
   ===================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Reveals ---------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  if (!prefersReduced && 'IntersectionObserver' in window && revealables.length) {
    // Arm: switch the base (visible) state over to the animate-from-hidden state.
    document.documentElement.classList.add('reveal-armed');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el, i) {
      // gentle stagger for the hero cluster
      el.style.transitionDelay = Math.min(i, 6) * 55 + 'ms';
      io.observe(el);
    });

    // Safety net: if anything is still hidden shortly after load, show it.
    window.setTimeout(function () {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    }, 1800);
  }
  // If reduced-motion or no IO: we never add 'reveal-armed', so CSS leaves
  // everything visible. Nothing to do.

  /* ---------- 2. Easter egg: matrix rain on portrait double-click ---------- */
  var portrait = document.getElementById('profileImage');
  if (!portrait) return;

  var running = false;
  var audio = null;

  function launchMatrix() {
    if (running) return;
    running = true;

    // audio is optional and must never break the gag
    try {
      audio = new Audio('sounds/matrix.mp3'); // not preloaded
      audio.loop = false;
      var p = audio.play();
      if (p && typeof p.catch === 'function') { p.catch(function () {}); }
    } catch (e) { /* no-op */ }

    var wrap = document.createElement('div');
    wrap.id = 'matrix-egg';
    wrap.setAttribute('role', 'img');
    wrap.setAttribute('aria-label', "You found the treasure! It's me, hehe :)");
    wrap.style.cssText =
      'position:fixed;inset:0;z-index:9999;background:#000;' +
      'display:flex;align-items:center;justify-content:center;';

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    wrap.appendChild(canvas);
    document.body.appendChild(wrap);

    var ctx = canvas.getContext('2d');
    function size() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    size();

    var glyphs = 'アァカサタナハマヤャラワガザダバパ0123456789FSABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var fontSize = 16;
    var cols = Math.floor(canvas.width / fontSize);
    var drops = new Array(cols).fill(1);

    var timer = null;
    // Under reduced-motion: skip the rain, just show the message on black.
    if (!prefersReduced) {
      timer = window.setInterval(function () {
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#7CFF4F';
        ctx.font = fontSize + 'px monospace';
        for (var i = 0; i < drops.length; i++) {
          var ch = glyphs.charAt(Math.floor(Math.random() * glyphs.length));
          ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      }, 33);
    }

    // message overlay
    var msg = document.createElement('p');
    msg.textContent = "You found the treasure! It's me, hehe :)";
    msg.style.cssText =
      'position:relative;z-index:1;margin:0;padding:0 1.2rem;text-align:center;' +
      "font-family:'Clash Display',system-ui,sans-serif;font-weight:700;" +
      'font-size:clamp(1.4rem,5vw,2.6rem);color:#c6f24e;letter-spacing:-0.03em;' +
      'text-shadow:0 0 24px rgba(124,255,79,0.6);opacity:0;' +
      'transition:opacity .5s ease-out;';
    wrap.appendChild(msg);

    window.setTimeout(function () { msg.style.opacity = '1'; }, prefersReduced ? 80 : 2600);

    function cleanup() {
      if (timer) window.clearInterval(timer);
      if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
      if (audio) { try { audio.pause(); audio.currentTime = 0; } catch (e) {} }
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', size);
      running = false;
    }
    function onKey(e) { if (e.key === 'Escape') cleanup(); }
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', size);

    window.setTimeout(cleanup, prefersReduced ? 2800 : 5200);
  }

  portrait.addEventListener('dblclick', launchMatrix);

  // Keyboard path (grafted from swiss-artifact): two Enter/Space presses
  // within 500ms trigger the same egg, so it's reachable without a pointer.
  var keyHits = 0;
  var keyTimer = null;
  portrait.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    e.preventDefault();
    keyHits++;
    if (keyHits >= 2) {
      keyHits = 0;
      if (keyTimer) { window.clearTimeout(keyTimer); }
      launchMatrix();
      return;
    }
    if (keyTimer) { window.clearTimeout(keyTimer); }
    keyTimer = window.setTimeout(function () { keyHits = 0; }, 500);
  });
})();
