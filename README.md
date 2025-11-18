# [Doctorina Pages](https://pages.doctorina.com)

Multiple independent lightweight HTML pages for the Doctorina organization, deployed on a single domain.

## 📁 Project Structure

```
pages/
├── pages/                  # Directory with all pages
│   ├── index/             # Main page (home)
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── style.css
│   ├── tools/             # Utilities page
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── style.css
│   └── ...                # Other pages
├── src/
│   └── shared/            # Shared code for all pages
│       ├── utils/         # Utilities (clipboard, validation, etc.)
│       └── styles/        # Shared styles
├── public/                # Static files
├── vite.config.ts         # Vite configuration (auto-discovery of pages)
└── package.json
```

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Development

Start dev server (opens main page):

```bash
npm run dev
```

Open specific page:

```bash
npm run dev:index     # Main page
npm run dev:tools     # Tools page
```

Or open in browser:
- `http://localhost:3000/pages/index/index.html`
- `http://localhost:3000/pages/tools/index.html`

### Build

```bash
npm run build              # Build all pages
npm run build:analyze      # Build with bundle size analysis
npm run preview            # Preview built project
```

### Code Checking

```bash
npm run type-check         # TypeScript type checking
npm run lint               # Lint code
npm run lint:fix           # Auto-fix with linter
```

### Deploy

```bash
npm run deploy             # Build and deploy to Firebase
npm run deploy:preview     # Deploy to preview channel
npm run firebase:serve     # Local Firebase hosting test
```

## ➕ Adding a New Page

1. **Create a new directory** in the `pages/` folder:

```bash
mkdir pages/my-new-page
```

2. **Create page files**:

```
pages/my-new-page/
├── index.html      # HTML template
├── main.ts         # TypeScript code
└── style.css       # Styles (optional)
```

3. **index.html** - minimal template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="My New Page - Doctorina">
    <meta name="theme-color" content="#667eea">
    <title>My New Page - Doctorina</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
<body>
    <div id="app"></div>
    <script type="module" src="/pages/my-new-page/main.ts"></script>
</body>
</html>
```

4. **main.ts** - page code:

```typescript
import { initPage } from '~/shared/utils/page-init';
import './style.css';

initPage('My New Page - Doctorina');

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <div class="container">
      <h1>My New Page</h1>
      <p>Welcome to my new page!</p>
    </div>
  `;
}
```

5. **Add npm script** (optional) to `package.json`:

```json
"dev:my-new-page": "vite --open /pages/my-new-page/index.html"
```

6. **Done!** Vite will automatically discover your page during build.

## 🔧 Using Shared Utilities

Ready-to-use utilities are available in `src/shared/utils/`:

```typescript
import { initPage } from '~/shared/utils/page-init';
import { copyToClipboard } from '~/shared/utils/clipboard';
import { formatDate, getRelativeTime } from '~/shared/utils/date';
import { isValidEmail, isValidUrl } from '~/shared/utils/validation';

// Initialize page
initPage('Page Title');

// Clipboard operations
await copyToClipboard('Text to copy');

// Date formatting
const formatted = formatDate(new Date());
const relative = getRelativeTime(new Date());

// Validation
if (isValidEmail(email)) { /* ... */ }
if (isValidUrl(url)) { /* ... */ }
```

## 🎨 Shared Styles

Import shared CSS variables and utilities:

```typescript
import '~/shared/styles/common.css';
```

Available CSS variables:

```css
var(--primary-color)      /* #667eea */
var(--success-color)      /* #28a745 */
var(--shadow-lg)          /* 0 10px 40px rgba(0,0,0,0.2) */
var(--radius-md)          /* 8px */
/* and others... */
```

## 📦 Build Structure

After `npm run build`, the `dist/` directory will have the following structure:

```
dist/
├── index.html              # Main page
├── tools.html              # Tools page
├── assets/                 # JS, CSS, and other assets
└── ...
```

Each page is built independently with minimal dependencies.

## 🔥 Firebase Hosting

Configuration for deploying to `pages.doctorina.com`.

Initial setup:

```bash
npm run firebase:login
npm run firebase:init
```

Deploy:

```bash
npm run deploy
```
