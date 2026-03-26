import fs from 'fs';
import path from 'path';

const SCRIPT_PATH = path.resolve(__dirname, '../public/legal/legal.js');
const CONTENT_DIR = path.resolve(__dirname, '../public/legal/content');
const SCRIPT_SRC = fs.readFileSync(SCRIPT_PATH, 'utf8');

// ── Helpers ──────────────────────────────────────────────────────────

function mockFetch(html: string) {
  return vi.fn().mockResolvedValue({
    ok: true,
    text: () => Promise.resolve(html),
  });
}

function mockFetchFail(status = 404) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    text: () => Promise.resolve(''),
  });
}

/** Load legal.js into the current jsdom. Must be called AFTER setting up the DOM. */
function loadScript() {
  // The script's IIFE captures state in closure vars that persist.
  // Re-evaluating creates a fresh closure each time.
  // eslint-disable-next-line no-eval
  eval(SCRIPT_SRC);
}

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

const SAMPLE_HTML = `
<h1>Privacy Policy</h1>
<p>Effective as of 2025-05-29</p>
<p>Some content here</p>
<a href="#legal/privacy?version=v1">Version 1</a>
<div data-exclude="apple">Desktop only</div>
<div data-include="apple">Apple only</div>
`;

// ── Tests ────────────────────────────────────────────────────────────

describe('legal.js', () => {
  let originalFetch: typeof global.fetch;
  let originalUserAgent: PropertyDescriptor | undefined;

  beforeEach(() => {
    originalFetch = global.fetch;
    originalUserAgent = Object.getOwnPropertyDescriptor(navigator, 'userAgent');

    document.head.innerHTML = '';
    document.body.innerHTML = '';
    // Reset location search
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, search: '' },
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete (window as any).DocLegal;
    if (originalUserAgent) {
      Object.defineProperty(navigator, 'userAgent', originalUserAgent);
    }
    vi.restoreAllMocks();
  });

  // ── Auto-init ────────────────────────────────────────────────────

  describe('auto-init', () => {
    it('should auto-init when [data-legal] exists in DOM', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = mockFetch(SAMPLE_HTML);

      loadScript();
      await flushPromises();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect((window as any).DocLegal).toBeDefined();
    });

    it('should not auto-init when no [data-legal] exists', () => {
      document.body.innerHTML = '<div>No legal content</div>';
      global.fetch = vi.fn();

      loadScript();

      expect(global.fetch).not.toHaveBeenCalled();
      expect((window as any).DocLegal).toBeDefined(); // API still exposed
    });
  });

  // ── Init ─────────────────────────────────────────────────────────

  describe('init', () => {
    it('should fetch content for the specified document', async () => {
      document.body.innerHTML = '<div data-legal="terms" data-version="latest"></div>';
      global.fetch = mockFetch('<h1>Terms</h1>');

      loadScript();
      await flushPromises();

      const url = (global.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('/legal/content/terms/latest/');
      expect(url).toMatch(/\.html$/);
    });

    it('should use baseUrl from data attribute', async () => {
      document.body.innerHTML =
        '<div data-legal="privacy" data-version="latest" data-base-url="https://example.com"></div>';
      global.fetch = mockFetch('<h1>Privacy</h1>');

      loadScript();
      await flushPromises();

      const url = (global.fetch as any).mock.calls[0][0] as string;
      expect(url).toMatch(/^https:\/\/example\.com\/legal\/content\//);
    });

    it('should use baseUrl from init options (overrides attribute)', async () => {
      document.body.innerHTML =
        '<div data-legal="privacy" data-version="latest" data-base-url="https://attr.com"></div>';
      global.fetch = mockFetch('<h1>Privacy</h1>');

      loadScript();
      // Re-init with programmatic baseUrl
      (window as any).DocLegal.init({ baseUrl: 'https://option.com' });
      await flushPromises();

      const lastCall = (global.fetch as any).mock.calls.at(-1)[0] as string;
      expect(lastCall).toMatch(/^https:\/\/option\.com\/legal\/content\//);
    });

    it('should strip trailing slash from baseUrl', async () => {
      document.body.innerHTML =
        '<div data-legal="cookies" data-version="latest" data-base-url="https://example.com/"></div>';
      global.fetch = mockFetch('<h1>Cookies</h1>');

      loadScript();
      await flushPromises();

      const url = (global.fetch as any).mock.calls[0][0] as string;
      expect(url).not.toContain('//legal');
    });

    it('should warn and return if no [data-legal] element', () => {
      document.body.innerHTML = '<div>Nothing</div>';
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      global.fetch = vi.fn();

      loadScript();
      (window as any).DocLegal.init();

      expect(warn).toHaveBeenCalledWith(expect.stringContaining('No element'));
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should error on unknown document type', () => {
      document.body.innerHTML = '<div data-legal="unknown"></div>';
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      global.fetch = vi.fn();

      loadScript();
      (window as any).DocLegal.init();

      expect(error).toHaveBeenCalledWith(expect.stringContaining('Unknown document'));
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should fallback to latest if version is invalid', async () => {
      document.body.innerHTML = '<div data-legal="cookies" data-version="v99"></div>';
      global.fetch = mockFetch('<h1>Cookies</h1>');

      loadScript();
      await flushPromises();

      const url = (global.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('/cookies/latest/');
    });
  });

  // ── Spinner ──────────────────────────────────────────────────────

  describe('spinner', () => {
    it('should show spinner on initial load (empty element)', () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      // Use a fetch that never resolves
      global.fetch = vi.fn().mockReturnValue(new Promise(() => {}));

      loadScript();

      const el = document.querySelector('[data-legal]')!;
      expect(el.querySelector('._dl_spinner')).not.toBeNull();
    });

    it('should NOT show spinner when switching locale (element has content)', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest" data-locale="en"></div>';
      const fetchMock = mockFetch('<h1>Privacy</h1><p>Content</p>');
      global.fetch = fetchMock;

      loadScript();
      await flushPromises();

      // Element now has content. Switch locale with a slow fetch.
      fetchMock.mockClear();
      global.fetch = vi.fn().mockReturnValue(new Promise(() => {})); // never resolves

      (window as any).DocLegal.setLocale('es');

      const el = document.querySelector('[data-legal]')!;
      // Should keep old content visible, not show spinner
      expect(el.querySelector('._dl_spinner')).toBeNull();
      expect(el.querySelector('h1')!.textContent).toBe('Privacy');
    });

    it('should inject spinner style tag into head', () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = vi.fn().mockReturnValue(new Promise(() => {}));

      loadScript();

      const styles = document.head.querySelectorAll('style');
      const hasSpinnerStyle = Array.from(styles).some((s) =>
        s.textContent?.includes('_dl_spin'),
      );
      expect(hasSpinnerStyle).toBe(true);
    });
  });

  // ── Content rendering ────────────────────────────────────────────

  describe('content rendering', () => {
    it('should inject fetched HTML into the target element', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = mockFetch('<h1>Privacy Policy</h1><p>Content</p>');

      loadScript();
      await flushPromises();

      const el = document.querySelector('[data-legal]')!;
      expect(el.querySelector('h1')?.textContent).toBe('Privacy Policy');
    });

    it('should show error message on fetch failure', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = mockFetchFail(500);
      vi.spyOn(console, 'error').mockImplementation(() => {});

      loadScript();
      await flushPromises();

      const el = document.querySelector('[data-legal]')!;
      expect(el.textContent).toContain('Failed to load');
    });

    it('should set document.documentElement.lang', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest" data-locale="es"></div>';
      global.fetch = mockFetch('<h1>Política</h1>');

      loadScript();
      await flushPromises();

      expect(document.documentElement.lang).toBe('es');
    });
  });

  // ── Locale resolution ────────────────────────────────────────────

  describe('locale resolution', () => {
    it('should use programmatic locale over attribute', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest" data-locale="en"></div>';
      global.fetch = mockFetch('<h1>Política</h1>');

      loadScript();
      (window as any).DocLegal.init({ locale: 'es' });
      await flushPromises();

      const lastUrl = (global.fetch as any).mock.calls.at(-1)[0] as string;
      expect(lastUrl).toContain('/es.html');
    });

    it('should use data-locale attribute', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest" data-locale="es"></div>';
      global.fetch = mockFetch('<h1>Política</h1>');

      loadScript();
      await flushPromises();

      const url = (global.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('/es.html');
    });

    it('should fallback to en if locale unavailable', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest" data-locale="fr"></div>';
      global.fetch = mockFetch('<h1>Privacy</h1>');

      loadScript();
      await flushPromises();

      const url = (global.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('/en.html');
    });

    it('should read locale from URL param ?locale=', async () => {
      (window as any).location.search = '?locale=es';
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = mockFetch('<h1>Política</h1>');

      loadScript();
      await flushPromises();

      const url = (global.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('/es.html');
    });

    it('should read locale from URL param ?lang=', async () => {
      (window as any).location.search = '?lang=es';
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = mockFetch('<h1>Política</h1>');

      loadScript();
      await flushPromises();

      const url = (global.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('/es.html');
    });
  });

  // ── Version resolution ───────────────────────────────────────────

  describe('version resolution', () => {
    it('should read version from URL param ?version=', async () => {
      (window as any).location.search = '?version=v1';
      document.body.innerHTML = '<div data-legal="terms" data-version="latest"></div>';
      global.fetch = mockFetch('<h1>Terms v1</h1>');

      loadScript();
      await flushPromises();

      const url = (global.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('/terms/v1/');
    });

    it('should read version from URL param ?v=', async () => {
      (window as any).location.search = '?v=v1';
      document.body.innerHTML = '<div data-legal="terms" data-version="latest"></div>';
      global.fetch = mockFetch('<h1>Terms v1</h1>');

      loadScript();
      await flushPromises();

      const url = (global.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('/terms/v1/');
    });
  });

  // ── Variant handling ─────────────────────────────────────────────

  describe('variant handling', () => {
    it('should use apple variant file for known combos', async () => {
      (window as any).location.search = '?variant=apple&version=v1';
      document.body.innerHTML = '<div data-legal="terms" data-version="latest"></div>';
      global.fetch = mockFetch('<h1>Terms Apple</h1>');

      loadScript();
      await flushPromises();

      const url = (global.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('/en-apple.html');
    });

    it('should NOT use apple variant file for latest (no separate file)', async () => {
      (window as any).location.search = '?variant=apple';
      document.body.innerHTML = '<div data-legal="terms" data-version="latest"></div>';
      global.fetch = mockFetch(SAMPLE_HTML);

      loadScript();
      await flushPromises();

      const url = (global.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('/en.html');
      expect(url).not.toContain('-apple');
    });

    it('should detect apple from ?apple=true URL param', async () => {
      (window as any).location.search = '?apple=true&version=v1';
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = mockFetch('<h1>Privacy Apple</h1>');

      loadScript();
      await flushPromises();

      const url = (global.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('/en-apple.html');
    });

    it('should detect apple from data-variant attribute', async () => {
      document.body.innerHTML =
        '<div data-legal="terms" data-version="v1" data-variant="apple"></div>';
      global.fetch = mockFetch('<h1>Terms Apple</h1>');

      loadScript();
      await flushPromises();

      const url = (global.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('/en-apple.html');
    });
  });

  // ── data-include / data-exclude ──────────────────────────────────

  describe('data-include / data-exclude', () => {
    it('should remove data-exclude elements when variant matches', async () => {
      (window as any).location.search = '?variant=apple';
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = mockFetch(SAMPLE_HTML);

      loadScript();
      await flushPromises();

      const el = document.querySelector('[data-legal]')!;
      expect(el.querySelector('[data-exclude="apple"]')).toBeNull();
      expect(el.querySelector('[data-include="apple"]')).not.toBeNull();
    });

    it('should remove data-include elements when variant does NOT match', async () => {
      (window as any).location.search = '?variant=google';
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = mockFetch(SAMPLE_HTML);

      loadScript();
      await flushPromises();

      const el = document.querySelector('[data-legal]')!;
      // apple-only content removed because variant is google
      expect(el.querySelector('[data-include="apple"]')).toBeNull();
      // desktop-only kept because variant is google, not apple
      expect(el.querySelector('[data-exclude="apple"]')).not.toBeNull();
    });

    it('should remove all data-include elements when no variant', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = mockFetch(SAMPLE_HTML);
      // Override UA to not be apple
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });

      loadScript();
      await flushPromises();

      const el = document.querySelector('[data-legal]')!;
      expect(el.querySelector('[data-include]')).toBeNull();
      expect(el.querySelector('[data-exclude="apple"]')).not.toBeNull();
    });

    it('should support comma-separated values in data-exclude', async () => {
      (window as any).location.search = '?variant=google';
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = mockFetch(
        '<div data-exclude="apple,google">Hidden</div><div data-exclude="apple">Visible</div>',
      );

      loadScript();
      await flushPromises();

      const el = document.querySelector('[data-legal]')!;
      expect(el.querySelectorAll('[data-exclude]')).toHaveLength(1);
      expect(el.querySelector('[data-exclude="apple"]')?.textContent).toBe('Visible');
    });
  });

  // ── Link interception (universal router) ────────────────────────

  describe('link routing', () => {
    it('should handle #legal/ version links', async () => {
      document.body.innerHTML = '<div data-legal="terms" data-version="latest"></div>';
      const fetchMock = mockFetch(
        '<h1>Terms</h1><a href="#legal/terms?version=v1">Version 1</a>',
      );
      global.fetch = fetchMock;

      loadScript();
      await flushPromises();

      fetchMock.mockClear();
      fetchMock.mockResolvedValue({ ok: true, text: () => Promise.resolve('<h1>V1</h1>') });

      const link = document.querySelector('a[href*="version=v1"]') as HTMLElement;
      link.click();
      await flushPromises();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain('/terms/v1/');
    });

    it('should fallback locale to en when switching to version without current locale', async () => {
      document.body.innerHTML = '<div data-legal="terms" data-version="latest" data-locale="es"></div>';
      const fetchMock = mockFetch(
        '<h1>Terms</h1><a href="#legal/terms?version=v1">Version 1</a>',
      );
      global.fetch = fetchMock;

      loadScript();
      await flushPromises();

      fetchMock.mockClear();
      fetchMock.mockResolvedValue({ ok: true, text: () => Promise.resolve('<h1>V1</h1>') });

      const link = document.querySelector('a[href*="version=v1"]') as HTMLElement;
      link.click();
      await flushPromises();

      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain('/terms/v1/en.html');
    });

    it('should navigate to a different document via #legal/privacy', async () => {
      document.body.innerHTML = '<div data-legal="terms" data-version="latest"></div>';
      const fetchMock = mockFetch(
        '<h1>Terms</h1><a href="#legal/privacy">Privacy Policy</a>',
      );
      global.fetch = fetchMock;

      loadScript();
      await flushPromises();

      fetchMock.mockClear();
      fetchMock.mockResolvedValue({ ok: true, text: () => Promise.resolve('<h1>Privacy</h1>') });

      const link = document.querySelector('a[href="#legal/privacy"]') as HTMLElement;
      link.click();
      await flushPromises();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain('/legal/content/privacy/latest/');
    });

    it('should handle #legal/ links with query params', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      const fetchMock = mockFetch(
        '<h1>Privacy</h1><a href="#legal/cookies?variant=apple">Cookies</a>',
      );
      global.fetch = fetchMock;

      loadScript();
      await flushPromises();

      fetchMock.mockClear();
      fetchMock.mockResolvedValue({ ok: true, text: () => Promise.resolve('<h1>Cookies</h1>') });

      const link = document.querySelector('a[href*="cookies"]') as HTMLElement;
      link.click();
      await flushPromises();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain('/legal/content/cookies/latest/');
    });

    it('should switch to latest version when navigating to a different document', async () => {
      document.body.innerHTML = '<div data-legal="terms" data-version="v1"></div>';
      const fetchMock = mockFetch(
        '<h1>Terms v1</h1><a href="#legal/privacy">Privacy</a>',
      );
      global.fetch = fetchMock;

      loadScript();
      await flushPromises();

      fetchMock.mockClear();
      fetchMock.mockResolvedValue({ ok: true, text: () => Promise.resolve('<h1>Privacy</h1>') });

      const link = document.querySelector('a[href="#legal/privacy"]') as HTMLElement;
      link.click();
      await flushPromises();

      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain('/privacy/latest/');
    });

    it('should NOT intercept external links', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = mockFetch(
        '<h1>Privacy</h1><a href="https://example.com">External</a>',
      );

      loadScript();
      await flushPromises();

      const fetchMock = vi.fn();
      global.fetch = fetchMock;

      const link = document.querySelector('a[href="https://example.com"]') as HTMLAnchorElement;
      link.addEventListener('click', (e) => e.preventDefault());
      link.click();

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should NOT intercept mailto: links', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = mockFetch(
        '<h1>Privacy</h1><a href="mailto:support@example.com">Email</a>',
      );

      loadScript();
      await flushPromises();

      const fetchMock = vi.fn();
      global.fetch = fetchMock;

      const link = document.querySelector('a[href^="mailto:"]') as HTMLAnchorElement;
      link.addEventListener('click', (e) => e.preventDefault());
      link.click();

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should parse version from #legal/terms?version=v1', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      const fetchMock = mockFetch(
        '<h1>Privacy</h1><a href="#legal/terms?version=v1">Terms v1</a>',
      );
      global.fetch = fetchMock;

      loadScript();
      await flushPromises();

      fetchMock.mockClear();
      fetchMock.mockResolvedValue({ ok: true, text: () => Promise.resolve('<h1>Terms v1</h1>') });

      const link = document.querySelector('a[href*="terms"]') as HTMLElement;
      link.click();
      await flushPromises();

      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain('/terms/v1/');
    });
  });

  // ── Locale selector ──────────────────────────────────────────────

  describe('locale selector', () => {
    it('should populate selector with available locales', async () => {
      document.body.innerHTML = `
        <div data-legal-locale-selector></div>
        <div data-legal="privacy" data-version="latest"></div>
      `;
      global.fetch = mockFetch('<h1>Privacy</h1>');

      loadScript();
      await flushPromises();

      const selector = document.querySelector('[data-legal-locale-selector]')!;
      const select = selector.querySelector('select') as HTMLSelectElement;
      expect(select).not.toBeNull();
      expect(select.options).toHaveLength(2);
      expect(select.options[0].value).toBe('en');
      expect(select.options[1].value).toBe('es');
    });

    it('should mark current locale as selected', async () => {
      document.body.innerHTML = `
        <div data-legal-locale-selector></div>
        <div data-legal="privacy" data-version="latest" data-locale="es"></div>
      `;
      global.fetch = mockFetch('<h1>Política</h1>');

      loadScript();
      await flushPromises();

      const select = document.querySelector('select') as HTMLSelectElement;
      expect(select.value).toBe('es');
    });

    it('should have locale-select class and aria-label', async () => {
      document.body.innerHTML = `
        <div data-legal-locale-selector></div>
        <div data-legal="privacy" data-version="latest"></div>
      `;
      global.fetch = mockFetch('<h1>Privacy</h1>');

      loadScript();
      await flushPromises();

      const select = document.querySelector('select') as HTMLSelectElement;
      expect(select.className).toBe('locale-select');
      expect(select.getAttribute('aria-label')).toBe('Select language');
    });

    it('should not crash if no selector element exists', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = mockFetch('<h1>Privacy</h1>');

      loadScript();
      await flushPromises();

      // Should just work without errors
      expect(document.querySelector('[data-legal]')!.querySelector('h1')).not.toBeNull();
    });
  });

  // ── setLocale ────────────────────────────────────────────────────

  describe('setLocale', () => {
    it('should fetch new content when locale changes', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest" data-locale="en"></div>';
      const fetchMock = mockFetch('<h1>Privacy</h1>');
      global.fetch = fetchMock;

      loadScript();
      await flushPromises();

      fetchMock.mockClear();
      fetchMock.mockResolvedValue({ ok: true, text: () => Promise.resolve('<h1>Política</h1>') });

      (window as any).DocLegal.setLocale('es');
      await flushPromises();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain('/es.html');
    });

    it('should not re-fetch if locale is the same', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest" data-locale="en"></div>';
      const fetchMock = mockFetch('<h1>Privacy</h1>');
      global.fetch = fetchMock;

      loadScript();
      await flushPromises();

      fetchMock.mockClear();
      (window as any).DocLegal.setLocale('en');

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should warn if locale is not available', async () => {
      document.body.innerHTML = '<div data-legal="privacy" data-version="latest"></div>';
      global.fetch = mockFetch('<h1>Privacy</h1>');
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      loadScript();
      await flushPromises();

      (window as any).DocLegal.setLocale('fr');
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('not available'));
    });

    it('should update the locale selector after switching', async () => {
      document.body.innerHTML = `
        <div data-legal-locale-selector></div>
        <div data-legal="privacy" data-version="latest" data-locale="en"></div>
      `;
      const fetchMock = mockFetch('<h1>Privacy</h1>');
      global.fetch = fetchMock;

      loadScript();
      await flushPromises();

      fetchMock.mockClear();
      fetchMock.mockResolvedValue({ ok: true, text: () => Promise.resolve('<h1>Política</h1>') });

      (window as any).DocLegal.setLocale('es');
      await flushPromises();

      const select = document.querySelector('select') as HTMLSelectElement;
      expect(select.value).toBe('es');
    });
  });
});

// ── Content file integrity ─────────────────────────────────────────

describe('HTML content files', () => {
  const expectedFiles = [
    'cookies/latest/en.html',
    'cookies/latest/es.html',
    'privacy/latest/en.html',
    'privacy/latest/es.html',
    'privacy/v1/en.html',
    'privacy/v1/en-apple.html',
    'privacy/v1/es.html',
    'terms/latest/en.html',
    'terms/latest/es.html',
    'terms/v1/en.html',
    'terms/v1/en-apple.html',
  ];

  it.each(expectedFiles)('should have content file: %s', (file) => {
    const filePath = path.join(CONTENT_DIR, file);
    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, 'utf8');
    expect(content.length).toBeGreaterThan(100);
  });

  it.each(expectedFiles)('should have <h1> in %s', (file) => {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    expect(content).toContain('<h1>');
  });

  it('should not contain old-style links (data-legal-version or /legal/ paths)', () => {
    for (const file of expectedFiles) {
      const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
      expect(content).not.toMatch(/data-legal-version/);
      expect(content).not.toMatch(/href="\/legal\//);
      expect(content).not.toMatch(/href="\?version=/);
    }
  });

  it('should use #legal/ hash links for internal navigation', () => {
    const latest = ['terms/latest/en.html', 'privacy/latest/en.html'];
    for (const file of latest) {
      const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
      expect(content).toMatch(/#legal\/\w+\?version=v1/);
    }

    const v1 = ['terms/v1/en.html', 'privacy/v1/en.html'];
    for (const file of v1) {
      const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
      expect(content).toMatch(/#legal\/\w+\?version=latest/);
    }
  });
});

// ── Legal page HTML files ──────────────────────────────────────────

describe('legal page HTML files', () => {
  const pages = [
    { path: 'pages/legal/terms/index.html', doc: 'terms' },
    { path: 'pages/legal/privacy/index.html', doc: 'privacy' },
    { path: 'pages/legal/cookies/index.html', doc: 'cookies' },
  ];

  it.each(pages)('$doc page should reference legal.js', ({ path: p }) => {
    const filePath = path.resolve(__dirname, '..', p);
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain('src="/legal/legal.js"');
    expect(content).not.toContain('main.ts');
    expect(content).not.toContain('type="module"');
  });

  it.each(pages)('$doc page should reference legal.css', ({ path: p }) => {
    const filePath = path.resolve(__dirname, '..', p);
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain('href="/legal/legal.css"');
  });

  it.each(pages)('$doc page should have data-legal="$doc"', ({ path: p, doc }) => {
    const filePath = path.resolve(__dirname, '..', p);
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain(`data-legal="${doc}"`);
  });

  it.each(pages)('$doc page should have locale selector div', ({ path: p }) => {
    const filePath = path.resolve(__dirname, '..', p);
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain('data-legal-locale-selector');
  });
});

// ── Firebase config ────────────────────────────────────────────────

describe('firebase.json', () => {
  const config = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../firebase.json'), 'utf8'),
  );
  const headers = config.hosting.headers;

  it('should have CORS header for /legal/content/**', () => {
    const rule = headers.find((h: any) => h.source === '/legal/content/**');
    expect(rule).toBeDefined();
    const cors = rule.headers.find((h: any) => h.key === 'Access-Control-Allow-Origin');
    expect(cors).toBeDefined();
    expect(cors.value).toBe('*');
  });

  it('should have CORS header for /legal/legal.js', () => {
    const rule = headers.find((h: any) => h.source === '/legal/legal.js');
    expect(rule).toBeDefined();
    const cors = rule.headers.find((h: any) => h.key === 'Access-Control-Allow-Origin');
    expect(cors).toBeDefined();
    expect(cors.value).toBe('*');
  });

  it('should have short cache for legal.js (not immutable)', () => {
    const rule = headers.find((h: any) => h.source === '/legal/legal.js');
    const cache = rule.headers.find((h: any) => h.key === 'Cache-Control');
    expect(cache.value).not.toContain('immutable');
    expect(cache.value).toContain('max-age=3600');
  });

  it('should have no-cache for content files', () => {
    const rule = headers.find((h: any) => h.source === '/legal/content/**');
    const cache = rule.headers.find((h: any) => h.key === 'Cache-Control');
    expect(cache.value).toContain('no-cache');
  });
});
