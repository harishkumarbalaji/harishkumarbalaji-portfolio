import { useEffect, useRef, useState } from 'react';
import '../styles/Skills.css';

const Skills = () => {
  const [categories, setCategories] = useState([]);
  const [sectionTitle, setSectionTitle] = useState('');
  const gridRefs = useRef([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}portfolioData.json`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.skills || []);
        setSectionTitle(data.sections.skills.title);
      });
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );
    gridRefs.current.forEach((ref) => {
      if (ref) {
        const icons = ref.querySelectorAll('.skill-icon-modern');
        icons.forEach((el) => observer.observe(el));
      }
    });
    return () => observer.disconnect();
  }, [categories]);

  return (
    <section id="skills" className="skills skills-modern">
      <div className="container">
        <h2 className="section-title">{sectionTitle}</h2>
        {categories.filter(cat => Array.isArray(cat.skills)).map((cat, idx) => (
          <div className="skills-category-group" key={cat.category}>
            <h3 className="skills-category-title">{cat.category}</h3>
            <div
              className="skills-icon-modern-grid"
              ref={el => (gridRefs.current[idx] = el)}
            >
              {cat.skills.map((skill, sidx) => (
                <div
                  key={skill.name}
                  className="skill-icon-modern"
                  style={{ '--animation-delay': `${sidx * 0.04}s` }}
                  title={skill.name}
                >
                  <img src={skill.icon} alt={skill.name} className="icon-svg-modern" />
                  <span className="skill-label-modern">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills; 