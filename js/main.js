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
  let scrollAnimObserver = null;

  function getScrollAnimObserver() {
    if (!scrollAnimObserver) {
      scrollAnimObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );
    }
    return scrollAnimObserver;
  }

  function observeAnimatedElements(elements) {
    if (!elements || !elements.length) return;
    const observer = getScrollAnimObserver();
    elements.forEach((el) => observer.observe(el));
  }

  function initScrollAnimations() {
    observeAnimatedElements(document.querySelectorAll('[data-animate]'));
  }

  // --- Devlog (dynamic posts from posts.json) ---
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getBasePath() {
    return window.location.pathname.includes('/blog') ? '../' : '';
  }

  function renderBlogCard(post, postBasePath) {
    const dateFormatted = new Date(post.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const tagsHtml = (post.tags || [])
      .map((t) => `<span>${escapeHtml(t)}</span>`)
      .join('');
    const article = document.createElement('article');
    article.className = 'blog-card';
    article.setAttribute('data-animate', '');
    article.innerHTML = `
      <time class="blog-card__date" datetime="${post.date}">${escapeHtml(dateFormatted)}</time>
      <h3 class="blog-card__title">${escapeHtml(post.title)}</h3>
      <p class="blog-card__excerpt">${escapeHtml(post.excerpt)}</p>
      <div class="blog-card__tags">${tagsHtml}</div>
      <a href="${escapeHtml(postBasePath)}${escapeHtml(post.slug)}.html" class="blog-card__link">
        Read More
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    `;
    return article;
  }

  async function initDevlog() {
    const grid = document.getElementById('devlog-grid');
    if (!grid) return;

    const basePath = getBasePath();
    const postBasePath = 'blog/';

    try {
      const res = await fetch(basePath + 'js/posts.json');
      if (!res.ok) throw new Error('Failed to fetch posts');
      const posts = await res.json();
      const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
      const toShow = sorted.slice(0, 6);

      toShow.forEach((post) => {
        grid.appendChild(renderBlogCard(post, postBasePath));
      });

      observeAnimatedElements(grid.querySelectorAll('.blog-card'));

      const container = grid.closest('.container');
      if (container && !container.querySelector('.devlog__footer')) {
        const footer = document.createElement('div');
        footer.className = 'devlog__footer';
        footer.innerHTML = '<a href="blog/" class="devlog__view-all">View all blogs</a>';
        container.appendChild(footer);
      }
    } catch (err) {
      console.error('Failed to load devlog posts:', err);
      grid.innerHTML =
        '<p class="devlog__empty">Unable to load posts. Please try again later.</p>';
    }
  }

  async function initAllBlogs() {
    const grid = document.getElementById('all-blogs-grid');
    if (!grid) return;

    const basePath = getBasePath();
    const postBasePath = '';

    try {
      const res = await fetch(basePath + 'js/posts.json');
      if (!res.ok) throw new Error('Failed to fetch posts');
      const posts = await res.json();
      const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

      sorted.forEach((post) => {
        grid.appendChild(renderBlogCard(post, postBasePath));
      });

      observeAnimatedElements(grid.querySelectorAll('.blog-card'));
    } catch (err) {
      console.error('Failed to load blog posts:', err);
      grid.innerHTML =
        '<p class="devlog__empty">Unable to load posts. Please try again later.</p>';
    }
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
    initDevlog();
    initAllBlogs();
    initSkillBars();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
