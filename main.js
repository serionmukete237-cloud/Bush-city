/* ============================================
   BUSH CITY HOLDINGS — Main JavaScript
   Premium Real Estate Website
   ============================================ */

(function () {
  'use strict';

  /* ---------- Constants ---------- */
  const WHATSAPP_NUMBER = '237676873893';
  const WHATSAPP_BASE_URL = 'https://wa.me/';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initHero();
    initScrollAnimations();
    initBookingForm();
    initGeneralInquiryForm();
    initSmoothScrollLinks();
    initDateInputMinimum();
    initLazyLoadFallback();
  });

  /* ===========================================
     HEADER — Scroll Shadow Effect
     =========================================== */
  function initHeaderScroll() {
    var header = document.querySelector('.header-nav');
    if (!header) return;

    var scrollThreshold = 10;

    function onScroll() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check
  }

  /* ===========================================
     HOME HERO — Reveal and Lightweight Media Carousel
     =========================================== */
  function initHero() {
    var hero = document.querySelector('.hero-section');
    if (!hero) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var gsap = window.gsap;

    initHeroTypewriter(hero, reduceMotion);

    if (gsap && !reduceMotion) {
      var timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .fromTo('.hero-kicker', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.65 })
        .fromTo('.hero-description', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.3')
        .fromTo('.hero-actions', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.32')
        .fromTo('.hero-trust', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.24')
        .fromTo('.hero-media', { autoAlpha: 0, y: 18, x: 8 }, { autoAlpha: 1, y: 0, x: 0, duration: 0.9 }, '-=1');
    } else if (!reduceMotion) {
      hero.classList.add('hero-is-ready');
    }

    initHeroMedia(hero, reduceMotion);
  }

  function initHeroTypewriter(hero, reduceMotion) {
    var title = hero.querySelector('.hero-title');
    var lines = title && title.querySelectorAll('[data-typewriter-line]');
    if (!title || !lines || lines.length !== 2) return;

    var headlines = [
      ['Secure ', 'Your Future'],
      ['Sécurisez ', 'Votre Avenir'],
      ['Invest In ', 'Your Future'],
      ['Investissez ', 'Dans Votre Avenir'],
    ];

    function showHeadline(headline) {
      lines[0].textContent = headline[0];
      lines[1].textContent = headline[1];
      title.setAttribute('aria-label', headline.join('').trim());
    }

    function reserveHeadlineSpace() {
      var measure = title.cloneNode(false);
      var measuredLines = [];

      lines.forEach(function (line) {
        var measuredLine = line.parentElement.cloneNode(false);
        measuredLine.appendChild(document.createElement('span'));
        measuredLines.push(measuredLine.firstElementChild);
        measure.appendChild(measuredLine);
      });

      measure.removeAttribute('id');
      measure.removeAttribute('aria-label');
      measure.setAttribute('aria-hidden', 'true');
      measure.style.position = 'absolute';
      measure.style.left = '-10000px';
      measure.style.top = '0';
      measure.style.width = title.getBoundingClientRect().width + 'px';
      measure.style.minHeight = '0';
      measure.style.height = 'auto';
      measure.style.margin = '0';
      measure.style.visibility = 'hidden';
      measure.style.pointerEvents = 'none';
      measure.style.animation = 'none';
      document.body.appendChild(measure);

      var maxHeight = 0;
      headlines.forEach(function (headline) {
        measuredLines.forEach(function (line, index) {
          line.textContent = headline[index];
        });
        maxHeight = Math.max(maxHeight, measure.getBoundingClientRect().height);
      });

      title.style.minHeight = maxHeight + 'px';
      measure.remove();
    }

    reserveHeadlineSpace();
    window.addEventListener('resize', reserveHeadlineSpace);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(reserveHeadlineSpace);
    }

    if (reduceMotion) {
      showHeadline(headlines[0]);
      return;
    }

    var headlineIndex = 0;
    var lineIndex = 0;
    var characterIndex = 0;
    var deleting = false;
    function updateText() {
      lines.forEach(function (line, index) {
        line.textContent = headlines[headlineIndex][index].slice(0, characterIndexByLine[index]);
        line.classList.toggle('is-typewriter-active', index === lineIndex);
      });
      title.setAttribute('aria-label', headlines[headlineIndex].join('').trim());
    }

    function scheduleNext(delay) {
      window.setTimeout(typeNextCharacter, delay);
    }

    function typeNextCharacter() {
      var phrase = headlines[headlineIndex];

      if (!deleting) {
        var activeLine = phrase[lineIndex];
        characterIndex += 1;
        characterIndexByLine[lineIndex] = characterIndex;

        if (characterIndex >= activeLine.length) {
          if (lineIndex === 0) {
            lineIndex = 1;
            characterIndex = 0;
            updateText();
            scheduleNext(55);
          } else {
            updateText();
            window.setTimeout(function () {
              deleting = true;
              lineIndex = 1;
              characterIndex = characterIndexByLine[1];
              typeNextCharacter();
            }, 2000);
          }
          return;
        }

        updateText();
        scheduleNext(55);
        return;
      }

      characterIndex -= 1;
      characterIndexByLine[lineIndex] = characterIndex;

      if (characterIndex <= 0) {
        characterIndexByLine[lineIndex] = 0;
        if (lineIndex === 1) {
          lineIndex = 0;
          characterIndex = characterIndexByLine[0];
        } else {
          headlineIndex = (headlineIndex + 1) % headlines.length;
          lineIndex = 0;
          characterIndex = 0;
          deleting = false;
        }
      }

      updateText();

      if (deleting) {
        scheduleNext(28);
      } else {
        scheduleNext(55);
      }
    }

    var characterIndexByLine = [0, 0];
    showHeadline(['', '']);
    lines[0].classList.add('is-typewriter-active');
    scheduleNext(55);
  }

  function initHeroMedia(hero, reduceMotion) {
    var card = hero.querySelector('[data-hero-media]');
    if (!card || reduceMotion) return;

    var posters = card.querySelectorAll('.hero-media-poster');
    var videos = card.querySelectorAll('.hero-media-video');
    var title = card.querySelector('[data-hero-media-title]');
    var count = card.querySelector('[data-hero-media-count]');
    var assets = [
      {
        video: 'media/hero/boxing.mp4',
        poster: 'media/hero/boxing.webp',
        alt: 'Land for sale in the Boxing, Molyko area of Buea',
        title: 'Room to grow, right here in Buea.',
      },
      {
        video: 'media/hero/wokaka.mp4',
        poster: 'media/hero/wokaka.webp',
        alt: 'Land promotion opportunity in Wokaka, Buea',
        title: 'A new opportunity in Wokaka.',
      },
      {
        video: 'media/hero/sasse.mp4',
        poster: 'media/hero/sasse.webp',
        alt: 'Hilltop land opportunity beside Sasse College in Buea',
        title: 'Secure land for what comes next.',
      },
    ];

    if (posters.length < 2 || videos.length < 2) return;

    var currentIndex = 0;
    var activeVideo = -1;
    var activePoster = 0;

    function updateCaption(index) {
      if (title) title.textContent = assets[index].title;
      if (count) count.innerHTML = '0' + (index + 1) + ' <span>/ 03</span>';
    }

    function crossfadePoster(index) {
      var nextPosterIndex = 1 - activePoster;
      var nextPoster = posters[nextPosterIndex];

      function showPoster() {
        nextPoster.onload = null;
        nextPoster.onerror = null;
        nextPoster.classList.add('is-visible');
        posters[activePoster].classList.remove('is-visible');
        activePoster = nextPosterIndex;
      }

      nextPoster.onload = showPoster;
      nextPoster.onerror = function () {
        nextPoster.onload = null;
        nextPoster.onerror = null;
        console.error('Unable to load hero poster:', assets[index].poster);
      };
      nextPoster.alt = assets[index].alt;
      nextPoster.src = assets[index].poster;

      if (nextPoster.complete && nextPoster.naturalWidth > 0) showPoster();
    }

    function clearVideo(video) {
      video.pause();
      video.classList.remove('is-visible');
      video.removeAttribute('src');
      video.load();
    }

    function playVideo(index) {
      var nextVideoIndex = activeVideo === 0 ? 1 : 0;
      var nextVideo = videos[nextVideoIndex];
      var previousVideo = activeVideo >= 0 ? videos[activeVideo] : null;
      var settled = false;
      var startTimeout;

      function finishPlayback() {
        if (settled) return;
        settled = true;
        window.clearTimeout(startTimeout);
        nextVideo.removeEventListener('playing', onPlaying);
        nextVideo.removeEventListener('error', onPlaybackError);
        clearVideo(nextVideo);
        if (previousVideo) clearVideo(previousVideo);
        activeVideo = -1;
      }

      function onPlaying() {
        if (settled) return;
        settled = true;
        window.clearTimeout(startTimeout);
        nextVideo.removeEventListener('error', onPlaybackError);
        nextVideo.classList.add('is-visible');
        if (previousVideo) clearVideo(previousVideo);
        activeVideo = nextVideoIndex;
      }

      function onPlaybackError() {
        finishPlayback();
      }

      clearVideo(nextVideo);
      nextVideo.poster = assets[index].poster;
      nextVideo.addEventListener('playing', onPlaying, { once: true });
      nextVideo.addEventListener('error', onPlaybackError, { once: true });
      nextVideo.src = assets[index].video;
      nextVideo.load();

      startTimeout = window.setTimeout(finishPlayback, 5000);

      try {
        var playback = nextVideo.play();
        if (playback && typeof playback.catch === 'function') {
          playback.catch(finishPlayback);
        }
      } catch (error) {
        finishPlayback();
      }
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % assets.length;
      if (activeVideo >= 0) videos[activeVideo].classList.remove('is-visible');
      crossfadePoster(currentIndex);
      updateCaption(currentIndex);
      playVideo(currentIndex);
    }

    updateCaption(0);

    playVideo(0);

    window.setInterval(showNext, 8500);
  }

  /* ===========================================
     SCROLL ANIMATIONS — Intersection Observer
     =========================================== */
  function initScrollAnimations() {
    var animatedElements = document.querySelectorAll('.animate-on-scroll, .stagger-children');

    if (!animatedElements.length) return;

    // Use IntersectionObserver if supported
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target); // Only animate once
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      animatedElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show everything
      animatedElements.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  /* ===========================================
     BOOKING FORM — Validation & WhatsApp
     =========================================== */
  function initBookingForm() {
    var form = document.getElementById('booking-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form values
      var fullName = getFieldValue('fullName');
      var phoneNumber = getFieldValue('phoneNumber');
      var preferredProperty = getFieldValue('preferredProperty');
      var inspectionDate = getFieldValue('inspectionDate');
      var additionalMessage = getFieldValue('additionalMessage');

      // Validate required fields
      var isValid = true;

      if (!fullName.trim()) {
        showFieldError('fullName', 'Please enter your full name.');
        isValid = false;
      } else {
        clearFieldError('fullName');
      }

      if (!phoneNumber.trim()) {
        showFieldError('phoneNumber', 'Please enter your phone number.');
        isValid = false;
      } else if (!isValidPhone(phoneNumber)) {
        showFieldError('phoneNumber', 'Please enter a valid phone number.');
        isValid = false;
      } else {
        clearFieldError('phoneNumber');
      }

      if (!preferredProperty || preferredProperty === '') {
        showFieldError('preferredProperty', 'Please select a property or location.');
        isValid = false;
      } else {
        clearFieldError('preferredProperty');
      }

      if (!inspectionDate) {
        showFieldError('inspectionDate', 'Please select a preferred inspection date.');
        isValid = false;
      } else {
        clearFieldError('inspectionDate');
      }

      if (!isValid) {
        // Scroll to first error
        var firstError = form.querySelector('.form-input.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }

      // Format the date nicely
      var formattedDate = formatDate(inspectionDate);

      // Build WhatsApp message
      var message =
        'Hello Bush City Holdings, my name is ' +
        fullName.trim() +
        '. I am interested in ' +
        preferredProperty +
        ' and would like to schedule a site inspection on ' +
        formattedDate +
        '.';

      if (phoneNumber.trim()) {
        message += ' My phone number is ' + phoneNumber.trim() + '.';
      }

      if (additionalMessage.trim()) {
        message += ' Additional notes: ' + additionalMessage.trim();
      }

      message += ' Please provide more information.';

      // Open WhatsApp
      openWhatsApp(message);
    });

    // Clear errors on input
    var inputs = form.querySelectorAll('.form-input');
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        clearFieldError(input.id);
      });
      input.addEventListener('change', function () {
        clearFieldError(input.id);
      });
    });
  }

  /* ===========================================
     GENERAL INQUIRY FORM — Validation & WhatsApp
     =========================================== */
  function initGeneralInquiryForm() {
    var form = document.getElementById('general-inquiry-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = getFieldValue('generalName');
      var email = getFieldValue('generalEmail');
      var subject = getFieldValue('generalSubject');
      var messageText = getFieldValue('generalMessage');

      var isValid = true;

      if (!name.trim()) {
        showFieldError('generalName', 'Please enter your name.');
        isValid = false;
      } else {
        clearFieldError('generalName');
      }

      if (!email.trim()) {
        showFieldError('generalEmail', 'Please enter your email address.');
        isValid = false;
      } else if (!isValidEmail(email)) {
        showFieldError('generalEmail', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearFieldError('generalEmail');
      }

      if (!subject.trim()) {
        showFieldError('generalSubject', 'Please enter a subject.');
        isValid = false;
      } else {
        clearFieldError('generalSubject');
      }

      if (!messageText.trim()) {
        showFieldError('generalMessage', 'Please enter your message.');
        isValid = false;
      } else {
        clearFieldError('generalMessage');
      }

      if (!isValid) {
        var firstError = form.querySelector('.form-input.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }

      // Build WhatsApp message
      var whatsappMessage =
        'Hello Bush City Holdings, my name is ' +
        name.trim() +
        '. Subject: ' +
        subject.trim() +
        '. Message: ' +
        messageText.trim() +
        '. My email is ' +
        email.trim() +
        '. Please get back to me. Thank you.';

      openWhatsApp(whatsappMessage);
    });

    // Clear errors on input
    var inputs = form.querySelectorAll('.form-input');
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        clearFieldError(input.id);
      });
    });
  }

  /* ===========================================
     SMOOTH SCROLL — for anchor links
     =========================================== */
  function initSmoothScrollLinks() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Close mobile menu if open (Alpine.js handles this, but as a safety)
          var mobileMenu = document.querySelector('[x-data]');
          if (mobileMenu && mobileMenu.__x) {
            mobileMenu.__x.$data.mobileMenu = false;
          }
        }
      });
    });
  }

  /* ===========================================
     DATE INPUT — Set minimum to today
     =========================================== */
  function initDateInputMinimum() {
    var dateInputs = document.querySelectorAll('input[type="date"]');
    var today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(function (input) {
      if (!input.min) {
        input.min = today;
      }
    });
  }

  /* ===========================================
     LAZY LOAD FALLBACK
     =========================================== */
  function initLazyLoadFallback() {
    // For browsers that do not support native lazy loading
    if ('loading' in HTMLImageElement.prototype) return;

    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if (!lazyImages.length) return;

    if ('IntersectionObserver' in window) {
      var imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imgObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(function (img) {
        imgObserver.observe(img);
      });
    }
  }

  /* ===========================================
     UTILITY FUNCTIONS
     =========================================== */

  /**
   * Get value from a form field by its ID
   */
  function getFieldValue(fieldId) {
    var field = document.getElementById(fieldId);
    return field ? field.value : '';
  }

  /**
   * Show an error state on a form field
   */
  function showFieldError(fieldId, message) {
    var field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.add('error');

    // Show error message if element exists
    var errorEl = document.getElementById(fieldId + '-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  /**
   * Clear the error state on a form field
   */
  function clearFieldError(fieldId) {
    var field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.remove('error');

    var errorEl = document.getElementById(fieldId + '-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  /**
   * Basic phone number validation
   */
  function isValidPhone(phone) {
    // Allow digits, spaces, dashes, parens, plus sign. Minimum 8 chars.
    var cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    return /^\d{8,15}$/.test(cleaned);
  }

  /**
   * Basic email validation
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Format a date string (YYYY-MM-DD) into a readable format
   */
  function formatDate(dateString) {
    var parts = dateString.split('-');
    var months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    var year = parts[0];
    var month = months[parseInt(parts[1], 10) - 1];
    var day = parseInt(parts[2], 10);
    return month + ' ' + day + ', ' + year;
  }

  /**
   * Open WhatsApp with a pre-filled message
   */
  function openWhatsApp(message) {
    var encodedMessage = encodeURIComponent(message);
    var url = WHATSAPP_BASE_URL + WHATSAPP_NUMBER + '?text=' + encodedMessage;

    // Try to open in new tab
    var win = window.open(url, '_blank');

    // Fallback: redirect current page if popup blocked
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = url;
    }
  }

  /* ===========================================
     PROPERTY MODAL — Helper for properties page
     =========================================== */

  // Expose modal helpers globally for Alpine.js integration
  window.BushCity = {
    openWhatsApp: openWhatsApp,
    WHATSAPP_NUMBER: WHATSAPP_NUMBER,

    /**
     * Generate a WhatsApp URL for a specific property inquiry
     */
    getPropertyInquiryURL: function (propertyName) {
      var message =
        'Hello Bush City Holdings, I am interested in ' +
        propertyName +
        ' and would like to get more information. Please provide details about pricing, availability, and site inspection options.';
      return WHATSAPP_BASE_URL + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
    },

    /**
     * Generate a WhatsApp URL for booking a site inspection
     */
    getInspectionURL: function (propertyName) {
      var message =
        'Hello Bush City Holdings, I would like to schedule a site inspection for ' +
        propertyName +
        '. Please let me know the available dates and any details I need to know.';
      return WHATSAPP_BASE_URL + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
    },

    /**
     * Lock body scroll (for modals)
     */
    lockScroll: function () {
      document.body.classList.add('modal-open');
    },

    /**
     * Unlock body scroll
     */
    unlockScroll: function () {
      document.body.classList.remove('modal-open');
    },
  };
})();
