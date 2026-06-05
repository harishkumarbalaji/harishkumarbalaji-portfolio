# 🚀 Modern Developer Portfolio

A stunning, fully customizable portfolio template built with React + Vite. Features a beautiful dark/light theme, animated sections, interactive timeline, media galleries, and contact form integration.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-4CAF50?style=for-the-badge)](https://harishkumarbalaji.github.io/portfolio)

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

### 🎨 **Design & UI**

- **Dark/Light Theme Toggle** - Seamless theme switching with system preference detection
- **Smooth Animations** - Scroll-triggered animations and micro-interactions
- **Responsive Design** - Looks great on desktop, tablet, and mobile
- **Scroll Progress Indicator** - Visual progress bar as users scroll
- **Modern Typography** - Clean, professional fonts with proper hierarchy

### 📄 **Sections**

| Section      | Description                                                            |
| ------------ | ---------------------------------------------------------------------- |
| **Hero**     | Eye-catching intro with animated role typing, stats, and profile image |
| **About**    | Personal story with formatted paragraphs and emphasis                  |
| **Projects** | Horizontal timeline with expandable descriptions and media gallery     |
| **Skills**   | Categorized skill badges with icons                                    |
| **Timeline** | Experience & Education with company logos and media attachments        |
| **Contact**  | Working contact form with EmailJS integration                          |

### 🔗 **Shareable project & experience links**

Each project card and timeline (experience/education) row has a **share** control that copies a deep link (or opens the system share sheet on supported devices). When someone opens that link, the portfolio scrolls to the matching tile and briefly highlights it.

| Link type              | Example hash                         | Tile id in JSON                                                               |
| ---------------------- | ------------------------------------ | ----------------------------------------------------------------------------- |
| Project                | `#project/1`                         | `projects[].id` (number)                                                      |
| Experience / education | `#timeline/exp-0`, `#timeline/edu-1` | Order in `experience` / `education` arrays (`exp-0` = first experience, etc.) |

Full URL shape: `https://YOUR_USERNAME.github.io/portfolio/#project/2` (path prefix follows your `vite.config.js` `base`).

### 🎬 **Media Gallery Support**

The portfolio supports embedding various media types in Projects and Timeline:

| Media Type        | Support                               |
| ----------------- | ------------------------------------- |
| 🎥 YouTube Videos | Embedded player with auto-detect      |
| 📊 Google Slides  | Live preview with auto-loop slideshow |
| 💼 LinkedIn Posts | Embedded post preview                 |
| 📁 Google Drive   | Video/Image embedding                 |
| 📁 OneDrive       | Video/Image embedding                 |
| 🖼️ Local Images   | Direct image display                  |
| 🎬 Local Videos   | Video player with controls            |
| 🔗 External Links | Styled link cards with favicon        |

### 📬 **Contact Form**

- Integrated with [EmailJS](https://www.emailjs.com/) for serverless email delivery
- Form validation and success/error notifications
- No backend required!

---

## 🛠️ Tech Stack

- **Frontend:** React 19, JavaScript (ES6+)
- **Build Tool:** Vite 6
- **Styling:** CSS3 with CSS Variables
- **Icons:** React Icons, Skill Icons API
- **Email:** EmailJS
- **Deployment:** GitHub Pages

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

---

## 🌐 Deploy to GitHub Pages

Follow these steps to fork this repository and deploy your own portfolio to GitHub Pages.

### Step 1: Fork the Repository

1. Click the **Fork** button at the top right of this repository
2. This creates a copy under your GitHub account

### Step 2: Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
npm install
```

### Step 3: Configure for Your GitHub Pages

You need to update two files with your repository details:

#### 1. Update `package.json`

Change the `homepage` field to match your GitHub username and repository name:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME",
  ...
}
```

#### 2. Update `vite.config.js`

Change the `base` path to match your repository name:

```javascript
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
});
```

> ⚠️ **Important:** The repository name in both files must match exactly, including case sensitivity!

### Step 4: Customize Your Content

Edit `src/data/portfolioData.json` with your personal information (see [Customization Guide](#-customization-guide) below).

> **Note:** After editing, copy the updated file to `public/portfolioData.json` to ensure changes are reflected.

### Step 5: Deploy to GitHub Pages

```bash
# Build and deploy in one command
npm run deploy
```

This command will:

1. Run `npm run build` (creates production build in `dist/` folder)
2. Push the `dist/` folder to a `gh-pages` branch in your repository

### Step 6: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Select the **gh-pages** branch and **/ (root)** folder
5. Click **Save**

Your portfolio will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

> 📝 **Note:** It may take a few minutes for GitHub Pages to deploy your site after the first push.

### Updating Your Portfolio

After making changes to your portfolio:

```bash
# Commit your changes
git add .
git commit -m "Update portfolio content"
git push origin main

# Deploy the updated version
npm run deploy
```

---

## 📝 Customization Guide

### 📍 Main Data File

All portfolio content is controlled by a single JSON file:

```
src/data/portfolioData.json
```

> **Important:** After editing, copy the updated file to `public/portfolioData.json` to ensure changes are reflected.

### 🔧 What to Edit

#### 1. **Personal Information**

```json
{
  "metadata": {
    "title": "Your Name - Your Title",
    "description": "Your tagline...",
    "author": "Your Name"
  },
  "hero": {
    "name": "Your Name",
    "profileImage": {
      "light": "/media/profile/profile-image.jpg",
      "dark": "/media/profile/profile-image-dark.jpg",
      "alt": "Your Name"
    },
    "roles": ["Role 1", "Role 2", "Role 3"],
    "description": "Your intro paragraph...",
    "stats": [{ "number": "5+", "label": "Years Experience" }]
  }
}
```

#### 2. **Link Preview Configuration (Universal)**

When you share your portfolio link anywhere (WhatsApp, Slack, email, messaging apps, etc.), this controls what preview image and text appears. Uses the Open Graph Protocol standard which is supported by virtually all platforms.

```json
{
  "metadata": {
    "preview": {
      "title": "Your Name - Your Title",
      "description": "Short compelling description for social media previews (155 characters recommended)",
      "image": "/media/profile/profile-image.jpg",
      "url": "https://yourusername.github.io/your-repo-name",
      "type": "website"
    }
  }
}
```

**Configuration Options:**

- **`title`**: The title shown in link previews (appears in bold)
- **`description`**: A short description (keep it under 155 characters for best results)
- **`image`**: Path to your preview image (recommended size: 1200×630px for best quality)
  - Use an absolute path starting with `/media/` for local images
  - Or use a full URL: `https://example.com/image.jpg`
- **`url`**: Your full portfolio URL (must match your deployed site)
- **`type`**: Usually `"website"` (or `"profile"` for personal sites)

**Best Practices:**

- **Image Size**: 1200×630px (2:1 ratio) works universally across all platforms
- **Image Format**: JPG or PNG (under 5MB)
- **Description Length**: 50-155 characters optimal for most platforms
- **Test Your Preview**: Simply share your link in any messaging app (WhatsApp, Slack, etc.) to see how it looks

> 💡 **Tip:** Some platforms cache previews for 24-48 hours. If you update your settings, you may need to wait or use Open Graph debugging tools to force a refresh.

#### 3. **About Section**

```json
{
  "about": {
    "content": ["Paragraph 1 with <em>emphasis</em> and <strong>bold</strong>...", "Paragraph 2..."]
  }
}
```

#### 4. **Projects**

> **Optional links:** Add `"github"` only when you have a repository URL; omit the field and the code icon is hidden. Demos and videos usually belong in `gallery` (click cover or thumbnails to expand). Use `"live"` only if you need a separate external-link button for a URL that is not in the gallery.

```json
{
  "projects": [
    {
      "id": 1,
      "title": "Project Name",
      "year": "Jan 2024 - Present",
      "description": "Full description...",
      "technologies": ["React", "Node.js"],
      "highlights": ["Key Feature 1", "Metric 2"],
      "github": "https://github.com/...",
      "gallery": [
        { "title": "Demo Video", "url": "https://youtube.com/...", "type": "youtube" },
        {
          "title": "Presentation",
          "url": "https://docs.google.com/presentation/...",
          "type": "google_slides"
        }
      ]
    }
  ]
}
```

#### 5. **Experience & Education**

```json
{
  "experience": [
    {
      "year": "2023 - Present",
      "title": "Job Title",
      "company": "Company Name",
      "website": "https://company.com",
      "location": "City, Country",
      "logo": "/media/logos/Company-logo.png",
      "icon": "🏢",
      "technologies": ["Skill1", "Skill2"],
      "details": ["Achievement 1", "Achievement 2"],
      "highlights": ["Key Metric 1", "Technology Used"],
      "gallery": [
        { "title": "LinkedIn Post", "url": "https://linkedin.com/...", "type": "linkedin" },
        { "title": "Demo Video", "url": "/media/experience/company/demo.mp4", "type": "video" }
      ]
    }
  ],
  "education": [
    {
      "year": "2020 - 2024",
      "title": "Degree Name",
      "company": "University Name",
      "website": "https://university.edu",
      "location": "City, Country",
      "logo": "/media/logos/University-logo.png",
      "icon": "🎓",
      "details": ["GPA: 4.0", "Relevant courses..."],
      "highlights": ["4.0 GPA", "Key Course"],
      "gallery": []
    }
  ]
}
```

#### 6. **Skills**

```json
{
  "skills": [
    {
      "category": "Category Name",
      "skills": [{ "name": "Skill Name", "icon": "https://skillicons.dev/icons?i=react" }]
    }
  ]
}
```

> 💡 **Tip:** Find icons at [skillicons.dev](https://skillicons.dev/)

#### 7. **Contact & Social Links**

```json
{
  "contact": {
    "details": [
      { "type": "email", "value": "you@email.com" },
      { "type": "phone", "value": "+1 234 567 8900" },
      { "type": "linkedin", "value": "linkedin.com/in/you", "url": "https://..." }
    ]
  },
  "social": {
    "links": [
      { "name": "GitHub", "url": "https://github.com/you", "icon": "github" },
      {
        "name": "Resume",
        "url": "https://drive.google.com/file/d/YOUR_FILE_ID/view",
        "icon": "resume"
      }
    ]
  }
}
```

#### 8. **Resume Button (Split View + Download)**

The resume button is a **split button** with two actions:

- **View Resume** (left side, 70%) - Opens the resume in a new tab
- **Download** (right side, 30%) - Directly downloads the resume

The code **automatically extracts** the file ID from your Google Drive link and generates both view and download URLs!

**Option A: Google Drive (Recommended)**

```json
{
  "name": "Resume",
  "url": "https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=drive_link",
  "icon": "resume"
}
```

- Just paste your Google Drive share link - **no need to manually create download URLs!**
- The code automatically computes the download URL from the file ID
- Make sure your file is publicly accessible ("Anyone with the link can view")

> 💡 **How to get your Google Drive link:**
>
> 1. Upload your resume to Google Drive
> 2. Right-click → Share → "Anyone with the link"
> 3. Copy the link and paste it in the JSON

**Option B: Local PDF File**

```json
{
  "name": "Resume",
  "url": "/Your_Resume.pdf",
  "icon": "resume",
  "download": true
}
```

- Place your PDF file in the `public/` folder
- Set `"download": true` for local file downloads
- Both View and Download buttons will work with the local file

### 🖼️ Assets & Media Organization

The `public/media/` folder is organized for easy management of all your portfolio assets:

```
public/
├── media/
│   ├── profile/                    # Your profile photos
│   │   ├── profile-image.jpg       # Light theme photo
│   │   └── profile-image-dark.jpg  # Dark theme photo
│   │
│   ├── logos/                      # Company & institution logos
│   │   ├── Company-logo.png
│   │   └── University-logo.png
│   │
│   ├── experience/                 # Media for work experience
│   │   ├── zipline/               # Images, videos, gifs for Zipline
│   │
│   ├── education/                  # Media for education
│   │   ├── uiuc/
│   │   └── anna-university/
│   │
│   └── projects/                   # Media for projects
│       ├── aws-deepracer/
│
├── favicon.svg                     # Browser tab icon
└── Your_Resume.pdf                 # Local resume (optional)
```

#### How to Reference Media in JSON

When adding media paths in `portfolioData.json`, use paths relative to the `public/` folder:

```json
{
  "gallery": [
    {
      "title": "Project Demo",
      "url": "/media/experience/zipline/demo.gif",
      "type": "image"
    }
  ]
}
```

**Path Guidelines:**

- ✅ Start with `/media/` (recommended): `/media/experience/zipline/demo.gif`
- ✅ Or without leading slash: `media/experience/zipline/demo.gif`
- ✅ External URLs work too: `https://example.com/image.jpg`
- ❌ Don't include `public/` in the path

> 💡 **Tip:** The app automatically handles path resolution for both local development and GitHub Pages deployment. Just make sure your files are in the `public/media/` folder!

#### Configuring Profile Images

Add your profile photos to `public/media/profile/` and reference them in JSON:

```json
{
  "hero": {
    "profileImage": {
      "light": "/media/profile/your-photo.jpg",
      "dark": "/media/profile/your-photo-dark.jpg",
      "alt": "Your Name"
    }
  }
}
```

#### Configuring Company/Institution Logos

Add logos to `public/media/logos/` and reference them in each experience/education entry:

```json
{
  "experience": [{
    "company": "Company Name",
    "logo": "/media/logos/Company-logo.png",
    ...
  }]
}
```

#### Adding Local Media to Gallery

To add local images, videos, or GIFs to your experience/projects:

1. **Add your files** to the appropriate folder (e.g., `public/media/experience/company-name/demo.mp4`)

2. **Reference in JSON** with the correct type:

```json
{
  "gallery": [
    { "title": "Demo Video", "url": "/media/experience/company-name/demo.mp4", "type": "video" },
    {
      "title": "Screenshot",
      "url": "/media/experience/company-name/screenshot.png",
      "type": "image"
    },
    { "title": "Animation", "url": "/media/experience/company-name/animation.gif", "type": "image" }
  ]
}
```

#### Supported Media Types

| Type           | File Extensions                 | JSON `type` Value |
| -------------- | ------------------------------- | ----------------- |
| Images         | `.jpg`, `.png`, `.gif`, `.webp` | `"image"`         |
| Videos         | `.mp4`, `.webm`, `.mov`         | `"video"`         |
| YouTube        | YouTube URLs                    | `"youtube"`       |
| Google Slides  | Google Slides URLs              | `"google_slides"` |
| LinkedIn       | LinkedIn post URLs              | `"linkedin"`      |
| External Links | Any URL                         | `"link"`          |

> 💡 **Tip:** Use Google Drive for your resume - just paste the share link and the code handles the rest! See [Resume Button](#7-resume-button-split-view--download) for details.

### 📧 EmailJS Setup

The contact form uses [EmailJS](https://www.emailjs.com/) to send emails directly from the browser — no backend required. Follow these steps to connect it to your own email:

#### 1. Create a Free Account

Sign up at [emailjs.com](https://www.emailjs.com/) (free tier: 200 emails/month).

#### 2. Add an Email Service

1. Go to **Email Services** → **Add New Service**
2. Choose your email provider (Gmail, Outlook, etc.) and connect your account
3. Note down your **Service ID** (e.g. `service_abc1234`)

#### 3. Create an Email Template

1. Go to **Email Templates** → **Create New Template**
2. Set the **Subject** to: `{{subject}}`
3. In the email body, use these template variables:

| Variable         | Description                       |
| ---------------- | --------------------------------- |
| `{{from_name}}`  | Name of the person contacting you |
| `{{from_email}}` | Their email address               |
| `{{message}}`    | The message body                  |
| `{{subject}}`    | Auto-generated subject line       |
| `{{to_name}}`    | Your name (used in greeting)      |

4. On the right sidebar, set:
   - **Reply To**: `{{from_email}}`
   - **From Name**: `{{from_name}}`
5. Note down your **Template ID** (found in the **Settings** tab)

#### 4. Get Your Public Key

Go to **Account** → **General** → **API keys** and copy your **Public Key**.

#### 5. Update the Code

In `src/components/Contact.jsx`, replace the three credentials in the `emailjs.send()` call:

```javascript
const result = await emailjs.send(
  'YOUR_SERVICE_ID', // ← Your Service ID
  'YOUR_TEMPLATE_ID', // ← Your Template ID
  {
    from_name: formData.name,
    from_email: formData.email,
    message: formData.message,
    subject: `[PORTFOLIO] New message from ${formData.name}`,
    to_name: 'YOUR NAME', // ← Your name
  },
  'YOUR_PUBLIC_KEY' // ← Your Public Key
);
```

> 💡 **Note:** The EmailJS Public Key is designed to be used in client-side code — it's safe to commit to your repository. EmailJS uses domain restrictions and rate limiting for security.

---

## 📁 Project Structure

```
├── public/
│   ├── media/                   # All media assets (see Assets section above)
│   │   ├── profile/             # Profile photos
│   │   ├── logos/               # Company & institution logos
│   │   ├── experience/          # Experience media files
│   │   ├── education/           # Education media files
│   │   └── projects/            # Project media files
│   ├── portfolioData.json       # Production data file
│   └── favicon.svg              # Browser icon
├── src/
│   ├── components/              # React components
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   ├── ShareTileButton.jsx
│   │   ├── Skills.jsx
│   │   ├── Timeline.jsx
│   │   ├── Contact.jsx
│   │   └── ...
│   ├── styles/                  # Component CSS files
│   ├── data/
│   │   └── portfolioData.json   # Source data file (edit this!)
│   ├── hooks/                   # useShareLinkBootstrap, useShareLinkNavigation
│   ├── utils/
│   │   └── shareLink.js         # Deep-link hash build/parse and scroll
│   ├── context/
│   │   └── ThemeContext.jsx     # Theme management
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js               # Vite config (update base path here)
├── package.json                 # Dependencies & scripts (update homepage here)
```

---

## 🌐 Deployment Options

### GitHub Pages (Recommended for Free Hosting)

See the [Deploy to GitHub Pages](#-deploy-to-github-pages) section above.

### Manual Deployment

```bash
npm run build
# Upload the 'dist' folder to your hosting provider
```

---

## 🎨 Customizing Styles

### Theme Colors

Edit CSS variables in `src/styles/theme.css`:

```css
:root {
  --primary-color: #your-color;
  --accent-color: #your-accent;
  --background-color: #your-bg;
}

[data-theme='dark'] {
  --primary-color: #dark-theme-color;
  /* ... */
}
```

### Component Styles

Each component has its own CSS file in `src/styles/`:

- `Hero.css`, `About.css`, `Projects.css`, `Skills.css`, `Timeline.css`, `Contact.css`

---

## ❓ Troubleshooting

### GitHub Pages Issues

| Problem                               | Solution                                                                                                                                           |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 404 error on page load                | Ensure `base` in `vite.config.js` matches your repo name exactly                                                                                   |
| Blank page                            | Check browser console for errors; verify `homepage` in `package.json`                                                                              |
| Images/media not loading after deploy | The app automatically handles media paths - ensure your `vite.config.js` has the correct `base` path and media files are in `public/media/` folder |
| Changes not reflecting                | Clear browser cache, run `npm run deploy` again, or wait a few minutes for GitHub Pages to update                                                  |

### Media Path Configuration

**How it works:**

- Media files in `public/media/` are automatically served with the correct base path
- The app uses `import.meta.env.BASE_URL` to resolve local media paths for GitHub Pages
- External URLs (starting with `http://` or `https://`) are used as-is
- In development (`npm run dev`), paths work without the base URL
- In production (after `npm run deploy`), paths automatically include `/YOUR_REPO_NAME/`

**Important:**

- Always use paths relative to `public/` in your JSON files, e.g., `/media/profile/profile-image.jpg`
- The leading `/` is optional - the app will handle it correctly
- If media works locally but not after deploy, verify the `base` path in `vite.config.js` matches your repository name exactly

### Common Mistakes

- **Mismatched repo name**: The repository name must be identical in `package.json` (homepage) and `vite.config.js` (base)
- **Case sensitivity**: GitHub Pages URLs are case-sensitive
- **Missing gh-pages branch**: Run `npm run deploy` to create and populate the branch

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [React Icons](https://react-icons.github.io/react-icons/)
- [Skill Icons](https://skillicons.dev/)
- [EmailJS](https://www.emailjs.com/)
- [Vite](https://vitejs.dev/)
- [gh-pages](https://www.npmjs.com/package/gh-pages)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by [Harish Kumar Balaji](https://github.com/harishkumarbalaji)

</div>
