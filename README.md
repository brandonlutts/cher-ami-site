# Cher Ami — Luxury Restoration Journal (Static Site)

A single-page, magazine-style restoration site with section-by-section navigation, parallax accents, and a June 2026 countdown.

## Run locally
Just open `index.html` in your browser.

For best results (especially video autoplay and hash routing), run a tiny local server:

- **macOS / Linux**
  - `python3 -m http.server 8080`
- **Windows**
  - `py -m http.server 8080`

Then open: `http://localhost:8080`

## Customize
- **Update the countdown target**: `js/app.js` → `const target = new Date(...)`
- **Add timeline chapters**: duplicate a `.milestone` block in `index.html`
- **Change the mailto address**: `js/app.js` → `const to = "you@example.com";`

## Assets
All imagery/video used here is loaded from `/assets/` and can be swapped with your own photos.
