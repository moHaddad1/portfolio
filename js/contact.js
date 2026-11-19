/**
 * Contact Form Module
 * Keeps native FormSubmit POST submission untouched and shows a green
 * confirmation banner when redirected back with ?sent=true, then cleans
 * the URL back to #contact.
 */

(function (app) {
  'use strict';

  function showSentConfirmationIfPresent() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sent') !== 'true') return;

    const formStatus = document.getElementById('form-status');
    if (formStatus) {
      formStatus.className = 'form-status is-success';
      formStatus.textContent =
        'Thank you! Your message has been sent successfully. Mohamed Alhaddad will get back to you shortly.';
      formStatus.hidden = false;
    }

    if (window.history && typeof window.history.replaceState === 'function') {
      window.history.replaceState({}, document.title, window.location.pathname + '#contact');
    }
  }

  app.initContact = function initContact() {
    showSentConfirmationIfPresent();
  };
})((window.PortfolioApp = window.PortfolioApp || {}));
