/* ── PRÉFÉRENCE MOUVEMENT RÉDUIT ── */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── MENU MOBILE (burger) ── */
const burger  = document.getElementById('navBurger');
const navMenu = document.getElementById('navLinks');
if (burger && navMenu) {
  const toggleMenu = (open) => {
    navMenu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };
  burger.addEventListener('click', () => toggleMenu(!navMenu.classList.contains('open')));
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
}

/* ── BARRE DE PROGRESSION DU SCROLL ── */
const progress = document.getElementById('scrollProgress');
if (progress) {
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progress.style.width = (scrolled * 100) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ── ANNÉE DYNAMIQUE (footer) ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (i * 0.08) + 's';
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


/* ── LIEN NAV ACTIF ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--cyan)' : '';
  });
});


/* ── FORMULAIRE DE CONTACT (Web3Forms) ── */
/* Envoie réellement le message via l'API Web3Forms, sans quitter la page. */
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = document.getElementById('submitBtn');
  const reset = (text, bg) => {
    btn.textContent      = text;
    btn.style.background  = bg || '';
  };

  btn.disabled = true;
  reset('Envoi en cours…', 'var(--amber)');

  try {
    const res  = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Accept': 'application/json' },
      body:    new FormData(form),
    });
    const data = await res.json();

    if (data.success) {
      reset('Message envoyé ✓', 'var(--cyan)');
      form.reset();
    } else {
      reset('Erreur — réessayez', 'var(--amber)');
      console.error('Web3Forms:', data);
    }
  } catch (err) {
    reset('Erreur réseau — réessayez', 'var(--amber)');
    console.error(err);
  }

  setTimeout(() => {
    btn.disabled = false;
    reset('Envoyer le message →');
  }, 4000);
}


/* ── EFFET DE FRAPPE (hero-role) ── */
const typeEl = document.querySelector('.hero-role');
if (typeEl) {
  const texts = [
    "Étudiant en cybersécurité @ ESAIP Angers",
    "Passionné par la sécurité informatique",
    "Réserviste militaire & bénévole",
    "En recherche d'alternance",
  ];
  let tIdx = 0, cIdx = 0, deleting = false;

  function typeWriter() {
    const current = texts[tIdx];
    if (!deleting && cIdx <= current.length) {
      typeEl.textContent = current.substring(0, cIdx++);
      setTimeout(typeWriter, 60);
    } else if (cIdx > current.length) {
      deleting = true;
      setTimeout(typeWriter, 2000);
    } else if (deleting && cIdx >= 0) {
      typeEl.textContent = current.substring(0, cIdx--);
      setTimeout(typeWriter, 35);
    } else {
      deleting = false;
      tIdx = (tIdx + 1) % texts.length;
      setTimeout(typeWriter, 400);
    }
  }
  setTimeout(typeWriter, 1500);
}
