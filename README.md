# 🚀 Modern Developer Portfolio

A stunning, fully customizable portfolio template built with React + Vite. Features a beautiful dark/light theme, animated sections, interactive timeline, media galleries, and contact form integration.

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
| Section | Description |
|---------|-------------|
| **Hero** | Eye-catching intro with animated role typing, stats, and profile image |
| **About** | Personal story with formatted paragraphs and emphasis |
| **Projects** | Horizontal timeline with expandable descriptions and media gallery |
| **Skills** | Categorized skill badges with icons |
| **Timeline** | Experience & Education with company logos and media attachments |
| **Contact** | Working contact form with EmailJS integration |

### 🎬 **Media Gallery Support**
The portfolio supports embedding various media types in Projects and Timeline:

| Media Type | Support |
|------------|---------|
| 🎥 YouTube Videos | Embedded player with auto-detect |
| 📊 Google Slides | Live preview with auto-loop slideshow |
| 💼 LinkedIn Posts | Embedded post preview |
| 📁 Google Drive | Video/Image embedding |
| 📁 OneDrive | Video/Image embedding |
| 🖼️ Local Images | Direct image display |
| 🎬 Local Videos | Video player with controls |
| 🔗 External Links | Styled link cards with favicon |

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
- **Deployment:** Vercel (configured)

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
    "roles": ["Role 1", "Role 2", "Role 3"],
    "description": "Your intro paragraph...",
    "stats": [
      { "number": "5+", "label": "Years Experience" }
    ]
  }
}
```

#### 2. **About Section**
```json
{
  "about": {
    "content": [
      "Paragraph 1 with <em>emphasis</em> and <strong>bold</strong>...",
      "Paragraph 2..."
    ]
  }
}
```

#### 3. **Projects**
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
      "live": "https://...",
      "gallery": [
        { "title": "Demo Video", "url": "https://youtube.com/...", "type": "youtube" },
        { "title": "Presentation", "url": "https://docs.google.com/presentation/...", "type": "google_slides" }
      ]
    }
  ]
}
```

#### 4. **Experience & Education**
```json
{
  "experience": [
    {
      "year": "2023 - Present",
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "technologies": ["Skill1", "Skill2"],
      "details": ["Achievement 1", "Achievement 2"],
      "highlights": ["Key Metric 1", "Technology Used"],
      "gallery": [
        { "title": "LinkedIn Post", "url": "https://linkedin.com/...", "type": "linkedin" }
      ]
    }
  ],
  "education": [
    {
      "year": "2020 - 2024",
      "title": "Degree Name",
      "company": "University Name",
      "location": "City, Country",
      "details": ["GPA: 4.0", "Relevant courses..."],
      "highlights": ["4.0 GPA", "Key Course"]
    }
  ]
}
```

#### 5. **Skills**
```json
{
  "skills": [
    {
      "category": "Category Name",
      "skills": [
        { "name": "Skill Name", "icon": "https://skillicons.dev/icons?i=react" }
      ]
    }
  ]
}
```

> 💡 **Tip:** Find icons at [skillicons.dev](https://skillicons.dev/)

#### 6. **Contact & Social Links**
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
      { "name": "Download Resume", "url": "/Your_Resume.pdf", "icon": "resume", "download": true }
    ]
  }
}
```

### 🖼️ Assets to Replace

| File | Location | Purpose |
|------|----------|---------|
| `profile-image.jpg` | `public/` | Profile photo (light theme) |
| `profile-image-dark.jpg` | `public/` | Profile photo (dark theme) |
| `Your_Resume.pdf` | `public/` | Downloadable resume |
| `favicon.svg` | `public/` | Browser tab icon |
| `Company-logo.png` | `public/` | Company logos for timeline |

### 📧 EmailJS Setup

1. Create a free account at [EmailJS](https://www.emailjs.com/)
2. Create an email service and template
3. Update `src/components/Contact.jsx`:

```javascript
emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  templateParams,
  'YOUR_PUBLIC_KEY'
);
```

---

## 📁 Project Structure

```
├── public/
│   ├── portfolioData.json    # Production data file
│   ├── profile-image.jpg     # Profile images
│   ├── favicon.svg           # Browser icon
│   └── *.png                 # Company logos
├── src/
│   ├── components/           # React components
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   ├── Skills.jsx
│   │   ├── Timeline.jsx
│   │   ├── Contact.jsx
│   │   └── ...
│   ├── styles/               # Component CSS files
│   ├── data/
│   │   └── portfolioData.json  # Source data file
│   ├── context/
│   │   └── ThemeContext.jsx  # Theme management
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── vercel.json               # Vercel deployment config
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with one click!

The `vercel.json` is already configured for optimal deployment.

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

[data-theme="dark"] {
  --primary-color: #dark-theme-color;
  /* ... */
}
```

### Component Styles
Each component has its own CSS file in `src/styles/`:
- `Hero.css`, `About.css`, `Projects.css`, `Skills.css`, `Timeline.css`, `Contact.css`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [React Icons](https://react-icons.github.io/react-icons/)
- [Skill Icons](https://skillicons.dev/)
- [EmailJS](https://www.emailjs.com/)
- [Vite](https://vitejs.dev/)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by [Harish Kumar Balaji](https://github.com/harishkumarbalaji)

</div>
