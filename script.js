/**
 * ZEGON INNOVATIONS — script.js
 * Features:
 *  - Lucide icons init
 *  - Navbar scroll effect + active link tracking
 *  - Hamburger mobile menu
 *  - Cursor glow parallax
 *  - Scroll reveal animations (IntersectionObserver)
 *  - Counter animations
 *  - Testimonial carousel with dots + auto-play
 *  - Contact form submission
 *  - Back-to-top button
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. LUCIDE ICONS ─── */
  lucide.createIcons();


  /* ─── 2. CURSOR GLOW ─── */
  const cursorGlow = document.getElementById('cursorGlow');
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  });


  /* ─── 3. NAVBAR SCROLL ─── */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top
    const backTop = document.getElementById('backTop');
    if (window.scrollY > 400) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }

    // Active nav link
    updateActiveNav();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });


  /* ─── 4. ACTIVE NAV LINK ─── */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }


  /* ─── 5. HAMBURGER MENU ─── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ─── 6. SCROLL REVEAL ─── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger counters if within this element
        const counters = entry.target.querySelectorAll('.counter');
        counters.forEach(animateCounter);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ─── 7. COUNTER ANIMATION ─── */
  const heroNums = document.querySelectorAll('.stat-num[data-target]');
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  heroNums.forEach(el => heroObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target || el.getAttribute('data-target'), 10);
    if (!target || el.dataset.animated) return;
    el.dataset.animated = true;

    const duration = 1800;
    const start = performance.now();
    const startVal = 0;

    const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const tick = (now) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const val = Math.round(startVal + ease(elapsed) * (target - startVal));
      el.textContent = val;
      if (elapsed < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  }

  // Also handle .counter class (about section)
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter[data-target]').forEach(el => counterObserver.observe(el));


  /* ─── 8. TESTIMONIAL CAROUSEL ─── */
  const track = document.getElementById('testiTrack');
  const cards = track ? Array.from(track.querySelectorAll('.testi-card')) : [];
  const dotsContainer = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');

  if (cards.length && dotsContainer) {
    let currentIndex = 0;
    let autoPlayTimer = null;
    const isMobile = () => window.innerWidth < 768;
    const isTablet = () => window.innerWidth < 1024;

    function getVisible() {
      if (isMobile()) return 1;
      if (isTablet()) return 2;
      return 3;
    }

    function totalSlides() {
      return Math.max(cards.length - getVisible() + 1, 1);
    }

    // Build dots
    function buildDots() {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides(); i++) {
        const dot = document.createElement('button');
        dot.className = 'testi-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      document.querySelectorAll('.testi-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, totalSlides() - 1));
      const cardWidth = cards[0].offsetWidth + 24; // gap = 1.5rem = 24px
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      updateDots();
    }

    function next() { goTo((currentIndex + 1) % totalSlides()); }
    function prev() { goTo((currentIndex - 1 + totalSlides()) % totalSlides()); }

    prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });
    nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });

    function startAutoPlay() {
      autoPlayTimer = setInterval(() => next(), 4500);
    }
    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAutoPlay(); }
    });

    buildDots();
    startAutoPlay();
    window.addEventListener('resize', () => { buildDots(); goTo(0); });
  }


  /* ─── 9. CONTACT FORM ─── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Simulate network delay
      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
        // Re-init icons for the success checkmark
        lucide.createIcons();
      }, 1200);
    });
  }


  /* ─── 10. BACK TO TOP ─── */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ─── 11. SMOOTH ANCHOR SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─── 12. SERVICE CARD SUBTLE TILT ─── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ─── 13. PAGE LOAD ANIMATION ─── */
  // Stagger hero elements on first load
  const heroElements = document.querySelectorAll('.hero .reveal');
  heroElements.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 120);
  });

});
