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
- **Format (fix):** `npm run format` (Prettier — run after editing any `.md`, `.js`, `.jsx`, `.json`, or `.css`)
- **Format check:** `npm run format:check` (Prettier — must pass; same as CI)
- **Build:** `npm run build` (Vite production build)
- **Preview prod build:** `npm run preview`
- **CI locally (required before push/PR):** `npm run check` — runs `lint`, `format:check`, and `build` in order

### Before every commit, push, or PR

**Always run `npm run check` and confirm it exits 0.** GitHub Actions runs the same steps; do not push if any step fails.

If `format:check` fails (often on `README.md` after doc edits), run `npm run format` then re-run `npm run check`.

Typical workflow:

```bash
npm run format    # after editing docs or if format:check failed
npm run check     # lint + format:check + build — must pass before push
```

### Non-obvious notes

- Portfolio data is in `src/data/portfolioData.json`. A copy lives at `public/portfolioData.json` and is fetched at runtime; both must stay in sync.
- The contact form requires EmailJS credentials (`src/components/Contact.jsx`) to actually send emails, but the app renders and functions without them.
- `vite.config.js` sets `base: '/portfolio/'` only in production mode, so dev server paths work at `/` without prefix.
- Bootstrap 5.3 CSS/JS is loaded from CDN in `index.html`, not installed via npm.
- **Shareable tiles:** Each project and timeline row needs a `"slug"` in `portfolioData.json`. Share URLs use `#project/{slug}` and `#timeline/{slug}`. Resolution lives in `src/utils/shareLinkRegistry.js` + `shareLink.js`; bootstrap loads the registry in `useShareLinkBootstrap`. Legacy hashes (`project/2`, `timeline/exp-0`) auto-map to slugs; use `shareAliases` for retired entries. Missing links show `ShareLinkNotice` and scroll to the section.
