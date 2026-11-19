/**
 * Scroll-Reveal Module
 * Smoothly reveals marked elements as they enter (or are scrolled past)
 * the viewport so anchor jumps never leave headings hidden.
 */

(function (app) {
  'use strict';

  app.initReveal = function initReveal() {
    const revealElements = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (revealElements.length === 0) return;

    function showElement(el) {
      el.classList.add('is-visible');
    }

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(showElement);
      return;
    }

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
            showElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '80px 0px -10px 0px',
      }
    );

    revealElements.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        showElement(el);
      } else {
        revealObserver.observe(el);
      }
    });
  };
})((window.PortfolioApp = window.PortfolioApp || {}));
