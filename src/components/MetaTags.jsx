import { useEffect } from 'react';

const MetaTags = ({ metadata }) => {
  useEffect(() => {
    if (!metadata?.preview) return;

    const { title, description, image, url, type = 'website' } = metadata.preview;
    const baseUrl = import.meta.env.BASE_URL || '/';

    // Resolve image URL - handle both absolute and relative paths
    let fullImageUrl = image;
    if (image && !image.startsWith('http')) {
      // If relative path, prepend the full site URL
      const siteUrl = url || window.location.origin;
      const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const cleanImage = image.startsWith('/') ? image : `/${image}`;
      fullImageUrl = `${siteUrl}${cleanBase}${cleanImage}`;
    }

    // Update document title
    if (title) {
      document.title = title;
    }

    // Update or create meta tags
    const updateMetaTag = (property, content, isName = false) => {
      if (!content) return;

      const attribute = isName ? 'name' : 'property';
      let meta = document.querySelector(`meta[${attribute}="${property}"]`);

      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    };

    // Standard meta tags (used by browsers, search engines, and many platforms)
    updateMetaTag('description', description, true);
    updateMetaTag('author', metadata.author, true);

    // Open Graph Protocol (universal standard used by most platforms)
    // Used by: WhatsApp, Slack, LinkedIn, Facebook, Discord, iMessage, Email clients, etc.
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', fullImageUrl);
    updateMetaTag('og:image:alt', `${title} - Preview Image`);
    updateMetaTag('og:url', url || window.location.href);
    updateMetaTag('og:type', type);
    updateMetaTag('og:site_name', metadata.author || title);

    // Image dimensions (helps platforms render correctly)
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');

    // Twitter Card tags (Twitter/X specific, but also used as fallback by other platforms)
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', fullImageUrl, true);
    updateMetaTag('twitter:image:alt', `${title} - Preview Image`, true);

    // Additional universal meta tags
    updateMetaTag('robots', 'index, follow', true); // SEO
    updateMetaTag('language', 'English', true);
  }, [metadata]);

  return null; // This component doesn't render anything
};

export default MetaTags;
