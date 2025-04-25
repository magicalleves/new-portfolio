import { useState, useEffect, useRef } from 'react';
import './App.css';

// Sections
const Home = () => {
  const text = "Meow meow MOEW";
  const [displayText, setDisplayText] = useState([]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex).split(''));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="section">
      <h1 className="pixel-text">
        {displayText.map((char, index) => (
          <span 
            key={index}
            className="pixel-char"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              marginRight: char === ' ' ? '0.5em' : '0',
              whiteSpace: char === '\n' ? 'pre' : 'normal'
            }}
          >
            {char === ' ' ? '\u00A0' : char === '\n' ? <br/> : char}
          </span>
        ))}
      </h1>
    </section>
  );
};

const About = () => (
  <section id="about" className="section">
    <div className="pixel-box">
      <h2 className="pixel-text">ABOUT ME</h2>
      <p className="pixel-text">
        I'm a passionate developer with experience in building web applications.
        My skills include React, JavaScript, and modern frontend technologies.
      </p>
    </div>
  </section>
);

const Projects = () => (
  <section id="projects" className="section">
    <div className="pixel-box">
      <h2 className="pixel-text">MY PROJECTS</h2>
      <div className="project-grid">
        <div className="pixel-card">Project 1</div>
        <div className="pixel-card">Project 2</div>
        <div className="pixel-card">Project 3</div>
      </div>
    </div>
  </section>
);

const Experience = () => (
  <section id="experience" className="section">
    <div className="pixel-box">
      <h2 className="pixel-text">EXPERIENCE</h2>
      <div className="timeline">
        <div className="timeline-item pixel-text">Job 1 - meow 2022</div>
        <div className="timeline-item pixel-text">Job 2 - 2023</div>
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="section">
    <div className="pixel-box">
      <h2 className="pixel-text">GET IN TOUCH</h2>
      <form className="pixel-form">
        <input type="text" className="pixel-input" placeholder="Name"/>
        <input type="email" className="pixel-input" placeholder="Email"/>
        <textarea className="pixel-textarea" placeholder="Message"></textarea>
        <button type="submit" className="pixel-button">SEND</button>
      </form>
    </div>
  </section>
);

// Sidebar Component
const Sidebar = ({ activeSection, setActiveSection }) => {
  const sections = ['home', 'about', 'projects', 'experience', 'contact'];
  
  return (
    <nav className="sidebar">
      {sections.map((section) => (
        <a
          key={section}
          href={`#${section}`}
          className={`pixel-text nav-link ${activeSection === section ? 'active' : ''}`}
          onClick={() => setActiveSection(section)}
        >
          {section.toUpperCase()}
        </a>
      ))}
    </nav>
  );
};

// Main App
function App() {
  const [activeSection, setActiveSection] = useState('home');
  const observer = useRef();

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('.section').forEach(section => {
      observer.current.observe(section);
    });

    return () => observer.current.disconnect();
  }, []);

  return (
    <div className="container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <Home />
      <About />
      <Projects />
      <Experience />
      <Contact />
    </div>
  );
}

export default App;