import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  // Relative asset paths make the same build work at a GitHub Pages project URL and locally.
  base: './',
  // Preact's automatic JSX runtime is all this static app needs. Omitting the
  // development-refresh plugin keeps cold starts practical on small machines.
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'preact',
  },
  build: {
    target: 'es2022',
    // The locally bundled Chinese font has many unicode subsets; source maps
    // add no user value here and make a Pages build needlessly heavy.
    sourcemap: false,
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app/index.html'),
      },
      output: {
        // KaTeX is large and changes independently of the workbench. Keep it
        // in a cacheable chunk while the editor shell stays below Vite's size warning.
        manualChunks(id) {
          if (id.replaceAll('\\', '/').includes('/node_modules/katex/')) return 'katex';
        },
      },
    },
  },
});
