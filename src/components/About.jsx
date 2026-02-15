import { useEffect, useState, useRef } from 'react';
import '../styles/About.css';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageOrientations, setImageOrientations] = useState({});
  const autoPlayRef = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}portfolioData.json`)
      .then((res) => res.json())
      .then((data) => {
        setAboutData(data.about);
      });
  }, []);

  // Detect image orientations
  useEffect(() => {
    if (!aboutData?.carousel?.images) return;

    const loadImageOrientations = async () => {
      const orientations = {};

      for (const imagePath of aboutData.carousel.images) {
        const img = new Image();
        const fullPath = `${import.meta.env.BASE_URL}${imagePath.replace(/^\//, '')}`;

        await new Promise((resolve) => {
          img.onload = () => {
            // Determine if portrait (height > width)
            orientations[imagePath] = img.height > img.width ? 'portrait' : 'landscape';
            resolve();
          };
          img.onerror = () => {
            // Default to landscape if image fails to load
            orientations[imagePath] = 'landscape';
            resolve();
          };
          img.src = fullPath;
        });
      }

      setImageOrientations(orientations);
    };

    loadImageOrientations();
  }, [aboutData]);

  // Auto-play carousel
  useEffect(() => {
    if (!aboutData?.carousel || isHovered) return;

    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev === aboutData.carousel.images.length - 1 ? 0 : prev + 1));
    }, aboutData.carousel.autoPlayInterval || 4000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [aboutData, isHovered]);

  const handleCardClick = (index) => {
    setActiveIndex(index);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? aboutData.carousel.images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === aboutData.carousel.images.length - 1 ? 0 : prev + 1));
  };

  if (!aboutData) return null;

  const images = aboutData.carousel?.images || [];

  return (
    <section id="about" className="about">
      <div className="about-container">
        <h2 className="section-title">{aboutData.title}</h2>

        <div className="about-layout">
          {/* Horizontal Card Carousel - Left */}
          {images.length > 0 && (
            <div
              className="carousel-container"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="carousel-track">
                {images.map((image, index) => {
                  // Calculate circular offset for continuous carousel
                  let offset = index - activeIndex;
                  const total = images.length;

                  // Wrap around for continuous effect
                  if (offset > total / 2) {
                    offset -= total;
                  } else if (offset < -total / 2) {
                    offset += total;
                  }

                  const isActive = index === activeIndex;

                  const orientation = imageOrientations[image] || 'landscape';

                  return (
                    <div
                      key={index}
                      className={`carousel-card ${isActive ? 'active' : ''}`}
                      data-orientation={orientation}
                      style={{
                        '--offset': offset,
                        '--total': total,
                      }}
                      onClick={() => handleCardClick(index)}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}${image.replace(/^\//, '')}`}
                        alt={`Gallery ${index + 1}`}
                        className="carousel-image"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Dot Indicators with Navigation Arrows */}
              <div className="carousel-indicators">
                <button
                  className="carousel-nav carousel-nav-prev"
                  onClick={handlePrev}
                  aria-label="Previous image"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
                    onClick={() => handleCardClick(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}

                <button
                  className="carousel-nav carousel-nav-next"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Content - Right */}
          <div className="about-content">
            <div className="about-text">
              {aboutData.content.map((paragraph, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
