/* ═══════════════════════════════════════════════════════
   TYRELL BAKER — PORTFOLIO SCRIPT
   Features: Custom cursor, magnetic buttons, GSAP scroll
   animations, canvas noise background, text reveals
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Wait for GSAP to load ───────────────────────────
  const initGSAP = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(initGSAP, 100);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    initAll();
  };
  initGSAP();

  // ─── Custom Cursor ───────────────────────────────────
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Smooth cursor ring follows with lerp
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor states
  document.querySelectorAll('a, button, .mag-btn, .bento-card, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform  = 'translate(-50%,-50%) scale(2)';
      cursorRing.style.width     = '56px';
      cursorRing.style.height    = '56px';
      cursorRing.style.borderColor = 'var(--amber)';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform  = 'translate(-50%,-50%) scale(1)';
      cursorRing.style.width     = '36px';
      cursorRing.style.height    = '36px';
      cursorRing.style.borderColor = 'rgba(232,162,58,0.5)';
    });
  });

  // ─── Canvas Animated Background ─────────────────────
  (function initCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h, particles = [];
    const NUM = 80;

    function resize() {
      w = canvas.width  = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Build particles
    for (let i = 0; i < NUM; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.4,
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.25,
        o: Math.random() * 0.4 + 0.1,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, w, h);

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(232,162,58,${0.04 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,162,58,${p.o})`;
        ctx.fill();

        // Move
        p.x += p.dx;
        p.y += p.dy;

        // Wrap edges
        if (p.x < 0)  p.x = w;
        if (p.x > w)  p.x = 0;
        if (p.y < 0)  p.y = h;
        if (p.y > h)  p.y = 0;
      });

      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  })();

  // ─── Nav Scroll Effect ───────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ─── Magnetic Buttons ────────────────────────────────
  document.querySelectorAll('.mag-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect  = btn.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) * 0.35;
      const dy    = (e.clientY - cy) * 0.35;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0)';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s linear';
    });
  });

  // ─── Main GSAP Animations ────────────────────────────
  function initAll() {

    // --- Hero title stagger reveal ---
    gsap.set('.hero-title .hero-line', { overflow: 'hidden' });

    const heroTL = gsap.timeline({ delay: 0.2 });

    heroTL
      .from('.hero-badge', {
        opacity: 0, y: 24, duration: 0.7, ease: 'power3.out'
      })
      .from('.hero-title .hero-line', {
        opacity: 0,
        y: '105%',
        duration: 1,
        ease: 'power4.out',
        stagger: 0.12,
      }, '-=0.3')
      .from('.hero-sub', {
        opacity: 0, y: 24, duration: 0.7, ease: 'power3.out'
      }, '-=0.5')
      .from('.hero-actions', {
        opacity: 0, y: 20, duration: 0.6, ease: 'power3.out'
      }, '-=0.4');

    // --- Generic reveal-up elements ---
    gsap.utils.toArray('.reveal-up').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 44 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // --- Staggered card reveals ---
    gsap.utils.toArray('.reveal-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: (i % 4) * 0.08,
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // --- Showcase mocks slide in ---
    gsap.utils.toArray('.mock-browser').forEach((mock, i) => {
      const fromLeft = i % 2 === 0;
      gsap.fromTo(mock,
        { opacity: 0, x: fromLeft ? 60 : -60 },
        {
          opacity: 1, x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: mock,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // --- Parallax orbs in hero ---
    gsap.to('.orb-1', {
      y: -120,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
    gsap.to('.orb-2', {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
      }
    });

    // --- Section title split char animation ---
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.fromTo(title,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 88%',
          }
        }
      );
    });

    // --- Bento grid stagger ---
    const bentoCards = gsap.utils.toArray('.bento-card');
    bentoCards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, scale: 0.95, y: 24 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 0.6,
          ease: 'power3.out',
          delay: i * 0.06,
          scrollTrigger: {
            trigger: '.bento-grid',
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // --- Process steps cascade ---
    gsap.utils.toArray('.process-step').forEach((step, i) => {
      gsap.fromTo(step,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0,
          duration: 0.65,
          ease: 'power3.out',
          delay: i * 0.12,
          scrollTrigger: {
            trigger: '.process-steps',
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // --- Contact cards cascade ---
    gsap.utils.toArray('.contact-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0,
          duration: 0.65,
          ease: 'power3.out',
          delay: i * 0.12,
          scrollTrigger: {
            trigger: '.contact-cards',
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // --- Amber glow on scroll for hero CTA ---
    gsap.to('.btn-primary', {
      boxShadow: '0 0 50px rgba(232,162,58,0.5)',
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: 'sine.inOut',
    });

    // --- Showcase sections horizontal parallax ---
    gsap.utils.toArray('.showcase-copy').forEach(copy => {
      gsap.fromTo(copy,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: copy,
            start: 'top 85%',
          }
        }
      );
    });

    // --- Number counter animation for bento stat ---
    const bentoStat = document.querySelector('.bento-stat');
    if (bentoStat) {
      ScrollTrigger.create({
        trigger: bentoStat,
        start: 'top 85%',
        onEnter: () => {
          let count = 0;
          const target = 100;
          const duration = 1200;
          const step = duration / target;
          const timer = setInterval(() => {
            count++;
            bentoStat.textContent = count + '%';
            if (count >= target) clearInterval(timer);
          }, step);
        }
      });
    }

    // --- Footer fade in ---
    gsap.fromTo('.footer',
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 95%',
        }
      }
    );
  }

  // ─── Smooth Scroll for nav links ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── Active nav link on scroll ───────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function setActiveNav() {
    const scrollY = window.scrollY;
    sections.forEach(sec => {
      const top    = sec.offsetTop - 100;
      const bottom = top + sec.offsetHeight;
      const id     = sec.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < bottom);
      }
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });

  // ─── Tilt effect on showcase mocks ───────────────────
  document.querySelectorAll('.mock-browser').forEach(mock => {
    mock.addEventListener('mousemove', (e) => {
      const rect = mock.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const rx = ((e.clientY - cy) / rect.height) * -8;
      const ry = ((e.clientX - cx) / rect.width)  *  8;
      mock.style.transform      = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      mock.style.transition     = 'transform 0.1s linear';
    });
    mock.addEventListener('mouseleave', () => {
      mock.style.transform  = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      mock.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    });
  });

  // ─── Marquee pause on hover ──────────────────────────
  const marqueeContent = document.querySelector('.marquee-content');
  if (marqueeContent) {
    marqueeContent.addEventListener('mouseenter', () => {
      marqueeContent.style.animationPlayState = 'paused';
    });
    marqueeContent.addEventListener('mouseleave', () => {
      marqueeContent.style.animationPlayState = 'running';
    });
  }

  // ─── Hover glow on bento cards ───────────────────────
  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(200px at ${x}px ${y}px, rgba(232,162,58,0.06), transparent 70%), var(--surface)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  // ─── Contact card ripple effect ──────────────────────
  document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const rect   = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        background:rgba(232,162,58,0.2);
        width:10px; height:10px;
        left:${e.clientX - rect.left - 5}px;
        top:${e.clientY - rect.top  - 5}px;
        transform:scale(0);
        animation:ripple 0.6s ease-out;
        pointer-events:none;
        z-index:0;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframe
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes ripple {
      to { transform: scale(30); opacity: 0; }
    }
    .nav-link.active { color: var(--text) !important; }
    .nav-link.active::after { width: 100% !important; }
  `;
  document.head.appendChild(styleSheet);

  // ─── Page load bar ───────────────────────────────────
  (function initPageLoad() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position:fixed; top:0; left:0; height:2px; width:0;
      background:linear-gradient(90deg, var(--amber), var(--amber-light));
      z-index:99999; transition:width 0.3s ease; pointer-events:none;
    `;
    document.body.appendChild(bar);

    let w = 0;
    const interval = setInterval(() => {
      w = Math.min(w + Math.random() * 12, 90);
      bar.style.width = w + '%';
    }, 100);

    window.addEventListener('load', () => {
      clearInterval(interval);
      bar.style.width = '100%';
      setTimeout(() => {
        bar.style.opacity = '0';
        bar.style.transition = 'opacity 0.4s, width 0.3s ease';
        setTimeout(() => bar.remove(), 400);
      }, 300);
    });
  })();

});
