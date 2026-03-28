
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

const phrases = [
  "I build websites that convert.",
  "Modern websites for growing businesses.",
  "Fast, clean, professional web experiences.",
  "Your brand deserves better than a template.",
  "Static sites. Dynamic impressions."
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;

const typewriterEl = document.getElementById('typewriter');

function type() {
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    typewriterEl.textContent = currentPhrase.slice(0, ++charIndex);

    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(type, 2000);
      return;
    }
  } else {
    typewriterEl.textContent = currentPhrase.slice(0, --charIndex);

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
  }

  const delay = isDeleting ? 40 : 70 + Math.random() * 40;
  setTimeout(type, delay);
}

setTimeout(type, 1400);

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); 
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');
const orb3 = document.querySelector('.orb-3');

window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;

  if (orb1) orb1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
  if (orb3) orb3.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
});
