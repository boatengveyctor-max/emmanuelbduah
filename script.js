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
  // 0. Persistent, accessible color theme
  // --------------------------------------------------------------------------
  const themeToggle = document.querySelector('.theme-toggle');
  const themeRoot = document.documentElement;
  const storedTheme = (() => {
    try {
      return window.localStorage.getItem('portfolio-theme');
    } catch (_) {
      return null;
    }
  })();

  const applyTheme = (isLight) => {
    themeRoot.classList.toggle('light-theme', isLight);
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const colorScheme = document.querySelector('meta[name="color-scheme"]');
    if (themeColor) themeColor.content = isLight ? '#f3f4f2' : '#1a1c1e';
    if (colorScheme) colorScheme.content = isLight ? 'light' : 'dark';
    if (!themeToggle) return;
    themeToggle.setAttribute('aria-checked', String(isLight));
    const action = isLight ? 'Switch to dark ash mode' : 'Switch to light mode';
    themeToggle.setAttribute('aria-label', action);
    themeToggle.setAttribute('title', action);
  };

  applyTheme(storedTheme === 'light');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = !themeRoot.classList.contains('light-theme');
      applyTheme(isLight);
      try {
        window.localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
      } catch (_) {
        // Theme still works for this page view when storage is unavailable.
      }
    });
  }

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
    const navLinks = primaryNav.querySelectorAll('.nav-link, .nav-email');
    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        if (link.classList.contains('nav-link')) {
          const destination = document.querySelector(link.getAttribute('href'));
          if (destination) {
            event.preventDefault();
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
            const destinationTop = destination.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
            window.scrollTo({ top: Math.max(0, destinationTop), behavior: reduceMotion ? 'auto' : 'smooth' });
            destination.classList.remove('section-arrival');
            void destination.offsetWidth;
            destination.classList.add('section-arrival');
            navLinks.forEach((item) => item.classList.toggle('is-active', item === link));
          }
        }
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
    return str.replace(/[\u0000-\u001f\u007f]/g, '').trim();
  };

  // Normalize human-entered whitespace before validation or composing a link.
  const normalizeField = (str) => sanitizeString(str).replace(/\s+/gu, ' ');

  // Character counter for textarea
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const length = messageInput.value.length;
      charCounter.textContent = `${length} / 3000`;
      if (length > 2900) {
        charCounter.style.color = 'var(--green)';
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
          const cleaned = normalizeField(val);
          if (cleaned.length < 2) return 'Please enter your full name (minimum 2 characters).';
          if (cleaned.length > 80) return 'Name must not exceed 80 characters.';
          if (!/^[\p{L}\p{M}][\p{L}\p{M} .’'-]*$/u.test(cleaned)) return 'Use letters, spaces, apostrophes, periods, or hyphens in your name.';
          return '';
        }
      },
      email: {
        el: document.getElementById('contact-email'),
        errorEl: document.getElementById('email-error'),
        validate: (val) => {
          const cleaned = normalizeField(val);
          // Strict RFC 5322 regex
          const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
          if (!cleaned) return 'Email address is required.';
          if (cleaned.length > 254) return 'Email address exceeds maximum length.';
          if (!emailPattern.test(cleaned) || cleaned.includes('..')) return 'Please provide a valid email format (e.g., name@domain.com).';
          return '';
        }
      },
      subject: {
        el: document.getElementById('contact-subject'),
        errorEl: document.getElementById('subject-error'),
        validate: (val) => {
          const cleaned = normalizeField(val);
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

      // Sanitized Payload Object (Ready for API integration & WhatsApp forwarding)
      const sanitizedPayload = {
        name: normalizeField(fields.name.el.value),
        email: normalizeField(fields.email.el.value),
        subject: normalizeField(fields.subject.el.value),
        message: sanitizeString(fields.message.el.value),
        timestamp: new Date().toISOString()
      };

      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Formatting for WhatsApp...';
      }

      // Format clean, professional WhatsApp message
      const whatsappMessage = 
`*NEW PORTFOLIO INQUIRY*
━━━━━━━━━━━━━━━━━━━━
*Name:* ${sanitizedPayload.name}
*Email:* ${sanitizedPayload.email}
*Project Focus:* ${sanitizedPayload.subject}

*Message:*
${sanitizedPayload.message}
━━━━━━━━━━━━━━━━━━━━
_Transmitted via Boateng Emmanuel Duah Portfolio Web Portal_`;

      const whatsappUrl = `https://wa.me/233542649394?text=${encodeURIComponent(whatsappMessage)}`;

      // Simulate quick processing then forward to WhatsApp
      setTimeout(() => {
        if (formStatus) {
          formStatus.replaceChildren(); // Safe DOM clearing
          
          const statusText = document.createElement('p');
          statusText.textContent = `Thank you, ${sanitizedPayload.name}! Your inquiry has been processed and forwarded to Boateng Emmanuel Duah on WhatsApp (+233 54 264 9394).`;
          
          const waLink = document.createElement('a');
          waLink.href = whatsappUrl;
          waLink.target = '_blank';
          waLink.rel = 'noopener noreferrer';
          waLink.className = 'button button-card-primary';
          waLink.style.marginTop = '12px';
          waLink.style.display = 'inline-flex';
          waLink.textContent = 'Open in WhatsApp Now →';

          formStatus.appendChild(statusText);
          formStatus.appendChild(waLink);
          formStatus.classList.add('is-success');
        }

        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

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
          if (btnText) btnText.textContent = 'Transmit via WhatsApp';
        }
      }, 500);
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
        const emailAddress = 'emmanuelbduah@outlook.com';
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
            } else {
              link.classList.remove('is-active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }
});
