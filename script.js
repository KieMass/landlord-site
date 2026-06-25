/* ============================================================
   HARLOW PROPERTIES — script.js
   Handles: sticky nav, mobile menu, listing filters, form validation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── STICKY NAV ──────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load


  /* ── MOBILE NAV TOGGLE ───────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    // Animate hamburger → X
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });


  /* ── LISTING FILTER ──────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.listing-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const type = card.dataset.type;
        if (filter === 'all' || type === filter) {
          card.classList.remove('hidden');
          // Small stagger animation
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = '';
            card.style.opacity   = '0';
            card.style.transform = 'translateY(12px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity    = '1';
              card.style.transform  = 'translateY(0)';
            });
          });
        } else {
          card.classList.add('hidden');
          card.style.opacity   = '';
          card.style.transform = '';
          card.style.transition = '';
        }
      });
    });
  });


  /* ── CONTACT FORM VALIDATION ─────────────────────────── */
  const form        = document.getElementById('contactForm');
  const nameInput   = document.getElementById('name');
  const emailInput  = document.getElementById('email');
  const msgInput    = document.getElementById('message');
  const nameError   = document.getElementById('nameError');
  const emailError  = document.getElementById('emailError');
  const msgError    = document.getElementById('messageError');
  const successMsg  = document.getElementById('formSuccess');

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const clearError = (input, errorEl) => {
    input.classList.remove('error');
    errorEl.textContent = '';
  };

  const setError = (input, errorEl, msg) => {
    input.classList.add('error');
    errorEl.textContent = msg;
  };

  // Live clear on input
  nameInput.addEventListener('input',  () => clearError(nameInput,  nameError));
  emailInput.addEventListener('input', () => clearError(emailInput, emailError));
  msgInput.addEventListener('input',   () => clearError(msgInput,   msgError));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Name
    if (!nameInput.value.trim()) {
      setError(nameInput, nameError, 'Please enter your name.');
      valid = false;
    } else {
      clearError(nameInput, nameError);
    }

    // Email
    if (!emailInput.value.trim()) {
      setError(emailInput, emailError, 'Please enter your email address.');
      valid = false;
    } else if (!isValidEmail(emailInput.value)) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // Message
    if (!msgInput.value.trim()) {
      setError(msgInput, msgError, 'Please write a short message.');
      valid = false;
    } else if (msgInput.value.trim().length < 10) {
      setError(msgInput, msgError, 'Message is too short — tell us a little more.');
      valid = false;
    } else {
      clearError(msgInput, msgError);
    }

    if (!valid) return;

    // Simulate submission
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent  = 'Sending…';
    submitBtn.disabled     = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      form.reset();
      successMsg.classList.add('show');
      submitBtn.textContent   = 'Send Message';
      submitBtn.disabled      = false;
      submitBtn.style.opacity = '';
      // Hide success message after 6 seconds
      setTimeout(() => successMsg.classList.remove('show'), 6000);
    }, 1200);
  });


  /* ── SMOOTH ANCHOR OFFSET (for fixed nav) ────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = navbar.offsetHeight + 16;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── INTERSECTION OBSERVER (fade-in on scroll) ───────── */
  const observerConfig = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const fadeEls = document.querySelectorAll(
    '.listing-card, .amenity-item, .about-list li, .contact-item'
  );

  fadeEls.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling position
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.children]
          : [];
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 400);

        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, observerConfig);

  fadeEls.forEach(el => observer.observe(el));

});
