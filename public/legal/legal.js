/**
 * Doctorina Legal Document Embed Script
 * Loads legal documents (terms, privacy, cookies) into a target element.
 *
 * Usage (declarative — just two lines):
 *   <div data-legal="privacy" data-version="latest"></div>
 *   <script async src="https://pages.doctorina.com/legal/legal.js"></script>
 *
 * The script auto-detects its origin for cross-domain content fetching.
 * No extra configuration needed.
 *
 * Usage (programmatic):
 *   DocLegal.init({ locale: 'es' });
 *   DocLegal.setLocale('en');
 *
 * Content files are loaded from: {scriptOrigin}/legal/content/{doc}/{version}/{locale}.html
 *
 * CSP requirements (if embedding on a page with strict CSP):
 *   - script-src must include the domain serving this script
 *   - connect-src must include the domain serving the content files
 *   - style-src must allow 'unsafe-inline' (for the loading spinner)
 */
(function () {
  'use strict';

  // ── Catalog ────────────────────────────────────────────────────────
  // Available documents, versions, and locales (update when adding content)
  var CATALOG = {
    terms: {
      latest: { en: 'English', es: 'Español' },
      v1: { en: 'English' }
    },
    privacy: {
      latest: { en: 'English', es: 'Español' },
      v1: { en: 'English', es: 'Español' }
    },
    cookies: {
      latest: { en: 'English', es: 'Español' }
    }
  };

  // Version/locale combos that have a separate Apple-variant HTML file.
  // When variant is "apple" and no entry exists here, the script uses
  // data-include/data-exclude in the standard file instead.
  var APPLE_FILES = {
    'terms/v1/en': true,
    'privacy/v1/en': true
  };

  // ── State ──────────────────────────────────────────────────────────
  var _el = null;
  var _selectorEl = null;
  var _doc = null;
  var _version = null;
  var _locale = null;
  var _variant = null;
  var _baseUrl = '';
  var _scriptOrigin = '';
  var _spinnerInjected = false;

  // Detect the origin this script was loaded from (for cross-origin embedding)
  (function () {
    try {
      var src = document.currentScript && document.currentScript.src;
      if (src) {
        var a = document.createElement('a');
        a.href = src;
        _scriptOrigin = a.origin;
        // Only set if script is on a different origin than the page
        if (_scriptOrigin !== window.location.origin) {
          _baseUrl = _scriptOrigin;
        }
      }
    } catch (e) { /* ignore */ }
  })();

  // ── Helpers ────────────────────────────────────────────────────────

  function getUrlParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      locale: params.get('locale') || params.get('lang') || params.get('l'),
      variant: params.get('variant'),
      apple: params.get('apple') || params.get('isApple') || params.get('is_apple'),
      version: params.get('version') || params.get('v')
    };
  }

  function isApplePlatform() {
    return /iPhone|iPad|iPod|Macintosh|Mac OS X/.test(navigator.userAgent);
  }

  function resolveVariant(attrVariant) {
    var p = getUrlParams();
    if (p.variant) return p.variant;
    if (p.apple === 'true') return 'apple';
    if (attrVariant) return attrVariant;
    if (isApplePlatform()) return 'apple';
    return null;
  }

  function resolveLocale(available, programmatic, attrLocale) {
    var candidates = [];

    if (programmatic) candidates.push(programmatic);

    var p = getUrlParams();
    if (p.locale) candidates.push(p.locale);

    if (attrLocale) candidates.push(attrLocale);

    if (typeof navigator !== 'undefined') {
      var langs = navigator.languages || [navigator.language];
      for (var i = 0; i < langs.length; i++) {
        if (langs[i]) candidates.push(langs[i]);
      }
    }

    for (var j = 0; j < candidates.length; j++) {
      var code = candidates[j].toLowerCase().split(/[-_]/)[0];
      if (available[code]) return code;
    }

    return 'en';
  }

  function buildUrl(doc, version, locale, variant) {
    var file = locale;
    if (variant && APPLE_FILES[doc + '/' + version + '/' + locale]) {
      file = locale + '-' + variant;
    }
    return _baseUrl + '/legal/content/' + doc + '/' + version + '/' + file + '.html';
  }

  // ── Spinner ────────────────────────────────────────────────────────

  function injectSpinnerStyle() {
    if (_spinnerInjected) return;
    var s = document.createElement('style');
    s.textContent =
      '@keyframes _dl_spin{to{transform:rotate(360deg)}}' +
      '._dl_spinner{display:flex;justify-content:center;align-items:center;min-height:200px}' +
      '._dl_spinner::after{content:"";width:36px;height:36px;border:3px solid #e0e0e0;' +
      'border-top-color:#888;border-radius:50%;animation:_dl_spin .6s linear infinite}';
    document.head.appendChild(s);
    _spinnerInjected = true;
  }

  function showSpinner(el) {
    injectSpinnerStyle();
    el.innerHTML = '<div class="_dl_spinner"></div>';
  }

  // ── Variant processing ─────────────────────────────────────────────

  function processVariants(el, variant) {
    var i, j, vals, found;

    // data-exclude: remove element if variant matches
    var excludes = el.querySelectorAll('[data-exclude]');
    for (i = excludes.length - 1; i >= 0; i--) {
      vals = excludes[i].getAttribute('data-exclude').split(',');
      for (j = 0; j < vals.length; j++) {
        if (vals[j].trim() === variant) {
          excludes[i].remove();
          break;
        }
      }
    }

    // data-include: remove element if variant does NOT match
    var includes = el.querySelectorAll('[data-include]');
    for (i = includes.length - 1; i >= 0; i--) {
      vals = includes[i].getAttribute('data-include').split(',');
      found = false;
      for (j = 0; j < vals.length; j++) {
        if (vals[j].trim() === variant) { found = true; break; }
      }
      if (!found) includes[i].remove();
    }
  }

  function processNoVariant(el) {
    // No variant active — remove all include-only elements
    var includes = el.querySelectorAll('[data-include]');
    for (var i = includes.length - 1; i >= 0; i--) {
      includes[i].remove();
    }
  }

  // ── Link interception (universal router) ──────────────────────────

  // All internal links use hash format: #legal/{doc}?version=v1&variant=apple
  var HASH_RE = /^#legal\/(terms|privacy|cookies)/;

  function wireLinks(el) {
    el.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;

      var match = href.match(HASH_RE);
      if (!match) return;

      e.preventDefault();
      var targetDoc = match[1];
      var params = {};
      var qIdx = href.indexOf('?');
      if (qIdx !== -1) {
        var sp = new URLSearchParams(href.substring(qIdx));
        if (sp.get('variant')) params.variant = sp.get('variant');
        if (sp.get('version')) params.version = sp.get('version');
        if (sp.get('locale')) params.locale = sp.get('locale');
      }
      navigateTo({ doc: targetDoc, version: params.version, variant: params.variant, locale: params.locale });
    });
  }

  function navigateTo(opts) {
    var newDoc = opts.doc || _doc;
    var catalog = CATALOG[newDoc];
    if (!catalog) return;

    var newVersion = opts.version || (newDoc !== _doc ? 'latest' : _version);
    if (!catalog[newVersion]) newVersion = 'latest';

    var available = catalog[newVersion];

    // Update variant if explicitly provided, keep current otherwise
    if (opts.variant !== undefined) {
      _variant = opts.variant || null;
    }

    // Resolve locale for the new doc/version
    _locale = available[opts.locale || _locale] ? (opts.locale || _locale) : 'en';
    _doc = newDoc;
    _version = newVersion;
    fetchAndRender();
  }

  // ── Locale selector ────────────────────────────────────────────────

  function populateSelector() {
    if (!_selectorEl) return;
    var catalog = CATALOG[_doc];
    if (!catalog || !catalog[_version]) return;

    var available = catalog[_version];
    _selectorEl.innerHTML = '';

    var select = document.createElement('select');
    select.className = 'locale-select';
    select.setAttribute('aria-label', 'Select language');

    for (var code in available) {
      if (!available.hasOwnProperty(code)) continue;
      var option = document.createElement('option');
      option.value = code;
      option.textContent = available[code];
      if (code === _locale) option.selected = true;
      select.appendChild(option);
    }

    select.addEventListener('change', function () {
      DocLegal.setLocale(this.value);
    });

    _selectorEl.appendChild(select);
  }

  // ── Fetch & render ─────────────────────────────────────────────────

  function fetchAndRender() {
    // Only show spinner on initial load (empty element), not on locale/version switch
    if (!_el.children.length) {
      showSpinner(_el);
    }

    var url = buildUrl(_doc, _version, _locale, _variant);

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (html) {
        _el.innerHTML = html;

        if (_variant) {
          processVariants(_el, _variant);
        } else {
          processNoVariant(_el);
        }

        wireLinks(_el);
        populateSelector();
        document.documentElement.lang = _locale;
      })
      .catch(function (err) {
        _el.innerHTML = '<p>Failed to load document. Please try again later.</p>';
        console.error('[DocLegal]', err);
      });
  }

  // ── Public API ─────────────────────────────────────────────────────

  var DocLegal = {
    /**
     * Initialize the legal document embed.
     * @param {Object} [options]
     * @param {string} [options.baseUrl] - Base URL for content files (for cross-origin embedding)
     * @param {string} [options.locale]  - Override locale programmatically
     * @param {string} [options.variant] - Override variant programmatically
     */
    init: function (options) {
      options = options || {};

      _el = document.querySelector('[data-legal]');
      if (!_el) {
        console.warn('[DocLegal] No element with [data-legal] found');
        return;
      }

      _selectorEl = document.querySelector('[data-legal-locale-selector]');

      _doc = _el.getAttribute('data-legal');
      var catalog = CATALOG[_doc];
      if (!catalog) {
        console.error('[DocLegal] Unknown document: ' + _doc);
        return;
      }

      _baseUrl = (options.baseUrl || _el.getAttribute('data-base-url') || _baseUrl || '').replace(/\/+$/, '');

      // Resolve version
      var urlVersion = getUrlParams().version;
      _version = urlVersion || _el.getAttribute('data-version') || 'latest';
      if (!catalog[_version]) _version = 'latest';

      // Resolve variant and locale
      var available = catalog[_version];
      _variant = resolveVariant(options.variant || _el.getAttribute('data-variant'));
      _locale = resolveLocale(available, options.locale, _el.getAttribute('data-locale'));

      fetchAndRender();
    },

    /**
     * Switch locale. Fetches new content and updates the selector.
     * @param {string} locale
     */
    setLocale: function (locale) {
      if (locale === _locale) return;

      var catalog = CATALOG[_doc];
      if (!catalog || !catalog[_version]) return;

      if (!catalog[_version][locale]) {
        console.warn('[DocLegal] Locale not available: ' + locale);
        return;
      }

      _locale = locale;
      fetchAndRender();
    }
  };

  window.DocLegal = DocLegal;

  // ── Auto-init ──────────────────────────────────────────────────────

  function autoInit() {
    if (document.querySelector('[data-legal]')) {
      DocLegal.init();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
})();
