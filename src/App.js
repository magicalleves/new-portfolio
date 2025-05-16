import { useState, useEffect, useRef } from 'react';
import './App.css';
import { sounds, initSounds } from './sounds';

// Initialize sounds when the app loads
initSounds();

const playSound = (soundName) => {
  if (sounds[soundName]?.src) {
    const audio = new Audio(sounds[soundName].src);
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Audio play failed:", e));
  }
};



// Custom Cursor Component
const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      className={`pixel-cursor ${clicked ? 'click' : ''}`}
      style={{ 
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
};


const Loading = ({ onLoaded }) => {
  useEffect(() => {
    const handleFirstClick = async () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await audioContext.resume();
      
      // Start background music
      try {
        sounds.intro.audio.play();
      } catch (e) {
        console.error("Error playing background music:", e);
      }
      
      onLoaded();
    };

    document.addEventListener('click', handleFirstClick, { once: true });
  }, [onLoaded]);

  return (
    <div className="loading-screen">
      <div className="loading-text pixel-text">CLICK ANYWHERE TO START</div>
    </div>
  );
};


// Sections
const Home = () => {
  const text = "Hi! I'm Eva Gadzhieva. Meow";
  const [displayText, setDisplayText] = useState([]);
  const [startTyping, setStartTyping] = useState(false);
  const typingDelay = 100; // Milliseconds between characters
  const soundOffset = 25;  // Audio anticipation offset

  useEffect(() => {
    if (!startTyping) return;

    let currentIndex = 0;
    const timers = [];

    const typeCharacter = (index) => {
      if (index <= text.length) {
        // Play sound before character appears
        if (text[index - 1] && text[index - 1] !== ' ' && text[index - 1] !== '\n') {
          setTimeout(() => playSound('letter'), index * typingDelay - soundOffset);
        }

        setDisplayText(text.slice(0, index).split(''));
        
        currentIndex++;
        const timer = setTimeout(() => typeCharacter(currentIndex), typingDelay);
        timers.push(timer);
      }
    };

    typeCharacter(currentIndex);

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [startTyping]);

  return (
    <section id="home" className="section">
      {!startTyping && <Loading onLoaded={() => setStartTyping(true)} />}
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
      <div className="scanlines"></div>
    </section>
  );
};

const About = () => (
  <section id="about" className="section">
    <div className="pixel-box glitch-box">
      <h2 className="pixel-text">ABOUT ME</h2>
      <div className="terminal">
        <div className="terminal-header">
          <span className="terminal-btn red"></span>
          <span className="terminal-btn yellow"></span>
          <span className="terminal-btn green"></span>
          <span className="terminal-title">user@eva:~</span>
        </div>
        <div className="terminal-body">
          <p> Welcome to my digital realm!</p>
          <p>I'm a university student and a passionate developer with skills in:</p>
          <ul className="pixel-list">
            <li> JavaScript/TypeScript</li>
            <li> React/Node.js</li>
            <li> React Native/Expo</li>
            <li> Web Development</li>
          </ul>
          <p> Currently learning:  Game Development</p>
          <br></br>
          <p>I am committed to continuous learning and staying up-to-date with the latest advancements in software development. I actively seek opportunities to expand my knowledge and gain practical experience in order to enhance my skills and contribute to the field.</p>
          <p className="blink">_</p>
        </div>
      </div>
    </div>
    <div className="scanlines"></div>
  </section>
);
const Projects = ({ openProjectModal }) => {
  const projectData = [
    {
      id: 1,
      title: "FARMIUM",
      description: "Farmium is a mobile app that connects farmers with buyers. I led the technical development as CTO, building the React Native frontend and coordinating the backend integration.",
      technologies: ["React Native", "Expo", "Firebase", "Node.js"],
      image: "/assets/images/farmium.png", // You can add image URLs here
      link: "https://farmium.az"
    },
    {
      id: 2,
      title: "MEDICO.AZ",
      description: "An e-commerce platform for medicine delivery in Azerbaijan. I developed the frontend interface and implemented the cart/checkout system.",
      technologies: ["PHP", "jQuery", "MySQL", "AJAX"],
      image: "",
      link: "https://medico.az"
    },
    {
      id: 3,
      title: "PORTFOLIO V1",
      description: "My first portfolio website built with pure HTML/CSS/JS. Featured interactive elements and a clean design.",
      technologies: ["HTML5", "CSS3", "JavaScript"],
      image: "",
      link: "#"
    }
  ];

  return (
    <section id="projects" className="section">
      <div className="pixel-box glitch-box">
        <h2 className="pixel-text">MY PROJECTS</h2>
        <div className="project-grid">
          {projectData.map(project => (
            <div 
              key={project.id}
              className="pixel-card"
              onMouseEnter={() => playSound('hover')}
              onClick={() => openProjectModal(project.id)}
            >
              <div className="pixel-card-header">{project.title}</div>
              <div className="pixel-card-body">
                <p>{project.description.substring(0, 60)}...</p>
                <button 
                  className="pixel-button small"
                  onMouseEnter={() => playSound('hover')}
                >
                  VIEW DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="scanlines"></div>
    </section>
  );
};

const ProjectModal = ({ isOpen, onClose, projectId }) => {
  const projectData = [
    {
      id: 1,
      title: "FARMIUM",
      description: "Farmium is a mobile app that connects farmers with buyers. I led the technical development as CTO, building the React Native frontend and coordinating the backend integration.",
      technologies: ["React Native", "Expo", "Firebase", "Node.js"],
      image: "/assets/images/projects/farmium.png",
      link: "https://farmium.az"
    },
    {
      id: 2,
      title: "MEDICO.AZ",
      description: "An e-commerce platform for medicine delivery in Azerbaijan. I developed the frontend interface and implemented the cart/checkout system.",
      technologies: ["PHP", "jQuery", "MySQL", "AJAX"],
      image: "",
      link: "https://medico.az"
    },
    {
      id: 3,
      title: "PORTFOLIO V1",
      description: "My first portfolio website built with pure HTML/CSS/JS. Featured interactive elements and a clean design.",
      technologies: ["HTML5", "CSS3", "JavaScript"],
      image: "",
      link: "#"
    }
  ];

  const project = projectData.find(p => p.id === projectId);

  if (!isOpen || !project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="pixel-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="pixel-text">{project.title}</h3>
          <button 
            className="pixel-button close-btn"
            onClick={onClose}
            onMouseEnter={() => playSound('hover')}
          >
            X
          </button>
        </div>
        <div className="modal-content">
          <div className="modal-image-placeholder">
            {project.image ? (
              <img src={project.image} alt={project.title} />
            ) : (
              <div className="image-placeholder pixel-text">PROJECT SCREENSHOT</div>
            )}
          </div>
          <div className="modal-details">
            <p className="pixel-text">{project.description}</p>
            <div className="tech-stack">
              <h4 className="pixel-text">TECH STACK:</h4>
              <div className="tech-tags">
                {project.technologies.map(tech => (
                  <span key={tech} className="pixel-tag">{tech}</span>
                ))}
              </div>
            </div>
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="pixel-button"
                onMouseEnter={() => playSound('hover')}
              >
                VISIT PROJECT
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Experience = () => (
  <section id="experience" className="section">
    <div className="pixel-box glitch-box">
      <h2 className="pixel-text">EXPERIENCE</h2>
      <div className="timeline">
      <div className="timeline-item">
          <div className="timeline-year">2024</div>
          <div className="timeline-content">
            <h3><span className="glow-text">Co-founder & CTO</span> @ Farmium</h3>
            <br></br>
            <p>At Farmium, I oversee the company's technical initiatives and guide the direction of product development. Collaborating with a dedicated team, we continuously innovate and adapt to meet our users' needs.</p>

          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-year">2023</div>
          <div className="timeline-content">
            <h3><span className="glow-text">React Native Developer</span> @ AISTGroup</h3>
            <br></br>

            <p>At AISTGroup, I was actively involved in developing and enhancing a frontend React Native application using the Expo framework. My role involved closely collaborating with the design team to ensure a seamless user experience across Android and iOS platforms, and troubleshooting any technical challenges that arose</p>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-year">2022</div>
          <div className="timeline-content">
            <h3><span className="glow-text">Website Developer</span> @ Medico.Az</h3>
            <br></br>

            <p>At Medico.az, I contributed to the design and development of an interactive web application, streamlining the process for users to order medicines for home delivery. Leveraging a mix of technologies like PHP, AJAX, jQuery, and MySQLi, I collaborated with the backend team to ensure the platform's efficiency and responsiveness.</p>
          </div>
        </div>
      </div>
    </div>
    <div className="scanlines"></div>
  </section>
);

const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    playSound('success');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="section">
      <div className="pixel-box glitch-box">
        <h2 className="pixel-text">GET IN TOUCH</h2>
        {sent ? (
          <div className="success-message">
            <p>MESSAGE SENT!</p>
            <div className="pixel-checkmark">✓</div>
          </div>
        ) : (
          <form className="pixel-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              className="pixel-input" 
              placeholder="NAME"
              onFocus={() => playSound('hover')}
              required
            />
            <input 
              type="email" 
              className="pixel-input" 
              placeholder="EMAIL"
              onFocus={() => playSound('hover')}
              required
            />
            <textarea 
              className="pixel-textarea" 
              placeholder="MESSAGE"
              onFocus={() => playSound('hover')}
              required
            ></textarea>
            <button 
              type="submit" 
              className="pixel-button"
              onMouseEnter={() => playSound('hover')}
            >
              SEND MESSAGE
            </button>
          </form>
        )}
      </div>
      <div className="scanlines"></div>
    </section>
  );
};

const Sidebar = ({ activeSection, setActiveSection }) => {
  const sections = ['home', 'about', 'projects', 'experience', 'contact'];
  
  return (
    <nav className="sidebar">
      {sections.map((section) => (
        <a
          key={section}
          href={`#${section}`}
          className={`pixel-text nav-link ${activeSection === section ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            playSound('click');
            setActiveSection(section);
            document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
          }}
          onMouseEnter={() => playSound('hover')}
        >
          {section.toUpperCase()}
        </a>
      ))}
    </nav>
  );
};



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

  // Add this near the top of your App component
const [selectedProject, setSelectedProject] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const openProjectModal = (projectId) => {
  setSelectedProject(projectId);
  setIsModalOpen(true);
  playSound('click');
};

const closeProjectModal = () => {
  setIsModalOpen(false);
  playSound('hover');
};

  return (
    <div className="container">
      <Cursor />
      <div className="noise"></div>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <Home />
      <About />
      <Projects openProjectModal={openProjectModal} />
      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={closeProjectModal} 
        projectId={selectedProject} 
      />      
      <Experience />
      <Contact />
    </div>
  );
}

export default App;