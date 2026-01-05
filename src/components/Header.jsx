import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import SocialLinks from './SocialLinks';
import '../styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navData, setNavData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}portfolioData.json`)
      .then((res) => res.json())
      .then((data) => {
        setNavData(data.navigation);
      });
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  if (!navData) return null;

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={scrollToTop}>
          <h2>{navData.logo}</h2>
        </div>
        
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            {navData.menuItems.map((item) => (
              <li key={item.id}>
                <button onClick={() => scrollToSection(item.id)}>
                  {item.label}
                </button>
              </li>
            ))}
            <li className="social-links-container">
              <SocialLinks size="medium" />
            </li>

          </ul>
        </nav>

        <div className="header-controls">
          <ThemeToggle />
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 