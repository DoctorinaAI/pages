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

// Pattern from legal.js: #legal/{doc}?params
const HASH_LEGAL_RE = /^#legal\/(terms|privacy|cookies)/;

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
});
