/* ============================================================
   PawStay — JavaScript
   Sections:
     1. Header scroll effect
     2. Mobile menu
     3. Reveal on scroll
     4. Smooth scrolling
     5. Active nav highlighting
     6. FAQ accordion (with accessibility & single-open logic)
     7. Booking date dropdown
     8. Team slider
     9. Form validation + AJAX submission
    10. Footer year
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Header scroll effect ---------- */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ---------- 2. Mobile menu ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  function closeMobileMenu() {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    const icon = menuToggle.querySelector('i');
    if (icon) {
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    }
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ---------- 3. Reveal on scroll ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for very old browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  /* ---------- 4. Smooth scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const offset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      }
    });
  });

  /* ---------- 5. Active nav highlighting ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  function updateActiveNav() {
    if (!sections.length) return;
    const scrollPos = window.scrollY + 160;
    let currentId = '';

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      link.classList.toggle('active', href === currentId);
    });
  }

  let navTicking = false;
  window.addEventListener('scroll', () => {
    if (!navTicking) {
      window.requestAnimationFrame(() => {
        updateActiveNav();
        navTicking = false;
      });
      navTicking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateActiveNav);
  updateActiveNav();

  /* ---------- 6. FAQ accordion (with accessibility & single-open logic) ---------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      
      // 1. Close all other open FAQ items first
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        const openBtn = openItem.querySelector('.faq-question');
        if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
        
        const openAnswerId = openBtn.getAttribute('aria-controls');
        const openAnswer = openAnswerId ? document.getElementById(openAnswerId) : null;
        if (openAnswer) openAnswer.setAttribute('hidden', '');
      });

      // 2. If the clicked item was closed, open it now
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        
        const answerId = btn.getAttribute('aria-controls');
        const answer = answerId ? document.getElementById(answerId) : null;
        if (answer) answer.removeAttribute('hidden');
      }
    });
  });

  /* ---------- 7. Booking date dropdown ---------- */
  const bookingDate = document.getElementById('booking_date');

  /**
   * Populates the booking date <select> with dates from 3 to 90 days
   * from today. Safe to call multiple times — clears existing options first.
   */
  function populateBookingDates() {
    if (!bookingDate) return;

    // Preserve the placeholder option
    bookingDate.innerHTML = '<option value="">Select a date...</option>';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 90);

    const fmt = new Intl.DateTimeFormat('en-PH', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const toValue = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${dd}`;
    };

    const cursor = new Date(minDate);
    while (cursor <= maxDate) {
      const opt = document.createElement('option');
      opt.value = toValue(cursor);
      const label = fmt.format(cursor);
      opt.textContent = cursor.getTime() === minDate.getTime()
        ? `${label} (earliest)`
        : label;
      bookingDate.appendChild(opt);
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  populateBookingDates();

  /* ---------- 8. Team slider ---------- */
  const teamRow = document.getElementById('teamRow');
  const teamPrevBtn = document.getElementById('teamPrev');
  const teamNextBtn = document.getElementById('teamNext');

  if (teamRow && teamPrevBtn && teamNextBtn) {
    const getScrollAmount = () => {
      const card = teamRow.querySelector('.testimonial-card');
      if (!card) return 468;
      const styles = getComputedStyle(teamRow);
      const gap = parseFloat(styles.columnGap || styles.gap) || 28;
      return card.offsetWidth + gap;
    };

    const updateArrows = () => {
      const maxScroll = teamRow.scrollWidth - teamRow.clientWidth;
      const atStart = teamRow.scrollLeft <= 2;
      const atEnd = teamRow.scrollLeft >= maxScroll - 2;

      teamPrevBtn.style.opacity = atStart ? '0.35' : '1';
      teamPrevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
      teamNextBtn.style.opacity = atEnd ? '0.35' : '1';
      teamNextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
    };

    teamPrevBtn.addEventListener('click', () => {
      teamRow.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    teamNextBtn.addEventListener('click', () => {
      teamRow.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    teamRow.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();
  }

  /* ---------- 9. Form validation + AJAX submission ---------- */
  const bookingForm = document.getElementById('booking-form');
  const formStatus = document.getElementById('formStatus');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  /**
   * Show an inline error message under a field.
   * @param {HTMLElement} field
   * @param {string} message
   */
  function showFieldError(field, message) {
    const group = field.closest('.form-group');
    if (group) group.classList.add('invalid');
    const errorEl = document.getElementById(field.id + '-error');
    if (errorEl) errorEl.textContent = message;
  }

  /**
   * Clear an inline error message.
   * @param {HTMLElement} field
   */
  function clearFieldError(field) {
    const group = field.closest('.form-group');
    if (group) group.classList.remove('invalid');
    const errorEl = document.getElementById(field.id + '-error');
    if (errorEl) errorEl.textContent = '';
  }

  /**
   * Validate a single field. Returns true if valid.
   * @param {HTMLElement} field
   * @returns {boolean}
   */
  function validateField(field) {
    const value = (field.value || '').trim();

    if (field.hasAttribute('required') && !value) {
      showFieldError(field, 'This field is required.');
      return false;
    }

    if (field.type === 'email' && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        showFieldError(field, 'Please enter a valid email address.');
        return false;
      }
    }

    if (field.type === 'tel' && value) {
      // Allow digits, spaces, +, -, parentheses; at least 7 digits
      const digits = value.replace(/\D/g, '');
      if (digits.length < 7) {
        showFieldError(field, 'Please enter a valid phone number.');
        return false;
      }
    }

    clearFieldError(field);
    return true;
  }

  if (bookingForm) {
    // Real-time validation on blur
    bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        const group = field.closest('.form-group');
        if (group && group.classList.contains('invalid')) {
          validateField(field);
        }
      });
    });

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate all fields first
      const fields = Array.from(bookingForm.querySelectorAll('input, select, textarea'));
      const allValid = fields.every(field => validateField(field));

      if (!allValid) {
        const firstInvalid = bookingForm.querySelector('.form-group.invalid input, .form-group.invalid select, .form-group.invalid textarea');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Reset status
      formStatus.className = 'form-status';
      formStatus.innerHTML = '';

      const originalBtnHTML = formSubmitBtn.innerHTML;
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      const formData = new FormData(bookingForm);

      try {
        // DEMO MODE: Simulate a successful submission instead of hitting Formspree
        // If you have a real Formspree account, replace the below object with the fetch() block.
        const response = { ok: true }; 
        
        /* REAL FORMSPREE FETCH (Uncomment and use if you have a live endpoint)
        const response = await fetch(bookingForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        */

        if (response.ok) {
          formStatus.className = 'form-status success show';
          formStatus.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
              <strong>Request sent!</strong>
              <p>We'll be in touch within 24 hours. Check your email for confirmation.</p>
            </div>
          `;

          bookingForm.reset();
          // Clear inline errors, then rebuild the date dropdown (single call)
          bookingForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('invalid'));
          bookingForm.querySelectorAll('.field-error').forEach(el => (el.textContent = ''));
          populateBookingDates();

          setTimeout(() => {
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        } else {
          const data = await response.json().catch(() => ({}));
          const errMsg = (data.errors && data.errors[0] && data.errors[0].message)
            ? data.errors[0].message
            : 'Something went wrong. Please try again or contact us directly.';
          formStatus.className = 'form-status error show';
          formStatus.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <div>
              <strong>Submission failed</strong>
              <p>${errMsg}</p>
            </div>
          `;
        }
      } catch (err) {
        formStatus.className = 'form-status error show';
        formStatus.innerHTML = `
          <i class="fas fa-exclamation-circle"></i>
          <div>
            <strong>Network error</strong>
            <p>Please check your connection and try again.</p>
          </div>
        `;
      } finally {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalBtnHTML;
      }
    });
  }

  /* ---------- 10. Footer year (auto-updates) ---------- */
  const footerYear = document.getElementById('footerYear');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
})();