/**
 * Application Bootstrap — mohamedalhaddad.com
 */

(function (app) {
  'use strict';

  function bootstrap() {
    if (typeof app.initNavigation === 'function') app.initNavigation();
    if (typeof app.initReveal === 'function') app.initReveal();
    if (typeof app.initPortfolio === 'function') app.initPortfolio();
    if (typeof app.initContact === 'function') app.initContact();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})((window.PortfolioApp = window.PortfolioApp || {}));
