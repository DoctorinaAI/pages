import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    target: 'es2017',
    lib: {
      entry: resolve(__dirname, 'src/widget/doctorina-chat.ts'),
      name: 'DoctorinaChat',
      formats: ['iife'],
      fileName: () => 'doctorina-chat.js',
    },
    outDir: 'dist/widget',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
});
