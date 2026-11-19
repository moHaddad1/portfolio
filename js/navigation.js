/**
 * Navigation Module
 * Handles sticky navbar scroll styling, responsive mobile drawer,
 * smooth anchor scrolling, and active section highlighting.
 */

(function (app) {
  'use strict';

  app.initNavigation = function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    /* Sticky Navbar State */
    function updateNavbarScroll() {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }

    window.addEventListener('scroll', updateNavbarScroll, { passive: true });
    updateNavbarScroll();

    /* Mobile Drawer */
    function setMenuOpen(open) {
      if (!navToggle || !navMenu || !navbar) return;
      navToggle.classList.toggle('is-open', open);
      navMenu.classList.toggle('is-open', open);
      navbar.classList.toggle('menu-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    }

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function () {
        setMenuOpen(!navMenu.classList.contains('is-open'));
      });

      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          setMenuOpen(false);
        });
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
          setMenuOpen(false);
          navToggle.focus();
        }
      });
    }

    /* Smooth Anchor Scrolling */
    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        event.preventDefault();
        const navOffset = navbar ? navbar.offsetHeight : 0;
        const targetTop =
          targetId === '#top'
            ? 0
            : targetEl.getBoundingClientRect().top + window.scrollY - navOffset + 4;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth',
        });
      });
    });

    /* Active Section Link Highlighting */
    const trackedSections = document.querySelectorAll('section[id]');
    const sectionNavLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if ('IntersectionObserver' in window && trackedSections.length > 0) {
      const navObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const activeId = '#' + entry.target.id;
              sectionNavLinks.forEach(function (link) {
                link.classList.toggle('is-active', link.getAttribute('href') === activeId);
              });
            }
          });
        },
        {
          rootMargin: '-38% 0px -48% 0px',
          threshold: 0,
        }
      );

      trackedSections.forEach(function (section) {
        navObserver.observe(section);
      });
    }
  };
})((window.PortfolioApp = window.PortfolioApp || {}));
