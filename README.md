# TUWANO JEWELLERIES — Production Website

A luxury multi-page website for Tuwano Jewelleries in Tanzania, built as a static frontend with HTML5, CSS3, and modular Vanilla JavaScript.

## Project structure

```
tuwano-jewelleries/
├── index.html
├── shop.html
├── gold.html
├── silver.html
├── rings.html
├── necklaces.html
├── bracelets.html
├── earrings.html
├── product.html
├── piercing.html
├── about.html
├── stores.html
├── contact.html
├── css/
│   ├── global.css
│   ├── components.css
│   ├── pages.css
│   └── responsive.css
├── js/
│   ├── products.js
│   ├── whatsapp.js
│   ├── cart.js
│   ├── search.js
│   ├── shop.js
│   ├── product.js
│   ├── main.js
│   └── vendor/
│       └── lucide.min.js
├── assets/
│   └── images/
├── package.json
├── bun.lock
├── vite.config.js
└── README.md
```

## Architecture

- Static HTML5 multi-page application
- CSS3 with responsive breakpoints
- Vanilla JavaScript ES6+
- Vite for local development and production builds
- Lucide for interface icons
- Browser `localStorage` for the client-side Selection Bag and saved pieces
- WhatsApp links for direct enquiries

There is no application backend, database, authentication layer, or server-side API dependency.

## Run locally

### Vite

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Static server

The site can also be served directly by any static HTTP server. For example:

```bash
python3 -m http.server 8000
```

## Production build

```bash
npm run build
```

The Vite production output is written to `dist/`.

## Product catalogue

Product data is centralized in `js/products.js`. Category pages, search, filtering, quick view, and product detail views use this catalogue.

Only verified product information and available imagery should be added. Do not add unverified prices, reviews, ratings, certifications, warranties, material claims, or service claims.

## Store and WhatsApp details

Store contact routing is centralized in `js/whatsapp.js` and store information is maintained with the catalogue/site data.

When changing business contact information, update the central source rather than duplicating numbers across pages.

## Deployment

The project is suitable for static hosting platforms such as Netlify, Vercel, or Cloudflare Pages.

For Vite deployment:

- Build command: `npm run build`
- Output directory: `dist`

## Accessibility and quality

The project includes an accessibility foundation such as semantic controls, keyboard focus styling, accessible labels, image alternative text, and reduced-motion support.

A formal WCAG conformance audit has not been claimed.

## Development principle

Preserve the established Tuwano visual identity and navy-blue design system. Changes should improve correctness, maintainability, accessibility, responsiveness, and performance without introducing unnecessary frameworks or backend infrastructure.
