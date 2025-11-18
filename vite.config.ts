import { existsSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, ViteDevServer } from 'vite';

/**
 * Automatically discover all HTML pages in the pages/ directory
 * Returns an object like: { index: '/pages/index/index.html', links: '/pages/links/index.html' }
 */
function discoverPages(): Record<string, string> {
  const pagesDir = resolve(__dirname, 'pages');
  const pages: Record<string, string> = {};

  if (!existsSync(pagesDir)) {
    console.warn('Pages directory not found. No pages will be built.');
    return pages;
  }

  const entries = readdirSync(pagesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const htmlPath = resolve(pagesDir, entry.name, 'index.html');
      if (existsSync(htmlPath)) {
        pages[entry.name] = htmlPath;
        console.log(`📄 Found page: ${entry.name} -> ${htmlPath}`);
      }
    }
  }

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
      // Custom plugin to handle short URLs
      {
        name: 'rewrite-page-urls',
        configureServer(server: ViteDevServer) {
          server.middlewares.use((req: any, res: any, next: any) => {
            const url = req.url || '';

            // Match patterns like /pagename.html
            const match = url.match(/^\/([a-zA-Z0-9-]+)\.html$/);
            if (match) {
              const pageName = match[1];
              const fullPath = resolve(__dirname, 'pages', pageName, 'index.html');
              if (existsSync(fullPath)) {
                req.url = `/pages/${pageName}/index.html`;
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
      },
    },

    resolve: {
      alias: {
        '~': resolve(__dirname, 'src'),
      },
    },
  };
});
