import { useState, useEffect } from 'react';
import '../styles/Loader.css';

const Loader = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState('initial');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const phases = [
      { phase: 'initial', duration: 800 },
      { phase: 'hi', duration: 1200 },
      { phase: 'developers', duration: 1000 },
      { phase: 'developers-big', duration: 600 },
      { phase: 'all-text', duration: 1800 },
      { phase: 'complete', duration: 400 },
    ];

    let currentIndex = 0;

    const nextPhase = () => {
      if (currentIndex < phases.length) {
        const { phase, duration } = phases[currentIndex];
        setCurrentPhase(phase);

        setTimeout(() => {
          currentIndex++;
          if (currentIndex < phases.length) {
            nextPhase();
          } else {
            setIsVisible(false);
            setTimeout(() => {
              onComplete();
            }, 400);
          }
        }, duration);
      }
    };

    nextPhase();
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="loader-container">
      <div className="loader-background">
        <div className="loader-grid">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="grid-cell" style={{ animationDelay: `${i * 0.1}s` }}></div>
          ))}
        </div>
      </div>

      <div className="loader-content">
        {currentPhase === 'initial' && (
          <div className="initial-loader">
            <div className="loader-logo">DV</div>
          </div>
        )}

        {currentPhase === 'hi' && (
          <div className="hi-loader">
            <div className="hi-text">Hello</div>
            <div className="hi-subtitle">Welcome to my world</div>
          </div>
        )}

        {currentPhase === 'developers' && (
          <div className="developers-loader">
            <div className="developers-text">Developers</div>
          </div>
        )}

        {currentPhase === 'developers-big' && (
          <div className="developers-big-loader">
            <div className="developers-big-text">Developers</div>
          </div>
        )}

        {currentPhase === 'all-text' && (
          <div className="all-text-loader">
            <div className="text-line">
              <span className="text-developers">Developers</span>
            </div>
            <div className="text-line">
              <span className="text-recruiters">Recruiters</span>
            </div>
            <div className="text-line">
              <span className="text-friends">& Friends</span>
            </div>
            <div className="final-message">
              <span>Let's build something amazing together</span>
            </div>
          </div>
        )}
      </div>

      <div className="loader-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(phases.findIndex((p) => p.phase === currentPhase) + 1) * (100 / 6)}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const phases = [
  { phase: 'initial', duration: 800 },
  { phase: 'hi', duration: 1200 },
  { phase: 'developers', duration: 1000 },
  { phase: 'developers-big', duration: 600 },
  { phase: 'all-text', duration: 1800 },
  { phase: 'complete', duration: 400 },
];

export default Loader;
