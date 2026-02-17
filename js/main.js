/**
 * Portfolio - Vanilla JavaScript
 * Joshua Macklin
 */

(function () {
  'use strict';

  // --- Theme Toggle ---
  function initTheme() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    function setTheme(isLight) {
      document.documentElement.classList.toggle('light-theme', isLight);
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }

    toggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.contains('light-theme');
      setTheme(!isLight);
    });

    // Respect system preference on first load (handled in <head> inline script)
  }

  // --- Mobile Menu ---
  function initMobileMenu() {
    const toggle = document.querySelector('.nav__toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-menu__link');

    if (!toggle || !mobileMenu) return;

    function openMenu() {
      document.body.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', () => {
      if (document.body.classList.contains('menu-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // --- Smooth Scroll ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // --- Sticky Header ---
  function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        header.classList.toggle('is-scrolled', !entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '-1px 0px 0px 0px' }
    );

    const hero = document.querySelector('.hero');
    if (hero) observer.observe(hero);
  }

  // --- Back to Top ---
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    function updateVisibility() {
      const showThreshold = 400;
      btn.classList.toggle('is-visible', window.scrollY > showThreshold);
    }

    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();

    btn.addEventListener('click', () => {
      document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- Scroll Animations (Intersection Observer) ---
  function initScrollAnimations() {
    const animateEls = document.querySelectorAll('[data-animate]');
    if (!animateEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    animateEls.forEach((el) => observer.observe(el));
  }

  // --- Skill Bar Animations ---
  function initSkillBars() {
    const skillFills = document.querySelectorAll('.skill__fill');
    if (!skillFills.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            const level = fill.dataset.level || '0';
            fill.style.setProperty('--level', level + '%');
            fill.classList.add('animated');
          }
        });
      },
      { threshold: 0.3 }
    );

    skillFills.forEach((el) => observer.observe(el));
  }

  // --- Year in Footer ---
  function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // --- Init ---
  function init() {
    initTheme();
    initMobileMenu();
    initSmoothScroll();
    initStickyHeader();
    initBackToTop();
    initScrollAnimations();
    initSkillBars();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
