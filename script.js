/* ש.ל.ג חשבונאות ומיסים — interactions */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  const toggle = $('.nav__toggle');
  const mobile = $('#mobile-menu');
  if (toggle && mobile) {
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      mobile.hidden = true;
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobile.hidden = open;
    });
    $$('a', mobile).forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ---------- Scrolled nav ---------- */
  const nav = $('#nav');
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 12);
    const top = $('[data-totop]');
    if (top) top.classList.toggle('show', y > 600);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Back to top ---------- */
  const totop = $('[data-totop]');
  if (totop) totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ---------- Counters ---------- */
  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || '';
        const dur = 1400;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          const value = Math.round(target * eased);
          el.textContent = value + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => co.observe(el));
  } else {
    counters.forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
  }

  /* ---------- Hero 3D tilt (pointer) ---------- */
  const stage = $('[data-tilt]');
  if (stage && !reduce && matchMedia('(hover: hover)').matches) {
    const wrap = stage.parentElement;
    let raf = null, tx = 0, ty = 0;
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      tx = -x * 14;
      ty = y * 14;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const apply = () => {
      raf = null;
      stage.style.transform = `rotateX(${8 + ty}deg) rotateY(${-12 + tx}deg)`;
    };
    const reset = () => { stage.style.transform = ''; };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', reset);
  }

  /* ---------- Card glow follow ---------- */
  $$('.card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Testimonial slider (RTL aware) ---------- */
  const slider = $('[data-slider]');
  if (slider) {
    const track = $('[data-track]', slider);
    const buttons = $$('button[data-go]', slider);
    const step = () => {
      const first = track.children[0];
      if (!first) return 320;
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16;
      return first.getBoundingClientRect().width + gap;
    };
    buttons.forEach(btn => btn.addEventListener('click', () => {
      const dir = parseInt(btn.dataset.go, 10);
      // In RTL, scrollLeft is negative going right; use scrollBy with our dir
      track.scrollBy({ left: dir * step(), behavior: 'smooth' });
    }));
  }

  /* ---------- Form (graceful fallback to mailto) ---------- */
  const form = $('.form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = $('[data-msg]', form);
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.name || !data.phone || !data.email) {
        if (msg) {
          msg.hidden = false;
          msg.className = 'form__msg err';
          msg.textContent = 'אנא מלאו את השדות הנדרשים.';
        }
        return;
      }
      const subject = encodeURIComponent(`פנייה מהאתר — ${data.topic || 'כללי'}`);
      const body = encodeURIComponent(
        `שם: ${data.name}\nטלפון: ${data.phone}\nאימייל: ${data.email}\nנושא: ${data.topic || ''}\n\nהודעה:\n${data.msg || ''}`
      );
      // TODO: עדכן את כתובת האימייל בעת קבלת פרטי המשרד
      const to = 'office@sheleg-cpa.co.il';
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      if (msg) {
        msg.hidden = false;
        msg.className = 'form__msg ok';
        msg.textContent = 'תודה! נחזור אליכם תוך יום עסקים.';
      }
      form.reset();
    });
  }

  /* ---------- Snow / particles canvas ---------- */
  const canvas = $('#snow');
  if (canvas && !reduce) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let w, h, dpr, flakes = [], rafId;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      const count = Math.min(90, Math.floor(innerWidth / 16));
      flakes = Array.from({ length: count }, () => spawn());
    };

    const spawn = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.6 + 0.4) * dpr,
      vy: (Math.random() * 0.4 + 0.15) * dpr,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      a: Math.random() * 0.6 + 0.2,
      hue: Math.random() < .15 ? 'gold' : 'ice',
    });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.vy;
        f.x += f.vx + Math.sin((f.y + f.r) * 0.005) * 0.3;
        if (f.y > h + 6) { f.y = -6; f.x = Math.random() * w; }
        if (f.x < -6) f.x = w + 6;
        if (f.x > w + 6) f.x = -6;
        ctx.beginPath();
        const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 4);
        if (f.hue === 'gold') {
          grd.addColorStop(0, `rgba(244,210,124,${f.a})`);
          grd.addColorStop(1, 'rgba(244,210,124,0)');
        } else {
          grd.addColorStop(0, `rgba(214,238,255,${f.a})`);
          grd.addColorStop(1, 'rgba(214,238,255,0)');
        }
        ctx.fillStyle = grd;
        ctx.arc(f.x, f.y, f.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    let to;
    addEventListener('resize', () => { clearTimeout(to); to = setTimeout(resize, 150); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else draw();
    });
  }

  /* ---------- Smooth anchor offset for sticky nav ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = ($('#nav')?.offsetHeight || 0) + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();
