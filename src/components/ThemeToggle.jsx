import { useTheme } from '../context/ThemeContext';
import '../styles/ThemeToggle.css';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          {isDark ? <span className="moon-icon">🌙</span> : <span className="sun-icon">☀️</span>}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
