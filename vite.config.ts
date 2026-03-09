import { existsSync, readdirSync, copyFileSync, unlinkSync, rmdirSync, mkdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, ViteDevServer, Plugin } from 'vite';

/**
 * Automatically discover all HTML pages in the pages/ directory (supports nesting).
 * Returns an object like:
 *   { index: '/pages/index/index.html', 'legal/terms': '/pages/legal/terms/index.html' }
 */
function discoverPages(): Record<string, string> {
  const pagesDir = resolve(__dirname, 'pages');
  const pages: Record<string, string> = {};

  if (!existsSync(pagesDir)) {
    console.warn('Pages directory not found. No pages will be built.');
    return pages;
  }

  function scan(dir: string, prefix: string = ''): void {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const key = prefix ? `${prefix}/${entry.name}` : entry.name;
      const htmlPath = resolve(dir, entry.name, 'index.html');

      if (existsSync(htmlPath)) {
        pages[key] = htmlPath;
        console.log(`📄 Found page: ${key} -> ${htmlPath}`);
      }

      // Recurse into subdirectories
      scan(resolve(dir, entry.name), key);
    }
  }

  scan(pagesDir);
  return pages;
}

export default defineConfig(({ mode }) => {
  const pages = discoverPages();

  return {
    plugins: [
      // Analyze bundle size if ANALYZE env var is set
      mode === 'production' && process.env.ANALYZE
        ? visualizer({
            open: true,
            filename: 'dist/stats.html',
            gzipSize: true,
            brotliSize: true,
          })
        : undefined,
      // Custom plugin to handle short URLs (supports nested paths like /legal/terms)
      {
        name: 'rewrite-page-urls',
        configureServer(server: ViteDevServer) {
          server.middlewares.use((req: any, res: any, next: any) => {
            const url = req.url || '';

            // Match patterns like /pagename, /group/pagename, or *.html (with optional query params)
            const cleanMatch = url.match(/^\/([a-zA-Z0-9-]+(?:\/[a-zA-Z0-9-]+)*)(\/?(\?.*)?)?$/);
            const htmlMatch = url.match(/^\/([a-zA-Z0-9-/]+)\.html(\?.*)?$/);

            const match = cleanMatch || htmlMatch;
            if (match) {
              const pageName = match[1];
              const queryString = match[2] || match[3] || '';
              const fullPath = resolve(__dirname, 'pages', pageName, 'index.html');
              if (existsSync(fullPath)) {
                req.url = `/pages/${pageName}/index.html${queryString}`;
              }
            }

            next();
          });
        },
      },
    ].filter(Boolean),

    server: {
      port: 3000,
      host: true,
      open: '/pages/index/index.html', // Open index page by default
      proxy: {
        '/api': {
          target: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },

    build: {
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      rollupOptions: {
        input: pages,
        output: {
          // Generate cleaner output structure
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        // Custom plugin to flatten HTML files in output (supports nested pages)
        plugins: [
          {
            name: 'flatten-html-pages',
            writeBundle(options) {
              const outDir = options.dir || 'dist';

              // Move HTML files from pages/*/index.html to *.html
              for (const [pageName] of Object.entries(pages)) {
                const oldPath = join(outDir, 'pages', pageName, 'index.html');
                const newPath = join(outDir, `${pageName}.html`);

                if (existsSync(oldPath)) {
                  // Ensure target directory exists for nested pages (e.g., legal/terms.html)
                  mkdirSync(dirname(newPath), { recursive: true });

                  copyFileSync(oldPath, newPath);
                  unlinkSync(oldPath);
                  console.log(`📄 Moved: pages/${pageName}/index.html -> ${pageName}.html`);

                  // Try to remove empty directories up the tree
                  let dir = join(outDir, 'pages', pageName);
                  while (dir !== join(outDir, 'pages') && dir.startsWith(join(outDir, 'pages'))) {
                    try {
                      rmdirSync(dir);
                    } catch (e) {
                      break; // Directory not empty, stop
                    }
                    dir = dirname(dir);
                  }
                }
              }

              // Try to remove empty pages directory
              try {
                rmdirSync(join(outDir, 'pages'));
                console.log(`🗑️  Removed empty pages directory`);
              } catch (e) {
                // Directory not empty or doesn't exist, ignore
              }
            },
          },
        ],
      },
    },

    resolve: {
      alias: {
        '~': resolve(__dirname, 'src'),
      },
    },
  };
});
