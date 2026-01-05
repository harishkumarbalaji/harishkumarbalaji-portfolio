import { useEffect, useState } from 'react';
import '../styles/About.css';

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}portfolioData.json`)
      .then((res) => res.json())
      .then((data) => {
        setAboutData(data.about);
      });
  }, []);

  if (!aboutData) return null;

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">{aboutData.title}</h2>
        <div className="about-content">
          <div className="about-text">
            {aboutData.content.map((paragraph, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 