# AGENTS.md

## Cursor Cloud specific instructions

This is a React 19 + Vite 7 single-page portfolio application. No backend or database is required.

### Services

| Service         | Command       | Port | Notes                                               |
| --------------- | ------------- | ---- | --------------------------------------------------- |
| Vite dev server | `npm run dev` | 5173 | Add `-- --host 0.0.0.0` to expose on all interfaces |

### Key commands

See `package.json` scripts for the full list. Summary:

- **Dev server:** `npm run dev`
- **Lint:** `npm run lint` (ESLint 9)
- **Format check:** `npm run format:check` (Prettier)
- **Build:** `npm run build` (Vite production build)
- **Preview prod build:** `npm run preview`

### Non-obvious notes

- Portfolio data is in `src/data/portfolioData.json`. A copy lives at `public/portfolioData.json` and is fetched at runtime; both must stay in sync.
- The contact form requires EmailJS credentials (`src/components/Contact.jsx`) to actually send emails, but the app renders and functions without them.
- `vite.config.js` sets `base: '/portfolio/'` only in production mode, so dev server paths work at `/` without prefix.
- Bootstrap 5.3 CSS/JS is loaded from CDN in `index.html`, not installed via npm.
- **Shareable tiles:** Project and timeline cards expose a share button. Links use URL hashes (`#project/1`, `#timeline/exp-0`). Utilities live in `src/utils/shareLink.js`; `useShareLinkBootstrap` in `App.jsx` dispatches navigation on load/hash change. Timeline share IDs are `exp-{index}` / `edu-{index}` (array order in `portfolioData.json`).
