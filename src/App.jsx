import { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Timeline from './components/Timeline';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import BackToTop from './components/ScrollProgress';
import MetaTags from './components/MetaTags';
import './App.css';

function App() {
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}portfolioData.json`)
      .then((res) => res.json())
      .then((data) => {
        setMetadata(data.metadata);
      })
      .catch((err) => console.error('Error loading metadata:', err));
  }, []);

  return (
    <ThemeProvider>
      <MetaTags metadata={metadata} />
      <div className="App">
        <Header />
        <main>
          <Hero />
          <About />
          <Timeline />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <BackToTop />
      </div>
    </ThemeProvider>
  );
}

export default App;
