import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(({ mode }) => ({
  plugins: [
    solidPlugin(),
    // Analyze bundle size if ANALYZE env var is set
    mode === 'production' && process.env.ANALYZE
      ? visualizer({
          open: true,
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true,
        })
      : undefined,
  ].filter(Boolean),

  server: {
    port: 3000,
    host: true,
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
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
      output: {
        manualChunks: {
          // Only chunk SolidJS for admin
          'admin-vendor': ['solid-js'],
          'admin-router': ['@solidjs/router'],
        },
      },
    },
  },

  resolve: {
    alias: {
      '~': '/src',
    },
  },
}));
