/* ============================================================
   MAIN.JS — Inkwave Tattoo Studio
   Handles: sticky navbar, hamburger menu, dropdown toggle,
            scroll-reveal animations, smooth interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════
     1. NAVBAR — Scroll-based sticky behaviour
  ══════════════════════════════════════════ */
  const navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Run once on load (in case page is already scrolled)
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });


  /* ══════════════════════════════════════════
     2. HAMBURGER — Mobile menu toggle
  ══════════════════════════════════════════ */
  const hamburger  = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');
  const body       = document.body;

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open', isOpen);
      // Prevent background scroll while menu is open
      body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when a link inside is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on backdrop click (clicking outside the link list)
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeMobileMenu();
    });
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    body.style.overflow = '';
  }


  /* ══════════════════════════════════════════
     3. MOBILE SUB-MENU (Piercings dropdown)
  ══════════════════════════════════════════ */
  const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
  const mobileSub            = document.querySelector('.mobile-sub');

  if (mobileDropdownToggle && mobileSub) {
    mobileDropdownToggle.addEventListener('click', () => {
      mobileSub.classList.toggle('open');
      const caret = mobileDropdownToggle.querySelector('.mobile-caret');
      if (caret) {
        caret.style.transform = mobileSub.classList.contains('open')
          ? 'rotate(180deg)'
          : 'rotate(0deg)';
      }
    });
  }


  /* ══════════════════════════════════════════
     4. DESKTOP DROPDOWN — Piercings hover/click
  ══════════════════════════════════════════ */
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

  dropdownItems.forEach(item => {
    const toggle = item.querySelector('.nav-link');
    let closeTimer;

    // Open on mouse enter
    item.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      // Close any other open dropdowns
      dropdownItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.add('open');
    });

    // Delay close so user can move cursor into the menu
    item.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => {
        item.classList.remove('open');
      }, 150);
    });

    // Also support click (for touch devices)
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        item.classList.toggle('open');
      });
    }
  });

  // Close dropdown when clicking anywhere else
  document.addEventListener('click', () => {
    dropdownItems.forEach(item => item.classList.remove('open'));
  });


  /* ══════════════════════════════════════════
     5. SCROLL REVEAL — Animate elements on scroll
  ══════════════════════════════════════════ */
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right'
  );

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once visible, no need to keep observing
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,   // trigger when 12% of element is visible
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }


  /* ══════════════════════════════════════════
     6. ACTIVE NAV LINK — Highlight current page
  ══════════════════════════════════════════ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-link[data-page]');

  allNavLinks.forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    }
  });


  /* ══════════════════════════════════════════
     7. HERO PARALLAX — Subtle depth effect
  ══════════════════════════════════════════ */
  const heroBg = document.querySelector('.hero-bg');

  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      // Move bg at 30% of scroll speed for parallax feel
      heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }, { passive: true });
  }


  /* ══════════════════════════════════════════
     8. SMOOTH SCROLL — Anchor links
  ══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90; // navbar height offset
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ══════════════════════════════════════════
     9. NEWSLETTER FORM — Prevent default + feedback
  ══════════════════════════════════════════ */
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input  = form.querySelector('input');
      const button = form.querySelector('button');
      if (input && input.value.trim()) {
        button.textContent = '✓ Subscribed!';
        button.style.background = '#2d8a5e';
        input.value = '';
        setTimeout(() => {
          button.textContent = 'Subscribe';
          button.style.background = '';
        }, 3000);
      }
    });
  });


  /* ══════════════════════════════════════════
     10. CONTACT FORM — Prevent default + feedback
  ══════════════════════════════════════════ */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = '✓ Message Sent!';
        btn.style.background = '#2d8a5e';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
        }, 4000);
      }
    });
  }


  /* ══════════════════════════════════════════
     11. COUNTER ANIMATION — Stats numbers
  ══════════════════════════════════════════ */
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(counter => countObserver.observe(counter));
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800; // ms
    const step     = target / (duration / 16);
    let current    = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  }


  /* ══════════════════════════════════════════
     12. SHOP — Enquire Now button feedback
     For this static site we show a short button animation when the
     visitor clicks "Enquire Now"; the page-level toast also nudges
     them to the Contact page. Keeps UX snappy without e-commerce.
  ══════════════════════════════════════════ */
  document.querySelectorAll('.enquire-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const original = btn.textContent;
      btn.textContent = '✓ Noted';
      btn.classList.add('btn-dark');
      btn.classList.remove('btn-primary');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('btn-dark');
        btn.classList.add('btn-primary');
      }, 2000);
    });
  });

}); // end DOMContentLoaded
