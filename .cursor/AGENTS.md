# Portfolio Project - Complete Knowledge Base

> **Last Updated:** March 15, 2026
> **Owner:** Harish Kumar Balaji (@harishkumarbalaji)
> **Purpose:** Comprehensive project documentation for AI agents and future development sessions

---

## 🎯 Project Overview

**Harish Kumar Balaji's Portfolio** is a modern, single-page React application showcasing professional experience, projects, and skills. It's a fully customizable portfolio template built with React 19 + Vite 7, featuring dark/light themes, smooth animations, interactive galleries, and a serverless contact form.

### Tech Stack

- **Frontend:** React 19.1.0, JavaScript (ES6+)
- **Build Tool:** Vite 7.0.0
- **Styling:** Pure CSS3 with CSS Variables (no preprocessors, no frameworks except Bootstrap CDN for utility)
- **Icons:** React Icons library, Skill Icons API
- **Email:** EmailJS (@emailjs/browser 4.4.1) - serverless email delivery
- **Deployment:** GitHub Pages (gh-pages 6.3.0)
- **CI/CD:** GitHub Actions workflows

### Repository Information

- **GitHub:** https://github.com/harishkumarbalaji/portfolio
- **Live URL:** https://harishkumarbalaji.github.io/portfolio
- **Branch:** `master` (main deployment branch)
- **Node Version:** 22.x (as specified in CI workflows)

---

## 📁 Project Structure

```
portfolio/
├── .cursor/
│   └── AGENTS.md                 # This file - project knowledge base
├── .github/
│   └── workflows/
│       ├── ci.yml                # Linting, formatting, build checks
│       ├── deploy.yml            # Auto-deploy to GitHub Pages on push to master
│       └── pr-preview.yml        # Deploy PR previews to gh-pages/pr-preview/
├── public/
│   ├── media/                    # All media assets
│   │   ├── profile/              # Profile images (light/dark theme)
│   │   │   └── slider/           # Photo slider images
│   │   ├── logos/                # Company & institution logos
│   │   ├── experience/           # Experience-related media
│   │   │   ├── zipline/
│   │   │   ├── skydio/
│   │   │   └── earthsense/
│   │   └── projects/             # Project media (future use)
│   ├── portfolioData.json        # RUNTIME data source (fetched by app)
│   ├── favicon.svg               # Site favicon
│   └── vite.svg                  # Vite logo
├── src/
│   ├── components/               # React components (one per section)
│   │   ├── Hero.jsx              # Landing section with typing animation
│   │   ├── About.jsx             # About me section
│   │   ├── Projects.jsx          # Projects timeline with expandable cards
│   │   ├── Skills.jsx            # Skills categorized grid
│   │   ├── Timeline.jsx          # Experience & Education timeline
│   │   ├── Contact.jsx           # Contact form with EmailJS
│   │   ├── Header.jsx            # Navigation header with theme toggle
│   │   ├── ThemeToggle.jsx       # Theme switcher component
│   │   ├── ScrollProgress.jsx    # Scroll progress bar & back-to-top
│   │   ├── SocialLinks.jsx       # Social media links
│   │   ├── ResumeModal.jsx       # Resume viewer modal
│   │   ├── MetaTags.jsx          # Dynamic meta tags for SEO
│   │   └── Loader.jsx            # Loading spinner
│   ├── context/
│   │   └── ThemeContext.jsx      # Theme state management (light/dark)
│   ├── data/
│   │   └── portfolioData.json    # SOURCE data file (edit this!)
│   ├── styles/
│   │   ├── theme.css             # CSS variables & global theme
│   │   ├── Hero.css              # Component-specific styles
│   │   ├── About.css
│   │   ├── Projects.css
│   │   ├── Skills.css
│   │   ├── Timeline.css
│   │   ├── Contact.css
│   │   ├── Header.css
│   │   ├── ThemeToggle.css
│   │   ├── ScrollProgress.css
│   │   ├── SocialLinks.css
│   │   ├── ResumeModal.css
│   │   └── Loader.css
│   ├── App.jsx                   # Main app component
│   ├── App.css                   # App-level styles
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global base styles
├── index.html                    # HTML entry with meta tags
├── vite.config.js                # Vite config (base path for GitHub Pages)
├── package.json                  # Dependencies & scripts
├── eslint.config.js              # ESLint 9 config
├── .gitignore
└── README.md                     # User-facing documentation

```

---

## 🔑 Key Concepts & Patterns

### 1. **Data-Driven Architecture**

**All content is controlled by JSON data files:**

- **Source of Truth:** `src/data/portfolioData.json`
- **Runtime Data:** `public/portfolioData.json` (must be kept in sync)
- **Why Two Files?**
  - `src/data/portfolioData.json` - Edit this during development
  - `public/portfolioData.json` - Fetched at runtime by components
  - **IMPORTANT:** After editing `src/data/portfolioData.json`, copy it to `public/portfolioData.json`

**Data Structure Overview:**

```json
{
  "metadata": {
    "title": "Page title for SEO",
    "description": "Meta description",
    "author": "Author name",
    "preview": {
      // Open Graph tags for social sharing
      "title": "Preview title",
      "description": "Preview description",
      "image": "/media/profile/image.jpg",
      "url": "Full site URL",
      "type": "website"
    }
  },
  "sections": {
    /* Section titles & IDs */
  },
  "navigation": {
    /* Header menu items */
  },
  "hero": {
    /* Landing section data */
  },
  "about": {
    /* About section content */
  },
  "projects": [
    /* Project array */
  ],
  "skills": [
    /* Skill categories */
  ],
  "experience": [
    /* Work experience */
  ],
  "education": [
    /* Education history */
  ],
  "contact": {
    /* Contact info */
  },
  "social": {
    /* Social links */
  }
}
```

### 2. **Component Data Loading Pattern**

Every component follows this pattern:

```jsx
import { useEffect, useState } from 'react';

const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}portfolioData.json`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.mySection);
      });
  }, []);

  if (!data) return null; // Or <Loader />

  return <div>{/* Render with data */}</div>;
};
```

**Key Points:**

- Uses `import.meta.env.BASE_URL` to handle GitHub Pages base path
- Fetches data on mount
- Gracefully handles loading state

### 3. **Theme System**

**Implementation:** Context API + CSS Variables

**Files:**

- `src/context/ThemeContext.jsx` - Theme state management
- `src/styles/theme.css` - CSS variable definitions

**How It Works:**

1. ThemeContext stores theme state in localStorage
2. Sets `data-theme="dark"` or `data-theme="light"` on `<html>`
3. CSS variables switch automatically via `:root` and `[data-theme="dark"]`
4. All components use CSS variables like `var(--bg-primary)`

**Theme Colors:**

- Light theme: White backgrounds, dark text, `#aa5149` accent
- Dark theme: Dark backgrounds (`#1a1a1a`), white text, `#c65e54` accent

### 4. **Media Handling**

**Supported Media Types:**

- **Local Images:** `.jpg`, `.png`, `.gif`, `.webp`, `.svg`
- **Local Videos:** `.mp4`, `.webm`, `.mov`
- **YouTube:** Embedded player with auto-detect
- **Google Drive:** Video/image embedding
- **Google Slides:** Live preview with auto-loop
- **OneDrive:** Video/image embedding
- **LinkedIn Posts:** Embedded post preview
- **External Links:** Styled link cards

**Media Path Resolution:**

```javascript
// For local media in public/media/
const mediaUrl = `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

// In development: /media/profile/image.jpg
// In production: /portfolio/media/profile/image.jpg
```

**Gallery Implementation:**

- Projects and Timeline sections support `gallery` arrays
- Each gallery item has `{ title, url, type }`
- Type auto-detection in `Projects.jsx` and `Timeline.jsx`
- Modal viewer with navigation for galleries

### 5. **Base Path Handling (GitHub Pages)**

**Configuration:**

```javascript
// vite.config.js
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/portfolio/' : '/',
}));
```

```json
// package.json
{
  "homepage": "https://harishkumarbalaji.github.io/portfolio"
}
```

**Why This Matters:**

- GitHub Pages serves from `/portfolio/` subdirectory
- Dev server uses root path `/`
- `import.meta.env.BASE_URL` automatically resolves to correct base
- **CRITICAL:** Repository name in both files must match exactly

---

## 🚀 Development Workflow

### Services & Commands

| Command                 | Purpose                             | Port/Notes                                    |
| ----------------------- | ----------------------------------- | --------------------------------------------- |
| `npm run dev`           | Start development server            | http://localhost:5173                         |
| `npm run build`         | Build for production                | Outputs to `dist/`                            |
| `npm run preview`       | Preview production build locally    | http://localhost:4173                         |
| `npm run lint`          | Check code with ESLint 9            | Exits with error if issues found              |
| `npm run format`        | Format code with Prettier           | Writes changes to files                       |
| `npm run format:check`  | Check formatting without changes    | Used in CI                                    |
| `npm run deploy`        | Deploy to GitHub Pages              | Runs `build` then `gh-pages -d dist`          |

### Local Development Setup

```bash
# Clone repository
git clone https://github.com/harishkumarbalaji/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser to http://localhost:5173
```

### Making Content Changes

1. **Edit Data:**
   - Modify `src/data/portfolioData.json`
   - Copy changes to `public/portfolioData.json`

2. **Add Media:**
   - Place files in appropriate `public/media/` subfolder
   - Reference with path: `/media/category/file.ext`

3. **Test Locally:**
   ```bash
   npm run dev
   ```

4. **Build & Deploy:**
   ```bash
   npm run deploy
   ```

### Component Customization

Each section has its own component and CSS file:

- **Add new section:** Create `MySection.jsx` + `MySection.css`, import in `App.jsx`
- **Modify styles:** Edit corresponding CSS file in `src/styles/`
- **Theme colors:** Adjust CSS variables in `src/styles/theme.css`

---

## 🔧 CI/CD & Deployment

### GitHub Actions Workflows

#### 1. **CI Workflow** (`ci.yml`)

**Triggers:** Push to `master`, PRs to `master`

**Actions:**
- Install dependencies (`npm ci`)
- Run linter (`npm run lint`)
- Check formatting (`npm run format:check`)
- Build app (`npm run build`)

**Purpose:** Ensure code quality before merge

#### 2. **Deploy Workflow** (`deploy.yml`)

**Triggers:** Push to `master`

**Actions:**
- Install dependencies
- Build production bundle
- Deploy to `gh-pages` branch using JamesIves/github-pages-deploy-action
- Preserves `pr-preview/` folder (doesn't clean it)

**Result:** Live site updates at https://harishkumarbalaji.github.io/portfolio

#### 3. **PR Preview Workflow** (`pr-preview.yml`)

**Triggers:** PR opened, synchronized, reopened, closed

**Actions:**
- On open/sync: Build with custom base path `/portfolio/pr-preview/pr-{NUMBER}/`
- Deploy to `gh-pages` branch under `pr-preview/pr-{NUMBER}/`
- On close: Clean up preview folder
- Adds comment to PR with preview URL

**Result:** Each PR gets a live preview URL

### Manual Deployment

```bash
# Deploy from local machine
npm run deploy
```

This command:
1. Runs `npm run build` (predeploy script)
2. Pushes `dist/` folder to `gh-pages` branch

**Note:** Manual deploys are rarely needed since CI/CD auto-deploys on push to master.

---

## 📧 EmailJS Integration

### Current Configuration

**File:** `src/components/Contact.jsx`

**Credentials (Harish's Account):**
- Service ID: `service_h1rl93b`
- Template ID: `template_953h3qj`
- Public Key: `mQNLMv9ppWrobaDxE`

**Template Variables:**
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{message}}` - Message body
- `{{subject}}` - Auto-generated subject
- `{{to_name}}` - Recipient name (Harish Kumar Balaji)

### How to Update EmailJS

If you need to change EmailJS credentials:

1. Sign up at https://www.emailjs.com/
2. Create email service
3. Create email template with above variables
4. Get Public Key from account settings
5. Update `Contact.jsx` lines 37-47

**Note:** Public Key is safe to commit (designed for client-side use).

---

## 🎨 Styling Architecture

### CSS Organization

**Global Styles:**
- `src/index.css` - Base reset, typography
- `src/styles/theme.css` - CSS variables, theme switching
- `src/App.css` - App-level layout

**Component Styles:**
- Each component has dedicated CSS file
- Import in component: `import '../styles/MyComponent.css'`
- Scoped with class names (not CSS modules)

### Theme Variables (Key Ones)

**Light Theme:**
```css
--bg-primary: #ffffff;
--text-primary: #222222;
--accent-primary: #aa5149;
```

**Dark Theme:**
```css
--bg-primary: #1a1a1a;
--text-primary: #ffffff;
--accent-primary: #c65e54;
```

**Transitions:**
```css
--transition-fast: 0.2s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;
```

### External Dependencies

**Bootstrap 5.3:**
- Loaded from CDN in `index.html` (not npm package)
- Used minimally for utility classes
- No Bootstrap JS components used (except bundle for modal support)

**React Icons:**
- npm package: `react-icons`
- Used for social icons, arrows, etc.
- Import like: `import { FaGithub } from 'react-icons/fa'`

---

## 🐛 Common Issues & Solutions

### Issue: Changes Not Reflecting After Deploy

**Symptoms:** Updated portfolio but changes don't show on live site

**Solutions:**
1. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
2. Wait 2-3 minutes for GitHub Pages CDN
3. Verify `public/portfolioData.json` was updated (not just `src/data/`)
4. Check GitHub Actions tab for failed deployments

### Issue: 404 on Page Load

**Symptom:** Portfolio shows 404 or blank page after deployment

**Root Cause:** Base path mismatch

**Solutions:**
1. Check `vite.config.js` - ensure `base: '/portfolio/'` matches repo name
2. Check `package.json` - ensure `homepage` matches repo URL
3. Both must have identical repository name (case-sensitive)

### Issue: Media Not Loading After Deploy

**Symptoms:** Images/videos work locally but break in production

**Solutions:**
1. Verify files are in `public/media/` (not `src/assets/`)
2. Check paths start with `/media/` (not `public/media/`)
3. Ensure media files are committed to git
4. Verify `vite.config.js` base path is correct

### Issue: EmailJS Not Sending

**Symptoms:** Form submits but no email received

**Solutions:**
1. Check browser console for errors
2. Verify EmailJS credentials in `Contact.jsx`
3. Check EmailJS dashboard for quota (200 emails/month on free tier)
4. Ensure template variables match between code and EmailJS template

---

## 📝 Content Management Guide

### Adding a New Project

1. Edit `src/data/portfolioData.json`
2. Add object to `projects` array:

```json
{
  "id": 3,
  "title": "New Project",
  "year": "2026 - Present",
  "description": "Short description (150 chars shown by default)",
  "fullDescription": "Full description shown when expanded",
  "technologies": ["React", "Node.js"],
  "highlights": ["Achievement 1", "Feature 2"],
  "github": "https://github.com/username/repo",
  "live": "https://example.com",
  "gallery": [
    {
      "title": "Demo Video",
      "url": "https://youtube.com/watch?v=...",
      "type": "youtube"
    }
  ]
}
```

3. Copy to `public/portfolioData.json`
4. Deploy: `npm run deploy`

### Adding Experience

Similar to projects, add to `experience` array:

```json
{
  "year": "2026 - Present",
  "title": "Job Title",
  "company": "Company Name",
  "website": "https://company.com",
  "location": "City, Country",
  "logo": "/media/logos/Company-logo.png",
  "icon": "🏢",
  "technologies": ["Skill1", "Skill2"],
  "details": ["Responsibility 1", "Achievement 2"],
  "highlights": ["Key Metric"],
  "gallery": []
}
```

### Adding Skills

Add to `skills` array (grouped by category):

```json
{
  "category": "Backend",
  "skills": [
    {
      "name": "Node.js",
      "icon": "https://skillicons.dev/icons?i=nodejs"
    }
  ]
}
```

**Find icons at:** https://skillicons.dev/

### Updating Social Links

Edit `social.links` array:

```json
{
  "name": "GitHub",
  "url": "https://github.com/username",
  "icon": "github"
}
```

**Supported icons:** `github`, `linkedin`, `twitter`, `email`, `resume`, `website`

---

## 🔍 Code Patterns & Conventions

### File Naming

- **Components:** PascalCase (e.g., `MyComponent.jsx`)
- **Styles:** Match component name (e.g., `MyComponent.css`)
- **Utilities:** camelCase (e.g., `mediaHelpers.js`)

### Component Structure

```jsx
import { useEffect, useState } from 'react';
import '../styles/MyComponent.css';

const MyComponent = () => {
  // 1. State declarations
  const [data, setData] = useState(null);

  // 2. Effects
  useEffect(() => {
    // Data fetching
  }, []);

  // 3. Event handlers
  const handleClick = () => {
    // Logic
  };

  // 4. Early returns for loading states
  if (!data) return null;

  // 5. Render
  return <div className="my-component">{/* JSX */}</div>;
};

export default MyComponent;
```

### Async Data Fetching

Always use this pattern:

```javascript
fetch(`${import.meta.env.BASE_URL}portfolioData.json`)
  .then((res) => res.json())
  .then((data) => {
    // Use data
  })
  .catch((err) => console.error('Error:', err));
```

### Media URL Construction

```javascript
// For local media
const url = `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

// For external URLs (HTTP/HTTPS)
const url = item.url; // Use as-is
```

---

## 🧪 Testing & Quality

### Linting

**Tool:** ESLint 9
**Config:** `eslint.config.js`
**Rules:** React recommended + React Hooks + React Refresh

**Run:**
```bash
npm run lint
```

**Common Issues:**
- Unused variables
- Missing dependencies in `useEffect`
- React Hooks rules violations

### Formatting

**Tool:** Prettier 3.8.1
**Config:** Default Prettier settings
**Formats:** JS, JSX, JSON, CSS, MD

**Run:**
```bash
# Check formatting
npm run format:check

# Auto-fix formatting
npm run format
```

### Build Testing

```bash
# Build production bundle
npm run build

# Preview locally
npm run preview
```

**Check:**
- No build errors
- All routes work
- Media loads correctly
- Theme toggle works

---

## 📊 Performance Considerations

### Current Optimizations

- **Lazy Loading:** Images/videos load on demand
- **Code Splitting:** Vite automatic chunking
- **CSS Variables:** Fast theme switching (no re-render)
- **Memoization:** Used in Projects.jsx for heavy computations

### Build Output

Typical production build:

```
dist/index.html                   2.84 kB
dist/assets/index-[hash].css     77.39 kB
dist/assets/index-[hash].js     244.14 kB
```

**Total:** ~324 KB (excluding media)

### Load Time Targets

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Largest Contentful Paint:** < 2.5s

**Note:** Most load time depends on media file sizes

---

## 🔐 Security Notes

### EmailJS Public Key

- Safe to commit to repository
- Designed for client-side use
- Protected by domain restrictions + rate limiting

### No Secrets in Repo

- No API keys, passwords, or tokens
- No `.env` files needed
- All configuration is public

### Content Security

- All external embeds (YouTube, Google Drive, etc.) use official embed URLs
- No `eval()` or `dangerouslySetInnerHTML` used

---

## 📚 Dependencies Reference

### Production Dependencies

| Package           | Version | Purpose                           |
| ----------------- | ------- | --------------------------------- |
| react             | 19.1.0  | UI framework                      |
| react-dom         | 19.1.0  | React DOM rendering               |
| @emailjs/browser  | 4.4.1   | Serverless email sending          |
| gh-pages          | 6.3.0   | Deploy to GitHub Pages            |

### Dev Dependencies

| Package                      | Version | Purpose                       |
| ---------------------------- | ------- | ----------------------------- |
| vite                         | 7.0.0   | Build tool & dev server       |
| @vitejs/plugin-react         | 4.5.2   | React support for Vite        |
| eslint                       | 9.29.0  | Code linting                  |
| eslint-plugin-react-hooks    | 5.2.0   | React Hooks linting           |
| eslint-plugin-react-refresh  | 0.4.20  | React Refresh linting         |
| prettier                     | 3.8.1   | Code formatting               |
| @types/react                 | 19.1.8  | React TypeScript types        |
| @types/react-dom             | 19.1.6  | React DOM TypeScript types    |

---

## 🎯 Future Enhancements (Ideas)

### Potential Features

- [ ] Blog section with MDX support
- [ ] Testimonials/recommendations section
- [ ] Project filtering by technology
- [ ] Analytics integration (Google Analytics, Plausible)
- [ ] Multilingual support (i18n)
- [ ] Print-friendly resume view
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Progressive Web App (PWA) support

### Technical Improvements

- [ ] Migrate to TypeScript
- [ ] Add unit tests (Vitest)
- [ ] Add E2E tests (Playwright)
- [ ] Implement image optimization (Sharp, WebP)
- [ ] Add Lighthouse CI to workflows
- [ ] Migrate to CSS Modules or Tailwind

---

## 🤝 Contributing Guidelines

### For AI Agents

When making changes to this portfolio:

1. **Always read this file first** to understand project structure
2. **Follow existing patterns** - check similar components for reference
3. **Test locally** before committing: `npm run dev`
4. **Update both data files** - `src/data/portfolioData.json` AND `public/portfolioData.json`
5. **Check for errors**: `npm run lint && npm run build`
6. **Preserve theme support** - use CSS variables, not hardcoded colors
7. **Don't break responsive design** - test mobile viewports
8. **Document significant changes** in this file

### For Human Developers

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes
4. Test: `npm run lint && npm run format:check && npm run build`
5. Commit: `git commit -m "feat: description"`
6. Push: `git push origin feature/my-feature`
7. Create Pull Request

**PR previews automatically deploy** via `.github/workflows/pr-preview.yml`

---

## 📞 Support & Resources

### Documentation

- **User Guide:** See `README.md` for end-user customization instructions
- **This File:** Technical reference for development

### External Documentation

- [React 19 Docs](https://react.dev)
- [Vite 7 Docs](https://vite.dev)
- [EmailJS Docs](https://www.emailjs.com/docs/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Skill Icons](https://skillicons.dev/)

### Contact

- **Owner:** Harish Kumar Balaji
- **GitHub:** https://github.com/harishkumarbalaji
- **Portfolio:** https://harishkumarbalaji.github.io/portfolio

---

## 🔄 Maintenance Checklist

### Regular Maintenance

- [ ] Update dependencies monthly: `npm update`
- [ ] Check for security vulnerabilities: `npm audit`
- [ ] Review and update content in `portfolioData.json`
- [ ] Test all external links (media, social, project links)
- [ ] Verify email form still works (EmailJS quota)
- [ ] Check GitHub Actions workflows still pass
- [ ] Test responsive design on various devices

### Quarterly Tasks

- [ ] Review and update `README.md` documentation
- [ ] Update this `AGENTS.md` file with new learnings
- [ ] Audit bundle size: `npm run build` and check output
- [ ] Run Lighthouse performance audit
- [ ] Update Node.js version in workflows if needed

---

## 📈 Analytics & Monitoring

### Current Setup

**No analytics currently configured.**

### Recommended Analytics (Future)

- **Google Analytics 4** - Free, comprehensive
- **Plausible** - Privacy-friendly, open-source
- **Simple Analytics** - Minimal, privacy-focused

**Implementation:** Add tracking script to `index.html` or `App.jsx`

---

## 💡 Pro Tips for AI Agents

### Speed Tips

1. **Batch operations** - Edit multiple files in one go, then test
2. **Use existing components** - Don't recreate patterns that exist
3. **Check similar sections** - If editing Timeline, reference Projects for patterns

### Debugging Tips

1. **Check browser console** - Most issues show errors there
2. **Verify data sync** - Always ensure both JSON files match
3. **Test base path** - Use `npm run preview` to test production-like environment
4. **Check mobile** - Many issues only appear on small screens

### Common Pitfalls

1. **Forgetting to update `public/portfolioData.json`** - Most common mistake!
2. **Hardcoding colors** - Always use CSS variables
3. **Breaking theme toggle** - Test both light and dark modes
4. **Wrong base path** - Remember `import.meta.env.BASE_URL` for all public assets
5. **Async state bugs** - Always check loading states and error handling

---

## 🏁 Quick Reference Card

```
📦 Install:           npm install
🚀 Dev Server:        npm run dev
🔨 Build:             npm run build
👀 Preview Build:     npm run preview
🚢 Deploy:            npm run deploy
🧹 Lint:              npm run lint
✨ Format:            npm run format

📝 Edit Content:      src/data/portfolioData.json
                      → Copy to public/portfolioData.json
🖼️  Add Media:         public/media/{category}/{file}
🎨 Edit Styles:       src/styles/{Component}.css
🌈 Theme Colors:      src/styles/theme.css
📧 Email Setup:       src/components/Contact.jsx (lines 37-47)
⚙️  Base Path:         vite.config.js & package.json

🌐 Live Site:         https://harishkumarbalaji.github.io/portfolio
📊 GitHub Actions:    .github/workflows/
🔑 Main Branch:       master
```

---

**End of Documentation** | Last Updated: March 15, 2026 | Version: 1.0.0
