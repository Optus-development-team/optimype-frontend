# Optimype Brand Kit

This file collects the visual system, style sources, and reusable UI context of this site. It was written when the site was still the OPTUS company site; the product is now **Optimype** (a brand owned by Optus) and, for now, it keeps this same logo and look and feel.

## 1) Core Visual Identity

- Brand name: Optimype (formerly shown as OPTUS)
- Primary mood: clean, modern, business-focused, AI/automation-oriented
- Main accent color: `#06B6D4`
- Main primary color: `#002B5B`
- Light mode background: white / very light gray
- Dark mode background: deep navy / near-black blue

## 2) Source Of Truth For Styles

These are the main files that define the visual system:

- `src/styles/variables.css` - central color palette and theme variables
- `src/styles/global.css` - global typography, buttons, containers, base layout rules
- `src/index.css` - base reset and global browser defaults
- `tailwind.config.js` - Tailwind tokens, colors, radius, animations
- `index.html` - meta theme color, fonts, SEO, favicon, icon loading

Theme switching is controlled through:

- `src/components/ui/ThemeToggle.jsx`
- `src/components/ui/ThemeToggle.css`
- `src/components/ui/ThemeLanguageToggle.jsx`
- `src/components/ui/ThemeLanguageToggle.css`
- `body.dark-theme` classes in the CSS files

## 3) Typography

The project uses Google Fonts loaded in `index.html`:

- `Titan One` for hero titles and high-impact headings
- `Lilita One` for section headings
- `Molengo` for body text
- `Inter` as supporting/system-like fallback

Typography rules are mostly defined in `src/styles/global.css`.

## 4) Color Tokens

Defined in `src/styles/variables.css`:

- `--color-primary: #002B5B`
- `--color-secondary: #F5F7FA`
- `--color-accent: #06B6D4`
- `--color-white: #FFFFFF`
- `--color-text-dark: #0c1445`
- `--color-text-light: #666666`

Dark theme overrides are also centralized there.

## 5) Layout And Shared UI

These components define the shell and reusable visual behavior:

- `src/components/layout/Navbar.jsx`
- `src/components/layout/Navbar.css`
- `src/components/layout/Footer.jsx`
- `src/components/layout/Footer.css`
- `src/components/ui/ScrollToTopButton.jsx`
- `src/components/ui/ScrollToTopButton.css`
- `src/components/ui/ThemeToggle.jsx`
- `src/components/ui/ThemeToggle.css`
- `src/components/ui/ThemeLanguageToggle.jsx`
- `src/components/ui/ThemeLanguageToggle.css`

## 6) Page-Level Visual Systems

Each major page usually has its own CSS file and should be copied together with the page component when porting:

- `src/pages/Home.jsx` + `src/pages/Home.css`
- `src/pages/Nosotros.jsx` + `src/pages/Nosotros.css`
- `src/pages/Servicios.jsx` + `src/pages/Servicios.css`
- `src/pages/Portafolio.jsx` + `src/pages/Portafolio.css`
- `src/pages/Beneficios.jsx` + `src/pages/Beneficios.css`
- `src/pages/FAQ.jsx` + `src/pages/FAQ.css`
- `src/pages/Login.jsx` + `src/pages/Login.css`
- `src/pages/Privacy.jsx` + `src/pages/Privacy.css`
- `src/pages/TerminosServicio.jsx` + `src/pages/TerminosServicio.css`
- `src/pages/Demo.jsx` + `src/pages/Demo.css`
- `src/pages/Dashboard.jsx` + `src/pages/Dashboard.css`

## 7) Section-Level Components

The homepage and marketing sections are split into modular components under `src/components/sections`.
These are useful if you want the same landing-page composition in another repo.

- `src/components/sections/Hero.jsx` + `src/components/sections/Hero.css`
- `src/components/sections/About.jsx` + `src/components/sections/About.css`
- `src/components/sections/Benefits.jsx` + `src/components/sections/Benefits.css`
- `src/components/sections/Contact.jsx` + `src/components/sections/Contact.css`
- `src/components/sections/Portfolio.jsx` + `src/components/sections/Portfolio.css`
- `src/components/sections/Services.jsx` + `src/components/sections/Services.css`
- `src/components/sections/TrustLogos.jsx` + `src/components/sections/TrustLogos.css`
- `src/components/sections/WhyOptus.jsx` + `src/components/sections/WhyOptus.css`

## 8) Theme And Visual Behavior

The current visual language depends on:

- `body.dark-theme` being present or removed
- CSS variables changing between light and dark mode
- CTA buttons using shared `.btn`, `.btn-primary`, `.btn-secondary`, and `.btn-lg` styles
- Large hero titles with strong contrast and accent highlights
- Decorative sections, gradients, cards, shadows, and subtle motion

## 9) Assets To Copy For Another Repo

If you want the same visual identity, copy these assets first:

- `public/OPTUSLOGO.png`
- `public/finisher-header.es5.min.js`
- Anything under `src/assets/` that is actually used in pages or sections

## 10) Content And Language Layer

If the other project needs the same copy and language behavior, also copy:

- `src/i18n.js`
- `src/locales/en.json`
- `src/locales/es.json`

These files control translated UI strings, hero copy, buttons, and labels.

## 11) External Libraries That Affect The Look

- `aos` for animation timing and scroll reveals
- `@privy-io/react-auth` for auth UI flow
- `@rainbow-me/rainbowkit` for wallet/payment-related UI
- Font Awesome icons via CDN
- Google Fonts via CDN

## 12) Minimal Copy List For A New Repo

If you want the closest visual clone, copy these together:

1. `src/styles/variables.css`
2. `src/styles/global.css`
3. `src/index.css`
4. `tailwind.config.js`
5. `index.html`
6. `src/components/layout/*`
7. `src/components/ui/*`
8. `src/components/sections/*`
9. `src/pages/*`
10. `src/locales/*`
11. `src/i18n.js`
12. `public/OPTUSLOGO.png`

## 13) Notes For Porting

- The project relies heavily on page-specific CSS rather than a single component library.
- The light/dark theme is class-driven, not route-driven.
- Most visual consistency comes from shared variables and repeated button/card patterns.
- If you only copy JSX without the matching CSS files, the brand look will be lost.

## 14) Recommended Reuse Order

1. Copy the theme tokens and globals.
2. Copy shared layout and UI components.
3. Copy section and page CSS beside their JSX files.
4. Copy locales and i18n.
5. Copy logos and image assets.
6. Reconnect the theme toggle and language toggle in the new app.
