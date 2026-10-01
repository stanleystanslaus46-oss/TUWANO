import { resolve } from 'path';
import { defineConfig } from 'vite';

const rootDir = typeof import.meta.dirname !== 'undefined' ? import.meta.dirname : process.cwd();

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        shop: resolve(rootDir, 'shop.html'),
        gold: resolve(rootDir, 'gold.html'),
        silver: resolve(rootDir, 'silver.html'),
        rings: resolve(rootDir, 'rings.html'),
        necklaces: resolve(rootDir, 'necklaces.html'),
        bracelets: resolve(rootDir, 'bracelets.html'),
        earrings: resolve(rootDir, 'earrings.html'),
        product: resolve(rootDir, 'product.html'),
        piercing: resolve(rootDir, 'piercing.html'),
        about: resolve(rootDir, 'about.html'),
        stores: resolve(rootDir, 'stores.html'),
        contact: resolve(rootDir, 'contact.html'),
      },
    },
  },
});
