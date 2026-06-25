/* ============================================================
   MASSIAH PROPERTIES — script.js
   Handles: sticky nav, mobile menu, login modal, listing filters,
            contact form validation
   Auth note: Uses localStorage for demo persistence only.
              Replace with a real auth API for production.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── STICKY NAV ──────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ── MOBILE NAV TOGGLE ───────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
      navToggle.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '';
      });
    });
  });


  /* ══ AUTH / LOGIN MODAL ══════════════════════════════════
     Demo auth — stores user in localStorage.
     In production, swap localStorage.setItem / getItem for
     real API calls (e.g. Firebase Auth, Supabase, etc.)
  ═══════════════════════════════════════════════════════════ */

  const backdrop = document.getElementById('loginBackdrop');
  const modalClose = document.getElementById('modalClose');

  // Panels
  const panelLogin     = document.getElementById('panelLogin');
  const panelRegister  = document.getElementById('panelRegister');
  const panelForgot    = document.getElementById('panelForgot');
  const panelDashboard = document.getElementById('panelDashboard');

  const panels = [panelLogin, panelRegister, panelForgot, panelDashboard];
  const showPanel = (panel) => panels.forEach(p => p.classList.toggle('hidden', p !== panel));

  // Nav label
  const navLoginBtn   = document.getElementById('navLoginBtn');
  const navLoginLabel = document.getElementById('navLoginLabel');

  // ── Session helpers ──────────────────────────────────────
  const SESSION_KEY = 'massiah_user';

  const getSession = () => {
    const persisted = localStorage.getItem(SESSION_KEY);
    if (persisted) {
      try { return JSON.parse(persisted); } catch { }
    }

    const transient = sessionStorage.getItem(SESSION_KEY);
    if (transient) {
      try { return JSON.parse(transient); } catch { }
    }

    return null;
  };
  const setSession = (user, remember = false) => {
    const payload = JSON.stringify(user);
    if (remember) {
      localStorage.setItem(SESSION_KEY, payload);
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, payload);
      localStorage.removeItem(SESSION_KEY);
    }
  };
  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  };

  // Simple demo "user database" in localStorage
  const USERS_KEY = 'massiah_users';
  const getUsers = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch { return {}; } };
  const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // ── UI update after auth state change ───────────────────
  const refreshAuthUI = () => {
    const user = getSession();
    if (user) {
      navLoginLabel.textContent = user.firstName;
      document.getElementById('dashAvatar').textContent   = user.firstName[0].toUpperCase();
      document.getElementById('dashGreeting').textContent = `Welcome back, ${user.firstName}!`;
    } else {
      navLoginLabel.textContent = 'Sign In';
    }
  };

  // ── Open / close modal ───────────────────────────────────
  const openModal = () => {
    const user = getSession();
    showPanel(user ? panelDashboard : panelLogin);
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Trigger buttons
  document.getElementById('navLoginBtn').addEventListener('click', openModal);
  document.getElementById('heroLoginBtn').addEventListener('click', openModal);
  document.getElementById('footerLoginBtn').addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);

  // Close on backdrop click
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

  // Close on Escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Panel switches
  document.getElementById('goRegister').addEventListener('click', () => showPanel(panelRegister));
  document.getElementById('goLogin').addEventListener('click',    () => showPanel(panelLogin));
  document.getElementById('goForgot').addEventListener('click',   () => showPanel(panelForgot));
  document.getElementById('backToLogin').addEventListener('click',() => showPanel(panelLogin));

  // Close dashboard links
  document.getElementById('dashBrowse').addEventListener('click',  closeModal);
  document.getElementById('dashContact').addEventListener('click', closeModal);

  // ── Password show/hide ───────────────────────────────────
  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.textContent = isText ? 'Show' : 'Hide';
    });
  });

  // ── Validation helpers ───────────────────────────────────
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const setErr  = (id, msg) => {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
    const inputId = id.replace('Err','').replace('Error','');
    const input = document.getElementById(inputId);
    if (input) input.classList.toggle('error', !!msg);
  };
  const clearErr = (id) => setErr(id, '');

  // ── LOGIN ────────────────────────────────────────────────
  document.getElementById('loginSubmit').addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value.trim();
    const pw    = document.getElementById('loginPassword').value;
    let ok = true;

    clearErr('loginEmailErr'); clearErr('loginPasswordErr');

    if (!email) { setErr('loginEmailErr', 'Please enter your email.'); ok = false; }
    else if (!isEmail(email)) { setErr('loginEmailErr', 'Invalid email address.'); ok = false; }
    if (!pw) { setErr('loginPasswordErr', 'Please enter your password.'); ok = false; }

    if (!ok) return;

    const users = getUsers();
    const user  = users[email.toLowerCase()];

    if (!user) {
      setErr('loginEmailErr', 'No account found with that email.'); return;
    }
    if (user.password !== pw) {
      setErr('loginPasswordErr', 'Incorrect password.'); return;
    }

    const rememberMe = document.getElementById('rememberMe').checked;
    setSession({ email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' }, rememberMe);
    refreshAuthUI();
    showPanel(panelDashboard);
    document.getElementById('loginEmail').value    = '';
    document.getElementById('loginPassword').value = '';
  });

  // Allow Enter key on login
  ['loginEmail','loginPassword'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('loginSubmit').click();
    });
  });

  // ── REGISTER ────────────────────────────────────────────
  document.getElementById('registerSubmit').addEventListener('click', () => {
    const first = document.getElementById('regFirst').value.trim();
    const last  = document.getElementById('regLast').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const pw    = document.getElementById('regPassword').value;
    const rememberMe = document.getElementById('regRememberMe')?.checked || false;
    let ok = true;

    clearErr('regFirstErr'); clearErr('regLastErr');
    clearErr('regEmailErr'); clearErr('regPasswordErr');

    if (!first) { setErr('regFirstErr', 'Enter your first name.'); ok = false; }
    if (!last)  { setErr('regLastErr', 'Enter your last name.'); ok = false; }
    if (!email) { setErr('regEmailErr', 'Enter your email address.'); ok = false; }
    else if (!isEmail(email)) { setErr('regEmailErr', 'Invalid email address.'); ok = false; }
    if (pw.length < 8) { setErr('regPasswordErr', 'Password must be at least 8 characters.'); ok = false; }

    if (!ok) return;

    const users = getUsers();
    if (users[email.toLowerCase()]) {
      setErr('regEmailErr', 'An account with this email already exists.'); return;
    }

    users[email.toLowerCase()] = { email, firstName: first, lastName: last, phone, password: pw };
    saveUsers(users);

    setSession({ email, firstName: first, lastName: last, phone }, rememberMe);
    refreshAuthUI();
    showPanel(panelDashboard);

    // Clear form
    ['regFirst','regLast','regEmail','regPhone','regPassword'].forEach(id => {
      document.getElementById(id).value = '';
    });
  });

  // ── FORGOT PASSWORD ──────────────────────────────────────
  document.getElementById('forgotSubmit').addEventListener('click', () => {
    const email = document.getElementById('forgotEmail').value.trim();
    clearErr('forgotEmailErr');
    document.getElementById('forgotSuccess').classList.add('hidden');

    if (!email) { setErr('forgotEmailErr', 'Please enter your email.'); return; }
    if (!isEmail(email)) { setErr('forgotEmailErr', 'Invalid email address.'); return; }

    // Simulate sending (in production, call your API here)
    setTimeout(() => {
      document.getElementById('forgotSuccess').classList.remove('hidden');
      document.getElementById('forgotEmail').value = '';
    }, 800);
  });

  // ── LOGOUT ───────────────────────────────────────────────
  document.getElementById('logoutBtn').addEventListener('click', () => {
    clearSession();
    refreshAuthUI();
    closeModal();
  });

  // Init on page load
  refreshAuthUI();


  /* ── LISTING FILTER ──────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.listing-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.type === filter;
        card.classList.toggle('hidden', !match);
        if (match) {
          card.style.opacity   = '0';
          card.style.transform = 'translateY(12px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          });
        } else {
          card.style.opacity = ''; card.style.transform = ''; card.style.transition = '';
        }
      });
    });
  });


  /* ── CONTACT FORM VALIDATION ─────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const nameInput   = document.getElementById('name');
  const emailInput  = document.getElementById('email');
  const msgInput    = document.getElementById('message');
  const nameError   = document.getElementById('nameError');
  const emailError  = document.getElementById('emailError');
  const msgError    = document.getElementById('messageError');
  const successMsg  = document.getElementById('formSuccess');

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const cErr = (inp, el) => { inp.classList.remove('error'); el.textContent = ''; };
  const sErr = (inp, el, msg) => { inp.classList.add('error'); el.textContent = msg; };

  nameInput.addEventListener('input',  () => cErr(nameInput,  nameError));
  emailInput.addEventListener('input', () => cErr(emailInput, emailError));
  msgInput.addEventListener('input',   () => cErr(msgInput,   msgError));

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    if (!nameInput.value.trim()) {
      sErr(nameInput, nameError, 'Please enter your name.'); valid = false;
    } else { cErr(nameInput, nameError); }

    if (!emailInput.value.trim()) {
      sErr(emailInput, emailError, 'Please enter your email address.'); valid = false;
    } else if (!isValidEmail(emailInput.value)) {
      sErr(emailInput, emailError, 'Please enter a valid email address.'); valid = false;
    } else { cErr(emailInput, emailError); }

    if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
      sErr(msgInput, msgError, 'Please write a short message (at least 10 characters).'); valid = false;
    } else { cErr(msgInput, msgError); }

    if (!valid) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent  = 'Sending…';
    submitBtn.disabled     = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      contactForm.reset();
      successMsg.classList.add('show');
      submitBtn.textContent   = 'Send Enquiry';
      submitBtn.disabled      = false;
      submitBtn.style.opacity = '';
      setTimeout(() => successMsg.classList.remove('show'), 6000);
    }, 1200);
  });


  /* ── SMOOTH ANCHOR SCROLL (accounts for fixed nav) ────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── SCROLL-TRIGGERED FADE IN ───────────────────────────── */
  const fadeEls = document.querySelectorAll(
    '.listing-card, .amenity-item, .about-list li, .contact-item'
  );
  fadeEls.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = entry.target.parentElement
        ? [...entry.target.parentElement.children] : [];
      const delay = Math.min(siblings.indexOf(entry.target) * 80, 400);
      setTimeout(() => {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  fadeEls.forEach(el => observer.observe(el));

});
