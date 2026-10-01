# TUWANO JEWELLERIES — World-Class Production Website

A luxury, production-quality digital flagship for **Tuwano Jewelleries** (Madukani & Mori, Tanzania).

Built strictly with clean HTML5, modern CSS3, and modular Vanilla JavaScript ES6+, adhering to international luxury jewellery house standards and refined anti-slop design discipline.

---

## 1. Project Structure

```
tuwano-jewelleries/
├── index.html                # High-end Editorial Homepage
├── shop.html                 # Comprehensive Jewellery Catalogue & Filter Engine
├── gold.html                 # Solid Gold Jewellery Collection
├── silver.html               # 925 Sterling Silver Collection
├── rings.html                # Solitaires, Bands & Signet Rings
├── necklaces.html            # Cuban Links, Curb Chains & Pendants
├── bracelets.html            # Cuffs, Bangles & Herringbone Weaves
├── earrings.html             # Huggies, Hoops & Studs
├── product.html              # Dedicated Luxury Product Detail Page (PDP)
├── piercing.html             # Ear Piercing Studio & Aftercare Guide
├── about.html                # Tuwano Story, Philosophy & Craftsmanship
├── stores.html               # Physical Boutiques (Madukani & Mori)
├── contact.html              # Client Concierge & Direct WhatsApp Enquiries
├── css/
│   ├── global.css            # Design tokens, typography, reset, scrollbars
│   ├── components.css        # Top bar header, drawers, product cards, modals
│   ├── pages.css             # Page-specific layouts (Hero, PDP, Story, Stores)
│   └── responsive.css        # Multi-breakpoint rules (320px – 1920px)
├── js/
│   ├── products.js           # Centralized single-source catalogue & categories
│   ├── whatsapp.js           # Dynamic URL-encoded WhatsApp enquiry generator
│   ├── cart.js               # Client-side Selection Bag state & Wishlist engine
│   ├── search.js             # Real-time search indexer & search modal
│   ├── shop.js               # Filtering, sorting, and Quick View controller
│   ├── product.js            # PDP gallery zoom, boutique selector & specs
│   └── main.js               # Global site controller, sticky header, drawers
├── assets/
│   └── images/
│       ├── logo/             # Tuwano brand vector SVGs (primary & light)
│       ├── products/         # High-resolution macro jewellery photography
│       ├── collections/      # Gold and silver collection still life photography
│       ├── editorial/        # Vogue-grade luxury editorial campaign photography
│       ├── piercing/         # Curated ear styling studio photography
│       └── stores/           # Madukani & Mori architectural boutique photos
├── metadata.json
├── vite.config.js
└── README.md
```

---

## 2. How to Run Locally

Because this project uses standard web technologies without proprietary framework lock-in, it can be run in any modern environment:

### Option A: Via Vite Dev Server (Included)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option B: Via Python Simple HTTP Server
```bash
python3 -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000).

### Option C: Via Node http-server or Live Server
```bash
npx http-server . -p 3000
```

---

## 3. How to Replace & Add Products

All product data is centralized in `/js/products.js`. 
You **never** need to touch individual HTML files to update products—the shop, category pages, search, and detail pages will automatically update.

### Adding a New Product:
Open `/js/products.js` and add an object to the `PRODUCTS` array:

```javascript
{
  id: "tj-gold-008",
  name: "Handcrafted Rope Chain",
  category: "Gold",          // "Gold" or "Silver"
  collection: "Chains",       // "Chains", "Rings", "Necklaces", "Bracelets", "Earrings"
  subcategory: "Chains",
  description: "Detailed description of the piece and craftsmanship.",
  details: [
    "Material: Solid 18k Yellow Gold",
    "Link Width: 4.0mm",
    "Closure: Lobster Clasp"
  ],
  price: null,
  priceLabel: "Price on request", // Or e.g. "TZS 1,200,000" when known
  featured: true,             // true to show on homepage
  availability: "In Stock at Madukani & Mori",
  stores: ["Madukani", "Mori"],
  images: [
    "/assets/images/products/my_new_chain.jpg"
  ],
  tags: ["Gold", "Chains", "New Arrival"]
}
```

---

## 4. How to Replace Images

1. Place your new photography inside the corresponding subfolder:
   - Logo: `/assets/images/logo/`
   - Products: `/assets/images/products/`
   - Collections: `/assets/images/collections/`
   - Editorial: `/assets/images/editorial/`
   - Piercing: `/assets/images/piercing/`
   - Stores: `/assets/images/stores/`
2. Update the image paths in `/js/products.js` or in the respective HTML file.
3. The logo is provided as a vector SVG (`/assets/images/logo/tuwano-logo.svg`) matching the official Tuwano Jewellers diamond mark.

---

## 5. How to Change Contact Details & WhatsApp Numbers

Boutique telephone numbers, WhatsApp routing, and opening hours are configured in:
1. **`/js/whatsapp.js`**:
   ```javascript
   export const WHATSAPP_NUMBERS = {
     madukani: {
       name: "Madukani Store",
       phoneDisplay: "0679 323 647",
       intlPhone: "+255 679 323 647",
       waNumber: "255679323647" // Format: country code without + or spaces
     },
     mori: {
       name: "Mori Store",
       phoneDisplay: "0652 562 875",
       intlPhone: "+255 652 562 875",
       waNumber: "255652562875"
     }
   };
   ```
2. **`/js/products.js`**: `STORES` array holds store hours and services.

---

## 6. How to Deploy to Netlify / Vercel / Cloudflare Pages

### Build Command (Vite Multi-Page Build):
```bash
npm run build
```
- **Publish Directory**: `dist`
- Or simply deploy the entire root folder as a static site (HTML/CSS/JS).

---

## 7. Key Brand & Conversion Features

- **WhatsApp Conversion Engine**: Dynamic, pre-filled WhatsApp messages for products, bag checkout, and piercing appointments.
- **Client-Side Selection Bag**: Persistent shopping bag stored in browser `localStorage`.
- **Saved Pieces (Wishlist)**: Persistent wishlist allowing clients to save pieces and enquire in batch.
- **Instant Search**: Real-time modal searching across names, categories, collections, and tags.
- **Quick View**: Fast modal preview with thumbnail gallery and instant WhatsApp CTA without leaving the grid.
- **WCAG AA Compliant**: High-contrast typography, accessible touch targets, and `prefers-reduced-motion` support.
