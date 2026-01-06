import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/SocialLinks.css';

const SocialLinks = ({ className = '', size = 'medium' }) => {
  const { isDark } = useTheme();
  const [socialData, setSocialData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}portfolioData.json`)
      .then((res) => res.json())
      .then((data) => {
        setSocialData(data.social);
      });
  }, []);

  useEffect(() => {
    // Initialize Bootstrap tooltips
    if (window.bootstrap) {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl));
    }
  }, [socialData]);

  const getIconSvg = (iconType) => {
    switch (iconType) {
      case 'linkedin':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'github':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      case 'resume':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M18 20H6V4H13V9H18V20Z"/>
            <path d="M12 18V12M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        );
      case 'portfolio':
      case 'blinq':
      case 'card':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18Z"/>
            <circle cx="9" cy="10" r="2"/>
            <path d="M9 14C7 14 5 15 5 16V17H13V16C13 15 11 14 9 14Z"/>
            <path d="M15 9H19M15 12H19M15 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
        );
      case 'link':
      case 'website':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  if (!socialData) return null;

  return (
    <div className={`social-links ${className} social-links-${size}`}>
      {socialData.links.map((link, index) => {
        // Handle different link types:
        // - download: true → Downloads local file (e.g., /resume.pdf)
        // - external: true → Opens external URL in new tab (e.g., Google Drive)
        // - neither → Opens in new tab (default behavior)
        const isDownload = link.download === true;
        const isExternal = link.external === true || (!isDownload && link.url.startsWith('http'));
        
        return (
          <a
            key={link.name}
            href={isDownload ? `${import.meta.env.BASE_URL}${link.url.replace(/^\//, '')}` : link.url}
            target={isDownload ? "_self" : "_blank"}
            rel={isDownload ? "" : "noopener noreferrer"}
            className="social-link"
            aria-label={link.name}
            download={isDownload ? link.filename || link.url.split('/').pop() : undefined}
            style={{
              '--delay': `${index * 0.1}s`
            }}
          >
            <div className="social-icon">
              {getIconSvg(link.icon)}
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks; 