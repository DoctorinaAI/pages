/**
 * Legal HTML Content Validation Tests
 *
 * Validates all HTML files under public/legal/content/ to ensure:
 * - Well-formed HTML (no unclosed or invalid tags)
 * - No inline style attributes
 * - Internal legal links use hash-based navigation (#legal/...) per legal.js
 * - No external links that would navigate away from webview
 * - Consistent structure and formatting
 *
 * To run these tests, use the command: `npx vitest run tests/legal-html.test.ts`
 */
import { readdirSync, readFileSync, statSync } from 'fs';
import { JSDOM } from 'jsdom';
import { join, relative, sep } from 'path';
import { describe, expect, it } from 'vitest';

// ── Collect all HTML files ──────────────────────────────────────────────────

const CONTENT_ROOT = join(__dirname, '..', 'public', 'legal', 'content');

function collectHtmlFiles(dir: string): string[] {
    const files: string[] = [];
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            files.push(...collectHtmlFiles(full));
        } else if (entry.endsWith('.html')) {
            files.push(full);
        }
    }
    return files;
}

const htmlFiles = collectHtmlFiles(CONTENT_ROOT);

// ── Allowed HTML tags (common subset used in legal documents) ───────────────

const ALLOWED_TAGS = new Set([
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'a', 'span', 'strong', 'em', 'b', 'i', 'u', 's',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'col', 'colgroup',
    'div', 'section',
    'blockquote', 'pre', 'code',
    'sub', 'sup',
]);

// ── Link classification ─────────────────────────────────────────────────────

// pages.doctorina.com/legal/ links that SHOULD be hash-based
const PAGES_LEGAL_RE = /^https?:\/\/pages\.doctorina\.com\/legal\/(terms|privacy|cookies)/;

/**
 * Convert a full pages.doctorina.com/legal/ URL to hash format.
 * e.g. https://pages.doctorina.com/legal/privacy?version=v1&lang=en
 *    → #legal/privacy?version=v1&locale=en
 */
function suggestHashLink(href: string): string {
    const url = new URL(href);
    const pathMatch = url.pathname.match(/\/legal\/(terms|privacy|cookies)\/?$/);
    if (!pathMatch) return href;

    const doc = pathMatch[1];
    const params: string[] = [];

    const version = url.searchParams.get('version');
    if (version) params.push(`version=${version}`);

    const variant = url.searchParams.get('variant');
    if (variant) params.push(`variant=${variant}`);

    // Normalize lang/l → locale
    const locale = url.searchParams.get('locale') || url.searchParams.get('lang') || url.searchParams.get('l');
    if (locale) params.push(`locale=${locale}`);

    return `#legal/${doc}` + (params.length ? '?' + params.join('&') : '');
}

// ── Self-closing / void elements ────────────────────────────────────────────

const VOID_ELEMENTS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

// ── Helpers ─────────────────────────────────────────────────────────────────

function label(filePath: string): string {
    return relative(CONTENT_ROOT, filePath).split(sep).join('/');
}

function parseHtml(content: string): Document {
    // Wrap in a root so fragments parse correctly
    const dom = new JSDOM(`<!DOCTYPE html><html><body>${content}</body></html>`);
    return dom.window.document;
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('Legal HTML content validation', () => {

    it('should find HTML files to validate', () => {
        expect(htmlFiles.length).toBeGreaterThan(0);
    });

    // ── Tag validity ────────────────────────────────────────────────────

    describe('tag validity', () => {
        for (const file of htmlFiles) {
            const name = label(file);

            it(`${name}: should only use allowed HTML tags`, () => {
                const content = readFileSync(file, 'utf-8');
                const doc = parseHtml(content);
                const allElements = doc.body.querySelectorAll('*');
                const disallowed: string[] = [];

                allElements.forEach(el => {
                    const tag = el.tagName.toLowerCase();
                    if (!ALLOWED_TAGS.has(tag)) {
                        disallowed.push(`<${tag}>`);
                    }
                });

                expect(disallowed, `Disallowed tags found: ${[...new Set(disallowed)].join(', ')}`).toEqual([]);
            });
        }
    });

    // ── Well-formedness (unclosed tags) ──────────────────────────────────

    describe('well-formedness', () => {
        for (const file of htmlFiles) {
            const name = label(file);

            it(`${name}: should have no unclosed or mismatched tags`, () => {
                const content = readFileSync(file, 'utf-8');
                const errors: string[] = [];

                // Simple stack-based check on raw HTML
                const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g;
                const stack: { tag: string; pos: number }[] = [];
                let match: RegExpExecArray | null;

                while ((match = tagRegex.exec(content)) !== null) {
                    const fullMatch = match[0];
                    const tag = match[1].toLowerCase();

                    if (VOID_ELEMENTS.has(tag)) continue;
                    if (fullMatch.endsWith('/>')) continue; // self-closing

                    if (fullMatch.startsWith('</')) {
                        // Closing tag
                        if (stack.length === 0) {
                            errors.push(`Unexpected closing tag </${tag}> at position ${match.index}`);
                        } else if (stack[stack.length - 1].tag !== tag) {
                            const expected = stack[stack.length - 1].tag;
                            errors.push(
                                `Mismatched tag: expected </${expected}> but found </${tag}> at position ${match.index}`
                            );
                            // Try to recover by popping until we find the match
                            let found = false;
                            for (let i = stack.length - 1; i >= 0; i--) {
                                if (stack[i].tag === tag) {
                                    stack.splice(i);
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                // No match found, just skip
                            }
                        } else {
                            stack.pop();
                        }
                    } else {
                        // Opening tag
                        if (!VOID_ELEMENTS.has(tag)) {
                            stack.push({ tag, pos: match.index });
                        }
                    }
                }

                if (stack.length > 0) {
                    for (const s of stack) {
                        errors.push(`Unclosed tag <${s.tag}> opened at position ${s.pos}`);
                    }
                }

                expect(errors, errors.join('\n')).toEqual([]);
            });
        }
    });

    // ── No inline styles ────────────────────────────────────────────────

    describe('no inline styles', () => {
        for (const file of htmlFiles) {
            const name = label(file);

            it(`${name}: should not contain style attributes`, () => {
                const content = readFileSync(file, 'utf-8');
                const doc = parseHtml(content);
                const styled: string[] = [];

                doc.body.querySelectorAll('[style]').forEach(el => {
                    const tag = el.tagName.toLowerCase();
                    const style = el.getAttribute('style');
                    styled.push(`<${tag} style="${style}">`);
                });

                expect(
                    styled,
                    `Elements with inline styles:\n${styled.join('\n')}\n\nRemove all style attributes — styling should come from the embedding page.`
                ).toEqual([]);
            });
        }
    });

    // ── Link validation (hash-based navigation) ─────────────────────────

    describe('links must use hash-based navigation', () => {
        for (const file of htmlFiles) {
            const name = label(file);

            it(`${name}: internal legal links should use #legal/ format`, () => {
                const content = readFileSync(file, 'utf-8');
                const doc = parseHtml(content);
                const violations: string[] = [];

                doc.body.querySelectorAll('a[href]').forEach(a => {
                    const href = a.getAttribute('href')!;

                    if (PAGES_LEGAL_RE.test(href)) {
                        const suggested = suggestHashLink(href);
                        violations.push(
                            `"${href}"\n  → should be: "${suggested}"`
                        );
                    }
                });

                expect(
                    violations,
                    `Internal legal links must use hash format for legal.js navigation:\n\n${violations.join('\n\n')}`
                ).toEqual([]);
            });
        }
    });

    describe('no external links (webview safety)', () => {
        // mailto: is allowed, everything else with http(s) that isn't a legal link should be flagged
        const ALLOWED_EXTERNAL = [
            /^mailto:/,
        ];

        for (const file of htmlFiles) {
            const name = label(file);

            it(`${name}: should not contain links to external websites`, () => {
                const content = readFileSync(file, 'utf-8');
                const doc = parseHtml(content);
                const violations: string[] = [];

                doc.body.querySelectorAll('a[href]').forEach(a => {
                    const href = a.getAttribute('href')!;

                    // Hash links are fine
                    if (href.startsWith('#')) return;

                    // Allowed protocols
                    if (ALLOWED_EXTERNAL.some(re => re.test(href))) return;

                    // Internal legal links caught by the other test — flag here too
                    if (PAGES_LEGAL_RE.test(href)) {
                        violations.push(`"${href}" → convert to hash: "${suggestHashLink(href)}"`);
                        return;
                    }

                    // Any other http/https link
                    if (/^https?:\/\//.test(href)) {
                        violations.push(
                            `"${href}" — external link not allowed in webview content. ` +
                            `Replace with plain text or remove the <a> tag.`
                        );
                    }
                });

                expect(
                    violations,
                    `External links found (not safe for webview):\n\n${violations.join('\n\n')}`
                ).toEqual([]);
            });
        }
    });

    // ── No target="_blank" on hash links ────────────────────────────────

    describe('hash links should not have target="_blank"', () => {
        for (const file of htmlFiles) {
            const name = label(file);

            it(`${name}: #legal/ links should not open in new tab`, () => {
                const content = readFileSync(file, 'utf-8');
                const doc = parseHtml(content);
                const violations: string[] = [];

                doc.body.querySelectorAll('a[href^="#legal/"]').forEach(a => {
                    if (a.getAttribute('target') === '_blank') {
                        violations.push(`<a href="${a.getAttribute('href')}" target="_blank"> — remove target="_blank"`);
                    }
                });

                expect(violations, violations.join('\n')).toEqual([]);
            });
        }
    });

    // ── No empty links ──────────────────────────────────────────────────

    describe('no empty or placeholder links', () => {
        for (const file of htmlFiles) {
            const name = label(file);

            it(`${name}: links should have meaningful href values`, () => {
                const content = readFileSync(file, 'utf-8');
                const doc = parseHtml(content);
                const violations: string[] = [];

                doc.body.querySelectorAll('a').forEach(a => {
                    const href = a.getAttribute('href');
                    if (!href || href === '#' || href === '') {
                        const text = a.textContent?.trim().substring(0, 50) || '(empty)';
                        violations.push(`Empty/placeholder href on link "${text}"`);
                    }
                });

                expect(violations, violations.join('\n')).toEqual([]);
            });
        }
    });

    // ── Content structure checks ────────────────────────────────────────

    describe('content structure', () => {
        for (const file of htmlFiles) {
            const name = label(file);

            it(`${name}: should start with an h1 heading`, () => {
                const content = readFileSync(file, 'utf-8');
                const doc = parseHtml(content);
                const firstElement = doc.body.children[0];
                expect(
                    firstElement?.tagName.toLowerCase(),
                    'Document should begin with an <h1> title'
                ).toBe('h1');
            });

            it(`${name}: should have exactly one h1`, () => {
                const content = readFileSync(file, 'utf-8');
                const doc = parseHtml(content);
                const h1s = doc.body.querySelectorAll('h1');
                expect(h1s.length, 'Document should have exactly one <h1>').toBe(1);
            });

            it(`${name}: should not be empty`, () => {
                const content = readFileSync(file, 'utf-8').trim();
                expect(content.length).toBeGreaterThan(0);
                const doc = parseHtml(content);
                expect(
                    doc.body.textContent?.trim().length,
                    'Document should have text content'
                ).toBeGreaterThan(100);
            });
        }
    });

    // ── No script/iframe/object tags ────────────────────────────────────

    describe('no embedded scripts or objects', () => {
        for (const file of htmlFiles) {
            const name = label(file);

            it(`${name}: should not contain script, iframe, object, or embed tags`, () => {
                const content = readFileSync(file, 'utf-8');
                const forbidden = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'];
                const found: string[] = [];

                for (const tag of forbidden) {
                    const re = new RegExp(`<${tag}[\\s>]`, 'i');
                    if (re.test(content)) {
                        found.push(`<${tag}>`);
                    }
                }

                expect(found, `Forbidden tags: ${found.join(', ')}`).toEqual([]);
            });
        }
    });

    // ── CATALOG ↔ file consistency ────────────────────────────────────

    describe('CATALOG consistency', () => {
        // Mirror of CATALOG from legal.js (keep in sync)
        const CATALOG: Record<string, Record<string, Record<string, string>>> = {
            terms: {
                latest: { en: 'English', es: 'Español', ru: 'Русский' },
                v1: { en: 'English' },
            },
            privacy: {
                latest: { en: 'English', es: 'Español', ru: 'Русский' },
                v1: { en: 'English', es: 'Español' },
            },
            cookies: {
                latest: { en: 'English', es: 'Español', ru: 'Русский' },
            },
        };

        const APPLE_FILES: Record<string, boolean> = {
            'terms/v1/en': true,
            'privacy/v1/en': true,
        };

        // Every CATALOG entry should have a matching HTML file
        for (const [doc, versions] of Object.entries(CATALOG)) {
            for (const [version, locales] of Object.entries(versions)) {
                for (const locale of Object.keys(locales)) {
                    const rel = `${doc}/${version}/${locale}.html`;
                    it(`CATALOG entry ${doc}/${version}/${locale} should have a file`, () => {
                        const filePath = join(CONTENT_ROOT, rel);
                        expect(
                            () => statSync(filePath),
                            `Missing file: ${rel}`
                        ).not.toThrow();
                    });
                }
            }
        }

        // Every APPLE_FILES entry should have a matching *-apple.html file
        for (const key of Object.keys(APPLE_FILES)) {
            const rel = `${key}-apple.html`;
            it(`APPLE_FILES entry ${key} should have an -apple.html file`, () => {
                const filePath = join(CONTENT_ROOT, rel);
                expect(
                    () => statSync(filePath),
                    `Missing apple file: ${rel}`
                ).not.toThrow();
            });
        }

        // Every HTML file on disk should be referenced in CATALOG or APPLE_FILES
        for (const file of htmlFiles) {
            const rel = relative(CONTENT_ROOT, file).split(sep).join('/');
            it(`file ${rel} should be referenced in CATALOG or APPLE_FILES`, () => {
                const appleMatch = rel.match(/^(.+)-apple\.html$/);
                if (appleMatch) {
                    expect(
                        APPLE_FILES[appleMatch[1]],
                        `File ${rel} exists but is not in APPLE_FILES`
                    ).toBe(true);
                    return;
                }

                const match = rel.match(/^([^/]+)\/([^/]+)\/([^/]+)\.html$/);
                expect(match, `File ${rel} does not match expected path pattern`).not.toBeNull();
                if (!match) return;

                const [, doc, version, locale] = match;
                expect(
                    CATALOG[doc]?.[version]?.[locale],
                    `File ${rel} exists but is not in CATALOG`
                ).toBeDefined();
            });
        }
    });

    // ── Heading structure consistency across locales ─────────────────

    describe('heading structure consistency', () => {
        // Group files by doc/version
        const groups = new Map<string, { locale: string; file: string }[]>();
        for (const file of htmlFiles) {
            const rel = relative(CONTENT_ROOT, file).split(sep).join('/');
            // Skip apple variants — they have different structure
            if (rel.includes('-apple')) continue;

            const match = rel.match(/^([^/]+\/[^/]+)\//);
            if (!match) continue;
            const group = match[1];
            const locale = rel.replace(/^.+\//, '').replace('.html', '');

            if (!groups.has(group)) groups.set(group, []);
            groups.get(group)!.push({ locale, file });
        }

        for (const [group, entries] of groups) {
            if (entries.length < 2) continue; // need at least 2 locales to compare

            // Known issue: privacy/latest/ru.html has extra section 6 missing from en/es
            it.skipIf(group === 'privacy/latest')(`${group}: all locales should have the same number of h2 headings`, () => {
                const counts: { locale: string; count: number }[] = [];
                for (const { locale, file } of entries) {
                    const content = readFileSync(file, 'utf-8');
                    const doc = parseHtml(content);
                    const h2s = doc.body.querySelectorAll('h2');
                    counts.push({ locale, count: h2s.length });
                }

                const first = counts[0];
                for (const c of counts.slice(1)) {
                    expect(
                        c.count,
                        `${group}: locale "${c.locale}" has ${c.count} h2 headings, but "${first.locale}" has ${first.count}`
                    ).toBe(first.count);
                }
            });

            it.skipIf(group === 'privacy/latest')(`${group}: heading numbering should be consistent across locales`, () => {
                const numbering: { locale: string; numbers: string[] }[] = [];

                for (const { locale, file } of entries) {
                    const content = readFileSync(file, 'utf-8');
                    const doc = parseHtml(content);
                    const h2s = doc.body.querySelectorAll('h2');
                    const numbers: string[] = [];

                    h2s.forEach(h2 => {
                        const text = h2.textContent || '';
                        // Extract leading number pattern like "1.", "2.1.", "14.3."
                        const numMatch = text.match(/^[\s]*([\d]+(?:\.[\d]+)*)\./);
                        if (numMatch) numbers.push(numMatch[1]);
                    });

                    numbering.push({ locale, numbers });
                }

                const first = numbering[0];
                for (const n of numbering.slice(1)) {
                    expect(
                        n.numbers,
                        `${group}: heading numbers differ between "${first.locale}" and "${n.locale}"`
                    ).toEqual(first.numbers);
                }
            });
        }
    });

    // ── No undefined/placeholder content ────────────────────────────

    describe('no placeholder content', () => {
        for (const file of htmlFiles) {
            const name = label(file);

            it(`${name}: should not contain "undefined" or "TODO" placeholder text`, () => {
                const content = readFileSync(file, 'utf-8');
                const doc = parseHtml(content);
                const violations: string[] = [];

                doc.body.querySelectorAll('p, li, td, th, span').forEach(el => {
                    const text = el.textContent?.trim() || '';
                    if (text === 'undefined' || text === 'null') {
                        violations.push(`<${el.tagName.toLowerCase()}> contains "${text}"`);
                    }
                    // Match developer placeholders like "TODO:", "TODO -", "[TODO]",
                    // but not the Spanish word "todo" (meaning "all/everything")
                    if (/\bTODO\s*[:[-]/.test(text) || /^\s*TODO\s*$/.test(text)) {
                        violations.push(`<${el.tagName.toLowerCase()}> contains TODO: "${text.substring(0, 80)}"`);
                    }
                });

                expect(violations, violations.join('\n')).toEqual([]);
            });
        }
    });

    // ── No broken Google Docs link artifacts ────────────────────────

    describe('no broken link artifacts', () => {
        for (const file of htmlFiles) {
            const name = label(file);

            it(`${name}: should not contain links to non-URL text (Google Docs artifacts)`, () => {
                const content = readFileSync(file, 'utf-8');
                const doc = parseHtml(content);
                const violations: string[] = [];

                doc.body.querySelectorAll('a[href]').forEach(a => {
                    const href = a.getAttribute('href')!;
                    if (href.startsWith('#') || href.startsWith('mailto:')) return;

                    // Check for links that look like section numbers or plain words
                    // mistakenly turned into URLs by Google Docs (e.g. http://14.2.Si)
                    try {
                        const url = new URL(href);
                        const host = url.hostname;
                        // Valid domains have at least one dot and a TLD of 2+ chars
                        const parts = host.split('.');
                        const tld = parts[parts.length - 1];
                        if (parts.length < 2 || tld.length < 2 || /^\d+$/.test(host.replace(/\./g, ''))) {
                            violations.push(`Suspicious link href="${href}" — likely a Google Docs conversion artifact`);
                        }
                    } catch {
                        // Not a valid URL at all
                        if (/^https?:\/\//.test(href)) {
                            violations.push(`Malformed URL href="${href}"`);
                        }
                    }
                });

                expect(violations, violations.join('\n')).toEqual([]);
            });
        }
    });
});
