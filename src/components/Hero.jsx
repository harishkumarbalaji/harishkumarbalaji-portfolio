import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import SocialLinks from './SocialLinks';
import '../styles/Hero.css';

const Hero = () => {
  const { isDark } = useTheme();
  const [currentText, setCurrentText] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const [heroData, setHeroData] = useState(null);
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    fetch('/portfolioData.json')
      .then((res) => res.json())
      .then((data) => {
        setHeroData(data.hero);
        setTexts(data.hero.roles);
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
              
              {/* Download Resume Button */}
              <button 
                className="btn btn-secondary download-resume-btn"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/Harish_Kumar_Balaji_Resume.pdf';
                  link.download = 'Harish_Kumar_Balaji_Resume.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <span>Download Resume</span>
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-image-container">
              <img 
                src={isDark ? "/profile-image-dark.jpg" : "/profile-image.jpg"} 
                alt="Harish Kumar Balaji" 
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