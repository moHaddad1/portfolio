/**
 * Contact Section Module
 * Handles the Direct Contact Bar "COPY EMAIL" action and fast in-page
 * form submissions via Web3Forms without page redirects.
 */

(function (app) {
  'use strict';

  const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  function copyTextToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const succeeded = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (succeeded) {
          resolve();
        } else {
          reject(new Error('Clipboard copy failed.'));
        }
      } catch (err) {
        document.body.removeChild(textarea);
        reject(err);
      }
    });
  }

  app.initContact = function initContact() {
    /* ================= COPY EMAIL BUTTON ================= */
    const copyEmailBtn = document.getElementById('copy-email-btn');
    let copyResetTimer = null;

    if (copyEmailBtn) {
      const emailToCopy =
        copyEmailBtn.getAttribute('data-email') || 'mohamed.elhaddad.cs@gmail.com';
      const defaultLabel = copyEmailBtn.textContent.trim() || 'COPY EMAIL';

      copyEmailBtn.addEventListener('click', function () {
        copyTextToClipboard(emailToCopy)
          .then(function () {
            copyEmailBtn.textContent = 'COPIED \u2713';
            copyEmailBtn.classList.add('is-copied');

            if (copyResetTimer) {
              clearTimeout(copyResetTimer);
            }
            copyResetTimer = setTimeout(function () {
              copyEmailBtn.textContent = defaultLabel;
              copyEmailBtn.classList.remove('is-copied');
            }, 2000);
          })
          .catch(function () {
            copyEmailBtn.textContent = defaultLabel;
          });
      });
    }

    /* ================= WEB3FORMS AJAX SUBMISSION ================= */
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    function showStatus(type, message) {
      if (!formStatus) return;
      formStatus.className = 'form-status ' + (type === 'success' ? 'is-success' : 'is-error');
      formStatus.textContent = message;
      formStatus.hidden = false;
    }

    function clearStatus() {
      if (!formStatus) return;
      formStatus.hidden = true;
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }

    function setLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.disabled = isLoading;
      submitBtn.classList.toggle('is-loading', isLoading);
      submitBtn.setAttribute('aria-busy', String(isLoading));
      submitBtn.textContent = isLoading ? 'SENDING...' : 'SUBMIT';
    }

    contactForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      clearStatus();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      setLoading(true);

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(WEB3FORMS_ENDPOINT, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json().catch(function () {
          return {};
        });

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Submission failed.');
        }

        contactForm.reset();
        showStatus('success', "Message sent! I'll get back to you soon.");
      } catch (error) {
        showStatus(
          'error',
          'Something went wrong while sending your message. Please try again or email mohamed.elhaddad.cs@gmail.com directly.'
        );
      } finally {
        setLoading(false);
      }
    });
  };
})((window.PortfolioApp = window.PortfolioApp || {}));
