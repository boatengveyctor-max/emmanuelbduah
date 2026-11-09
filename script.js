/**
 * ============================================================================
 * EMMANUEL BOATENG — PORTFOLIO ENGINE (VANILLA JAVASCRIPT)
 * Features: Mobile Nav, Filterable Gallery, Lightbox Dialog,
 *           Hardened Form Validation, Clipboard Utility, Accessibility
 * Security: Strict XSS mitigation, zero raw innerHTML injections, safe DOM APIs
 * ============================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Mobile Navigation & Accessible Menu Toggle
  // --------------------------------------------------------------------------
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');

  if (menuToggle && primaryNav) {
    const toggleMenu = (shouldOpen) => {
      const isOpen = shouldOpen !== undefined ? shouldOpen : menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      primaryNav.classList.toggle('is-open', isOpen);
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    // Close menu when clicking navigation links
    const navLinks = primaryNav.querySelectorAll('.nav-link, .button-nav');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('is-open')) {
          toggleMenu(false);
        }
      });
    });

    // Close menu when clicking outside header
    document.addEventListener('click', (event) => {
      if (
        primaryNav.classList.contains('is-open') &&
        !primaryNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        toggleMenu(false);
        menuToggle.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Filterable Graphic Design Gallery
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (filterButtons.length && galleryCards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedCategory = btn.getAttribute('data-filter') || 'all';

        // Update active filter button state
        filterButtons.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-pressed', String(isActive));
        });

        // Filter cards smoothly
        galleryCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          const isMatch = selectedCategory === 'all' || cardCategory === selectedCategory;

          if (isMatch) {
            card.hidden = false;
            card.style.display = 'flex';
            // Trigger animation frame for transition
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.hidden = true;
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Graphic Design Lightbox Modal (Native Dialog with Safe DOM APIs)
  // --------------------------------------------------------------------------
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPreviewArea = document.getElementById('lightbox-preview-area');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxType = document.getElementById('lightbox-type');
  const lightboxTools = document.getElementById('lightbox-tools');
  const lightboxDesc = document.getElementById('lightbox-description');
  const lightboxSpecSoftware = document.getElementById('lightbox-spec-software');

  let lastActiveElement = null;

  if (lightbox && lightboxCloseBtn && lightboxPreviewArea) {
    // Open Lightbox handler
    const openLightbox = (card) => {
      lastActiveElement = card;

      const title = card.getAttribute('data-title') || 'Design Artifact';
      const type = card.getAttribute('data-type') || 'Graphic Design';
      const tools = card.getAttribute('data-tool') || 'Adobe Photoshop / CorelDRAW';
      const desc = card.getAttribute('data-description') || 'No description provided.';

      // Safe textual DOM assignment (XSS proof)
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxType) lightboxType.textContent = type.toUpperCase();
      if (lightboxTools) lightboxTools.textContent = tools;
      if (lightboxDesc) lightboxDesc.textContent = desc;
      if (lightboxSpecSoftware) lightboxSpecSoftware.textContent = tools;

      // Safe clone of the artwork visual without any innerHTML injection
      const cardVisual = card.querySelector('.card-visual');
      if (cardVisual) {
        const visualClone = cardVisual.cloneNode(true);
        // Replace previous preview cleanly
        while (lightboxPreviewArea.firstChild) {
          lightboxPreviewArea.removeChild(lightboxPreviewArea.firstChild);
        }
        lightboxPreviewArea.appendChild(visualClone);
      }

      // Show native modal
      if (typeof lightbox.showModal === 'function') {
        lightbox.showModal();
      } else {
        lightbox.setAttribute('open', '');
      }

      lightboxCloseBtn.focus();
    };

    // Close Lightbox handler
    const closeLightbox = () => {
      if (typeof lightbox.close === 'function') {
        lightbox.close();
      } else {
        lightbox.removeAttribute('open');
      }

      if (lastActiveElement) {
        lastActiveElement.focus();
      }
    };

    // Attach click and Enter/Space keyboard listeners to gallery cards
    galleryCards.forEach((card) => {
      card.addEventListener('click', () => openLightbox(card));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(card);
        }
      });
    });

    lightboxCloseBtn.addEventListener('click', closeLightbox);

    // Close when clicking outside modal box (on dialog backdrop)
    lightbox.addEventListener('click', (event) => {
      const rect = lightbox.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );

      if (!isInDialog) {
        closeLightbox();
      }
    });

    // Handle Escape key
    lightbox.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Secure Contact Form: Validation, Sanitization & Anti-Spam
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const messageInput = document.getElementById('contact-message');
  const charCounter = document.getElementById('char-counter');

  // Input sanitization: strips non-printable control characters
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[\u0000-\u001f\u007f]/g, '');
  };

  // Character counter for textarea
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const length = messageInput.value.length;
      charCounter.textContent = `${length} / 3000`;
      if (length > 2900) {
        charCounter.style.color = 'var(--lemon)';
      } else {
        charCounter.style.color = 'var(--text-dim)';
      }
    });
  }

  if (contactForm) {
    const fields = {
      name: {
        el: document.getElementById('contact-name'),
        errorEl: document.getElementById('name-error'),
        validate: (val) => {
          const cleaned = sanitizeString(val);
          if (cleaned.length < 2) return 'Please enter your full name (minimum 2 characters).';
          if (cleaned.length > 80) return 'Name must not exceed 80 characters.';
          if (/[<>]/.test(cleaned)) return 'HTML tag characters (< or >) are not permitted.';
          return '';
        }
      },
      email: {
        el: document.getElementById('contact-email'),
        errorEl: document.getElementById('email-error'),
        validate: (val) => {
          const cleaned = sanitizeString(val);
          // Strict RFC 5322 regex
          const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
          if (!cleaned) return 'Email address is required.';
          if (cleaned.length > 254) return 'Email address exceeds maximum length.';
          if (!emailPattern.test(cleaned)) return 'Please provide a valid email format (e.g., name@domain.com).';
          return '';
        }
      },
      subject: {
        el: document.getElementById('contact-subject'),
        errorEl: document.getElementById('subject-error'),
        validate: (val) => {
          const cleaned = sanitizeString(val);
          const validOptions = [
            'Full-Stack Web Application',
            'Graphic Design / Branding / Flyers',
            'Microcredit / Loan Management System',
            'Employment Opportunity / Full-time Role',
            'General Technical Inquiry'
          ];
          if (!cleaned || !validOptions.includes(cleaned)) {
            return 'Please select a valid project category from the list.';
          }
          return '';
        }
      },
      message: {
        el: document.getElementById('contact-message'),
        errorEl: document.getElementById('message-error'),
        validate: (val) => {
          const cleaned = sanitizeString(val);
          if (cleaned.length < 10) return 'Please describe your request in more detail (at least 10 characters).';
          if (cleaned.length > 3000) return 'Message exceeds maximum length of 3000 characters.';
          // Disallow suspicious script payloads
          if (/<\s*(script|iframe|embed|object)\b/i.test(cleaned) || /javascript:/i.test(cleaned)) {
            return 'Executable scripts or iframe tags are blocked by security policy.';
          }
          return '';
        }
      }
    };

    // Validate a single field with UI error indicators
    const validateField = (key) => {
      const field = fields[key];
      if (!field || !field.el) return true;

      const errorMessage = field.validate(field.el.value);
      const isValid = errorMessage === '';

      field.el.setAttribute('aria-invalid', String(!isValid));
      if (field.errorEl) {
        // Safe textual insertion prevents XSS
        field.errorEl.textContent = errorMessage;
      }

      return isValid;
    };

    // Attach real-time validation on blur and input events
    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      if (!field.el) return;

      field.el.addEventListener('blur', () => {
        validateField(key);
      });

      field.el.addEventListener('input', () => {
        if (field.el.getAttribute('aria-invalid') === 'true') {
          validateField(key);
        }
      });
    });

    // Form Submission Handler
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // Clear previous status
      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = 'form-status-alert';
      }

      // Check honeypot field (Anti-Spam Bot Prevention)
      const honeypot = document.getElementById('website-field');
      if (honeypot && sanitizeString(honeypot.value) !== '') {
        // Silently drop bot submission
        contactForm.reset();
        return;
      }

      // Validate all form fields
      const isNameValid = validateField('name');
      const isEmailValid = validateField('email');
      const isSubjectValid = validateField('subject');
      const isMessageValid = validateField('message');

      const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

      if (!isFormValid) {
        if (formStatus) {
          formStatus.textContent = 'Please correct the highlighted errors in the form before submitting.';
          formStatus.classList.add('is-error');
        }

        // Focus first invalid element
        const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Sanitized Payload Object (Ready for API integration / Formspree / backend)
      const sanitizedPayload = {
        name: sanitizeString(fields.name.el.value),
        email: sanitizeString(fields.email.el.value),
        subject: sanitizeString(fields.subject.el.value),
        message: sanitizeString(fields.message.el.value),
        timestamp: new Date().toISOString()
      };

      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Transmitting securely...';
      }

      // Simulate network request with visual feedback
      setTimeout(() => {
        if (formStatus) {
          formStatus.textContent = `Thank you, ${sanitizedPayload.name}. Your message regarding "${sanitizedPayload.subject}" has been validated and queued for dispatch. Emmanuel will reply promptly.`;
          formStatus.classList.add('is-success');
        }

        contactForm.reset();

        // Reset ARIA states & errors
        Object.keys(fields).forEach((key) => {
          const field = fields[key];
          if (field.el) field.el.removeAttribute('aria-invalid');
          if (field.errorEl) field.errorEl.textContent = '';
        });

        if (charCounter) charCounter.textContent = '0 / 3000';

        if (submitBtn) {
          submitBtn.disabled = false;
          const btnText = submitBtn.querySelector('.btn-text');
          if (btnText) btnText.textContent = 'Transmit Message';
        }
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 5. One-Click Clipboard Utility for Contact Email
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      // If user clicks on desktop, copy to clipboard for convenience
      if (navigator.clipboard && navigator.clipboard.writeText) {
        e.preventDefault();
        const emailAddress = 'emmanuelboateng.dev@gmail.com';
        navigator.clipboard.writeText(emailAddress).then(() => {
          const originalText = copyEmailBtn.textContent;
          copyEmailBtn.textContent = 'Email address copied to clipboard!';
          setTimeout(() => {
            copyEmailBtn.textContent = originalText;
          }, 2400);
        }).catch(() => {
          // Fallback to mailto link
          window.location.href = `mailto:${emailAddress}`;
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Dynamic Copyright Year
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = String(new Date().getFullYear());
  }

  // --------------------------------------------------------------------------
  // 7. Active Navigation Link Highlighting via IntersectionObserver
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.primary-nav .nav-link');

  if ('IntersectionObserver' in window && sections.length && navItems.length) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navItems.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('is-active');
              link.style.color = 'var(--lemon)';
            } else {
              link.classList.remove('is-active');
              link.style.color = '';
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }
});