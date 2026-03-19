# Legal Document Embed Script

A lightweight script that loads Doctorina legal documents (Terms, Privacy Policy, Cookies Policy) into any webpage. Works on both same-origin pages and third-party sites.

## Quick Start

Add two lines to your HTML:

```html
<div data-legal="privacy"></div>
<script async src="https://pages.doctorina.com/legal/legal.js"></script>
```

That's it. The script auto-initializes, detects the user's language, and loads the document.

## Available Documents

| Document       | `data-legal` value |
| -------------- | ------------------ |
| Terms of Use   | `terms`            |
| Privacy Policy | `privacy`          |
| Cookies Policy | `cookies`          |

## Configuration

All configuration is done through `data-` attributes on the target element:

```html
<div
  data-legal="privacy"
  data-version="latest"
  data-locale="es"
  data-variant="apple"
></div>
```

| Attribute      | Description                                                   | Default       |
| -------------- | ------------------------------------------------------------- | ------------- |
| `data-legal`   | **Required.** Document type: `terms`, `privacy`, or `cookies` | —             |
| `data-version` | Document version: `latest`, `v1`, etc.                        | `latest`      |
| `data-locale`  | Language code: `en`, `es`, etc.                               | Auto-detected |
| `data-variant` | Platform variant (e.g. `apple`)                               | Auto-detected |

## Language Selection

### Automatic Detection

The script picks the locale using this priority (first match wins):

1. Programmatic override via `DocLegal.init({ locale: 'es' })`
2. URL parameter: `?locale=es`, `?lang=es`, or `?l=es`
3. `data-locale` attribute on the element
4. Browser language (`navigator.languages`)
5. Fallback: `en`

If the detected language isn't available for the document/version, it falls back to English.

### Language Selector Dropdown

Add an optional element to get an auto-populated language dropdown:

```html
<div data-legal-locale-selector></div>
<div data-legal="privacy"></div>
<script async src="https://pages.doctorina.com/legal/legal.js"></script>
```

The script creates a `<select>` element inside `[data-legal-locale-selector]` with all available languages for the current document and version. Changing the dropdown automatically switches the content.

The `<select>` has `class="locale-select"` and `aria-label="Select language"`, so you can style it however you like.

## URL Parameters

The page URL can override settings (useful for links from apps):

| Parameter                      | Example          | Effect                         |
| ------------------------------ | ---------------- | ------------------------------ |
| `locale`, `lang`, `l`          | `?locale=es`     | Set language                   |
| `version`, `v`                 | `?version=v1`    | Set document version           |
| `variant`                      | `?variant=apple` | Set platform variant           |
| `apple`, `isApple`, `is_apple` | `?apple=true`    | Shorthand for `?variant=apple` |

## Apple Variant

On Apple devices (iPhone, iPad, Mac), the script automatically applies the `apple` variant. This can show/hide platform-specific content like App Store terms.

The variant can also be set explicitly via `data-variant="apple"` or `?variant=apple`.

## Internal Links

All links between legal documents use hash-based routing:

```html
<a href="#legal/privacy">Privacy Policy</a>
<a href="#legal/terms?version=v1">Terms v1</a>
<a href="#legal/cookies?variant=apple">Cookies (Apple)</a>
```

The script intercepts these clicks and loads the target document inline without a page reload. External links (`https://...`, `mailto:`, etc.) work normally.

## Content Variants (Include/Exclude)

HTML content files can conditionally show/hide sections based on the active variant:

```html
<!-- Removed when variant is "apple" -->
<p data-exclude="apple">Available on Google Play.</p>

<!-- Only shown when variant is "apple" -->
<p data-include="apple">Available on the App Store.</p>

<!-- Multiple variants -->
<p data-exclude="apple,google">Desktop only content.</p>
```

## Programmatic API

The script exposes a global `DocLegal` object:

```js
// Initialize with options (auto-init happens by default)
DocLegal.init({
  locale: "es",
  variant: "apple",
  baseUrl: "https://custom-domain.com", // optional override
});

// Switch language at runtime
DocLegal.setLocale("en");
```

## Loading Behavior

- On initial load (empty container), a spinner is shown while content is fetched.
- When switching language or version, the current content stays visible until the new content is ready — no flickering.
- On fetch failure, a fallback message is displayed.

## Cross-Origin Embedding

The script auto-detects its own origin. When loaded from a different domain, it automatically fetches content from the domain where the script is hosted. No manual `baseUrl` configuration needed.

### CSP Requirements

If your page uses a strict Content Security Policy, add these directives:

```
script-src https://pages.doctorina.com;
connect-src https://pages.doctorina.com;
style-src 'unsafe-inline';
```

## Full Example

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Legal</title>
    <style>
      .legal-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .locale-select {
        padding: 6px 12px;
        margin-bottom: 16px;
      }
    </style>
  </head>
  <body>
    <div class="legal-container">
      <div data-legal-locale-selector></div>
      <div data-legal="privacy" data-version="latest"></div>
    </div>
    <script async src="https://pages.doctorina.com/legal/legal.js"></script>
  </body>
</html>
```
