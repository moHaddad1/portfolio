/**
 * Contact Form Module
 * Performs client-side validation and submits clean table-formatted emails
 * via FormSubmit's AJAX JSON endpoint.
 */

(function (app) {
  'use strict';

  const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/mohamed.elhaddad.cs@gmail.com';
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  app.initContact = function initContact() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const honeypotInput = contactForm.querySelector('input[name="_honey"]');
    const submitBtn = document.getElementById('submit-btn');

    const errorName = document.getElementById('error-name');
    const errorEmail = document.getElementById('error-email');
    const errorMessage = document.getElementById('error-message');
    const formStatus = document.getElementById('form-status');

    function setFieldError(inputEl, errorEl, message) {
      if (!inputEl || !errorEl) return;
      if (message) {
        inputEl.classList.add('is-invalid');
        inputEl.setAttribute('aria-invalid', 'true');
        errorEl.textContent = message;
      } else {
        inputEl.classList.remove('is-invalid');
        inputEl.removeAttribute('aria-invalid');
        errorEl.textContent = '';
      }
    }

    function showStatus(type, message) {
      if (!formStatus) return;
      const statusClass =
        type === 'success' ? 'is-success' : type === 'info' ? 'is-info' : 'is-error';
      formStatus.className = 'form-status ' + statusClass;
      formStatus.textContent = message;
      formStatus.hidden = false;
    }

    function isLocalEnvironment() {
      const host = window.location.hostname;
      return (
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '::1' ||
        window.location.protocol === 'file:'
      );
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

    function validateForm() {
      let firstInvalid = null;

      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (nameVal.length < 2) {
        setFieldError(nameInput, errorName, 'Please enter your name (at least 2 characters).');
        firstInvalid = firstInvalid || nameInput;
      } else {
        setFieldError(nameInput, errorName, '');
      }

      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!EMAIL_REGEX.test(emailVal)) {
        setFieldError(emailInput, errorEmail, 'Please enter a valid email address.');
        firstInvalid = firstInvalid || emailInput;
      } else {
        setFieldError(emailInput, errorEmail, '');
      }

      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (messageVal.length < 10) {
        setFieldError(
          messageInput,
          errorMessage,
          'Please enter a message (at least 10 characters).'
        );
        firstInvalid = firstInvalid || messageInput;
      } else {
        setFieldError(messageInput, errorMessage, '');
      }

      return {
        isValid: !firstInvalid,
        firstInvalid: firstInvalid,
        name: nameVal,
        email: emailVal,
        subject: subjectInput ? subjectInput.value.trim() : '',
        message: messageVal,
      };
    }

    [nameInput, emailInput, messageInput].forEach(function (inputEl) {
      if (!inputEl) return;
      inputEl.addEventListener('input', function () {
        if (inputEl === nameInput && nameInput.value.trim().length >= 2) {
          setFieldError(nameInput, errorName, '');
        } else if (inputEl === emailInput && EMAIL_REGEX.test(emailInput.value.trim())) {
          setFieldError(emailInput, errorEmail, '');
        } else if (inputEl === messageInput && messageInput.value.trim().length >= 10) {
          setFieldError(messageInput, errorMessage, '');
        }
      });
    });

    contactForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      clearStatus();

      // Silently ignore bot submissions caught by the hidden honeypot field
      if (honeypotInput && honeypotInput.value.trim() !== '') {
        return;
      }

      const result = validateForm();
      if (!result.isValid) {
        if (result.firstInvalid) {
          result.firstInvalid.focus();
        }
        return;
      }

      setLoading(true);

      const templateField = contactForm.querySelector('input[name="_template"]');
      const subjectMetaField = contactForm.querySelector('input[name="_subject"]');
      const captchaField = contactForm.querySelector('input[name="_captcha"]');

      const payload = {
        Name: result.name,
        Email: result.email,
        Subject: result.subject || 'General Portfolio Inquiry',
        Message: result.message,
        _replyto: result.email,
        _template: templateField ? templateField.value : 'table',
        _subject: subjectMetaField
          ? subjectMetaField.value
          : 'New Portfolio Inquiry — mohamedalhaddad.com',
        _captcha: captchaField ? captchaField.value : 'false',
      };

      try {
        const response = await fetch(FORMSUBMIT_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(function () {
          return {};
        });

        const isSuccess = response.ok && data.success !== false && data.success !== 'false';
        if (!isSuccess) {
          throw new Error(data.message || 'Submission failed.');
        }

        showStatus(
          'success',
          'Thank you, ' +
            result.name +
            '! Your message has been sent to Mohamed Alhaddad. I will respond shortly.'
        );
        contactForm.reset();
      } catch (error) {
        if (isLocalEnvironment()) {
          showStatus(
            'info',
            'FormSubmit requires a live domain to send emails and will activate automatically once deployed to mohamedalhaddad.com.'
          );
        } else {
          showStatus(
            'error',
            'Something went wrong while sending your message. Please try again in a moment or connect via LinkedIn.'
          );
        }
      } finally {
        setLoading(false);
      }
    });
  };
})((window.PortfolioApp = window.PortfolioApp || {}));
