import { buildTargetUrl, normalizeMessage } from '../src/widget/tab-opener';
import type { WidgetConfig } from '../src/widget/config';

const base: WidgetConfig = { targetUrl: 'https://app.doctorina.com' };

describe('normalizeMessage', () => {
  it('trims and collapses internal whitespace', () => {
    expect(normalizeMessage('  hello   world \n there ')).toBe('hello world there');
  });

  it('returns an empty string for whitespace-only input', () => {
    expect(normalizeMessage('   \n\t ')).toBe('');
  });
});

describe('buildTargetUrl', () => {
  it('targets the configured app and always sets auto_accept_policies + referrer', () => {
    const url = new URL(buildTargetUrl(base));
    expect(url.origin).toBe('https://app.doctorina.com');
    expect(url.searchParams.get('auto_accept_policies')).toBe('1');
    expect(url.searchParams.get('referrer')).toBe(window.location.href);
  });

  it('adds the default utm_medium=user_message', () => {
    const url = new URL(buildTargetUrl(base));
    expect(url.searchParams.get('utm_medium')).toBe('user_message');
  });

  it('merges custom params and lets them override the default utm_medium', () => {
    const url = new URL(buildTargetUrl({ ...base, params: { utm_medium: 'campaign', utm_source: 'landing' } }));
    expect(url.searchParams.get('utm_medium')).toBe('campaign');
    expect(url.searchParams.get('utm_source')).toBe('landing');
  });

  it('omits the hash when no message is given', () => {
    expect(new URL(buildTargetUrl(base)).hash).toBe('');
  });

  it('carries the message in the URL hash, round-trip safe (unicode + special chars)', () => {
    const message = 'у меня болит голова & горло';
    const url = new URL(buildTargetUrl(base, message));
    expect(url.hash.length).toBeGreaterThan(1);
    expect(decodeURIComponent(url.hash.slice(1))).toBe(message);
  });

  it('respects a custom target URL (e.g. the staging web app)', () => {
    const url = new URL(buildTargetUrl({ ...base, targetUrl: 'https://doctorina-development.web.app' }));
    expect(url.origin).toBe('https://doctorina-development.web.app');
  });
});
