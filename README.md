# Vishal KVS — personal portfolio

Live: https://therealvik3939-cloud.github.io/Portfolio/

A responsive Astro portfolio with GSAP motion, interactive 3D ASCII sculptures, a personal photo, and eight VS Code inspired color palettes.

## Develop

Requires Node.js 24.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

The local URL includes `/Portfolio/`, matching the GitHub Pages base path.

## Interactions

- Sphere, torus, and wave ASCII sculptures, with pointer rotation, speed control, and pause.
- GSAP entrance and scroll motion, moving ticker, hover details, and rotating text.
- Command palette: Ctrl/Cmd+K. Search pages, actions, or themes; use arrow keys and Enter.
- Eight persistent palettes: Solarized Light/Dark, Dark Modern, Light Modern, Monokai, Quiet Light, Abyss, and High Contrast.
- Project filters, expandable project details, keyboard-operated skill tabs, copy-email, and scroll position feedback.
- Page-wide motion preference. OS reduced-motion settings take priority. Offscreen art stops updating.
- A theme-aware SVG favicon with a static fallback.

## Content and portrait

- `src/data/profile.mjs`: biography-adjacent content, project links, and skills.
- `src/data/themes.mjs`: palette definitions. Website palettes adapt VS Code editor colors, with text adjustments for readable contrast.
- `src/lib/ascii.mjs`: deterministic 3D character renderer.
- `src/pages/index.astro`: page structure.
- `public/images/vishal.jpeg`: photo supplied by Vishal for this portfolio.

Professional information comes from the user's GitHub profile README and previous portfolio. LinkedIn is the profile explicitly linked in that README; no unavailable LinkedIn employment or education details were inferred.

Sources:
- https://github.com/therealvik3939-cloud/therealvik3939-cloud
- https://github.com/therealvik3939-cloud/ML_lab
- https://www.linkedin.com/in/vishal-kvs-31b170351/

## Deployment

GitHub Pages uses **GitHub Actions**. `.github/workflows/deploy.yml` installs locked dependencies, runs tests, builds Astro, uploads `dist/`, and deploys it to Pages. Every push to `main` publishes an update. `astro.config.mjs` sets the public site URL and `/Portfolio` base.

## Validation

`npm test` checks that all ASCII modes render bounded, changing frames; palette IDs and persistence fallbacks are valid; body, secondary, and accent text retain at least 4.5:1 contrast against both surfaces; project URLs and the Pages base target the correct account.

The production Astro build and browser checks cover theme persistence, command palette search and keyboard selection, project filtering, skill tab keyboard navigation, saved motion preferences, the photo, favicon, and mobile overflow.

## Credits

Theme inspiration: [Microsoft VS Code built-in themes](https://github.com/microsoft/vscode/tree/main/extensions), MIT license. Palette values are adapted for a website; this is not affiliated with Microsoft.

Built with [Astro](https://astro.build/) and [GSAP](https://gsap.com/). Fonts: DM Sans and DM Mono via Google Fonts, with system fallbacks. No analytics, trackers, or contact form backend.
