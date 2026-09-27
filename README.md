# PromoSphere — Product Discovery Platform

A lightweight, static product catalog and discovery platform styled in an elegant teddy palette (creamy-white, soft peach, and warm brown). Built with vanilla HTML, modern CSS variables, and modular ES6 JavaScript.

## Features

- **No Invented Claims:** Only displays exact fields present in the database.
- **Dual Automatic Search:** Automatically identifies either text name search (`e.g. keyboard`) or exact 6-digit numeric IDs (`e.g. 100201` or `#100201`).
- **Fully Decoupled Data Layer:** All products are managed centrally via `data/products.json`.
- **Strict CTA Rule:** Primary call-to-actions display "View Product" (never "Buy Now" or "Add to Cart").
- **Zero Dependencies:** Pure static architecture ready for GitHub Pages, Cloudflare Pages, or Hostinger.

## Product Schema Specification

Each entry in `data/products.json` adheres to the following structure:

```json
{
  "id": "700801",
  "name": "Sample Planner",
  "category": "Lifestyle",
  "description": "Demonstration product listing.",
  "price": "22.00",
  "currency": "USD",
  "images": [
    "[https://example.com/planner.jpg](https://example.com/planner.jpg)"
  ],
  "affiliateUrl": "[https://example.com/affiliate-link](https://example.com/affiliate-link)",
  "specifications": [
    { "label": "Format", "value": "A5" }
  ],
  "featured": true
}
