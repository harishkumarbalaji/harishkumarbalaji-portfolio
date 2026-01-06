import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import SocialLinks from './SocialLinks';
import '../styles/Hero.css';

// Helper function to extract Google Drive file ID and generate download URL
const getGoogleDriveUrls = (url) => {
  if (!url) return null;
  
  // Match Google Drive file ID from various URL formats
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,           // /file/d/FILE_ID/view
    /id=([a-zA-Z0-9_-]+)/,                    // ?id=FILE_ID or &id=FILE_ID
    /\/d\/([a-zA-Z0-9_-]+)/,                  // /d/FILE_ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const fileId = match[1];
      return {
        viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
        downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
        fileId
      };
    }
  }
  
  return null;
};

const Hero = () => {
  const { isDark } = useTheme();
  const [currentText, setCurrentText] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const [heroData, setHeroData] = useState(null);
  const [texts, setTexts] = useState([]);
  const [resumeLink, setResumeLink] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}portfolioData.json`)
      .then((res) => res.json())
      .then((data) => {
        setHeroData(data.hero);
        setTexts(data.hero.roles);
        // Find the resume link from social links
        const resume = data.social?.links?.find(link => link.icon === 'resume');
        setResumeLink(resume);
      });
  }, []);



  useEffect(() => {
    if (texts.length === 0) return;
    
    let timeout;
    if (typing) {
      if (displayed.length < texts[currentText].length) {
        timeout = setTimeout(() => {
          setDisplayed(texts[currentText].slice(0, displayed.length + 1));
        }, 60);
      } else {
        timeout = setTimeout(() => setTyping(false), 1200);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 30);
      } else {
        setTyping(true);
        setCurrentText((prev) => (prev + 1) % texts.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, currentText, texts]);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!heroData) return null;

  return (
    <section id="home" className="hero">
      
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-greeting">
              <span className="wave-emoji">{heroData.waveEmoji}</span>
              <span className="greeting-text">{heroData.greeting}</span>
            </div>
            
            <h1 className="hero-title">
              <span className="name-highlight">{heroData.name}</span>
            </h1>
            
            <div className="hero-role">
              <span className="role-prefix">I'm a </span>
              <span className="role-text">{displayed}<span className="cursor">|</span></span>
            </div>
            
            <p className="hero-description">
              {heroData.description}
            </p>
            
            <div className="hero-stats">
              {heroData.stats.map((stat, index) => (
                <div key={index} className="stat">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
            
            <div className="hero-buttons">
              {heroData.buttons.map((button, index) => (
                <button 
                  key={index}
                  className={`btn ${button.action === 'contact' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={button.action === 'contact' ? scrollToContact : () => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
                >
                  <span>{button.text}</span>
                  <span className="btn-icon">{button.icon}</span>
                </button>
              ))}
              
              {/* Resume Split Button - View (70%) + Download (30%) */}
              {resumeLink && (() => {
                const driveUrls = getGoogleDriveUrls(resumeLink.url);
                const isGoogleDrive = !!driveUrls;
                
                return (
                  <div className="resume-split-btn">
                    <button 
                      className="resume-view-btn"
                      onClick={() => {
                        if (isGoogleDrive) {
                          window.open(driveUrls.viewUrl, '_blank', 'noopener,noreferrer');
                        } else if (resumeLink.download) {
                          // For local files, open in new tab to view
                          window.open(`${import.meta.env.BASE_URL}${resumeLink.url.replace(/^\//, '')}`, '_blank');
                        } else {
                          window.open(resumeLink.url, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      title="View Resume"
                    >
                      <span>View Resume</span>
                    </button>
                    <button 
                      className="resume-download-btn"
                      onClick={() => {
                        if (isGoogleDrive) {
                          window.open(driveUrls.downloadUrl, '_blank', 'noopener,noreferrer');
                        } else if (resumeLink.download) {
                          // Download local file
                          const link = document.createElement('a');
                          link.href = `${import.meta.env.BASE_URL}${resumeLink.url.replace(/^\//, '')}`;
                          link.download = resumeLink.filename || resumeLink.url.split('/').pop();
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          window.open(resumeLink.url, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      title="Download Resume"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-image-container">
              <img 
                src={isDark 
                  ? `${import.meta.env.BASE_URL}${heroData.profileImage?.dark?.replace(/^\//, '') || 'media/profile/profile-image-dark.jpg'}` 
                  : `${import.meta.env.BASE_URL}${heroData.profileImage?.light?.replace(/^\//, '') || 'media/profile/profile-image.jpg'}`
                } 
                alt={heroData.profileImage?.alt || heroData.name} 
                className="hero-profile-image"
              />
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <div className="scroll-text">{heroData.scrollIndicator.text}</div>
          <div className="scroll-arrow"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 