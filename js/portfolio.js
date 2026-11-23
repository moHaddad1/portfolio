/**
 * Portfolio Filtering Module
 * Powers category tab selection, single-card grid centering,
 * and smooth card entrance transitions.
 */

(function (app) {
  'use strict';

  app.initPortfolio = function initPortfolio() {
    const filtersContainer = document.querySelector('.portfolio-filters');
    const filterButtons = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
    const portfolioGrid = document.getElementById('portfolio-grid');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filtersContainer || filterButtons.length === 0) return;

    function applyFilter(selectedBtn) {
      if (!selectedBtn) return;
      const selectedFilter = selectedBtn.getAttribute('data-filter');

      filterButtons.forEach(function (btn) {
        const isCurrent = btn === selectedBtn;
        btn.classList.toggle('is-active', isCurrent);
        btn.setAttribute('aria-selected', String(isCurrent));
      });

      let visibleCount = 0;

      projectCards.forEach(function (card) {
        const category = card.getAttribute('data-category');
        const shouldShow = selectedFilter === 'all' || category === selectedFilter;

        if (shouldShow) {
          visibleCount += 1;
          card.classList.remove('is-hidden');
          card.classList.add('is-visible');
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          requestAnimationFrame(function () {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('is-hidden');
        }
      });

      if (portfolioGrid) {
        portfolioGrid.classList.toggle('is-single', visibleCount === 1);
        portfolioGrid.classList.toggle('is-double', visibleCount === 2);
      }
    }

    filtersContainer.addEventListener('click', function (event) {
      const btn = event.target.closest('.filter-btn');
      if (btn) {
        applyFilter(btn);
      }
    });

    filtersContainer.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const currentIndex = filterButtons.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (currentIndex + direction + filterButtons.length) % filterButtons.length;
      filterButtons[nextIndex].focus();
      applyFilter(filterButtons[nextIndex]);
    });
  };
})((window.PortfolioApp = window.PortfolioApp || {}));
