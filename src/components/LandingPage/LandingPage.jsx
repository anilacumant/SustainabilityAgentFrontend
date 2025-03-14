import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Wind, BarChart2, Award } from 'lucide-react';
import "./styles.css"
const LandingPage = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);

  const stats = [
    { 
      icon: <Leaf size={32} />, 
      value: "2.5M+", 
      label: "Tons CO₂ Tracked",
    },
    { 
      icon: <Wind size={32} />, 
      value: "15K+", 
      label: "Companies Using EmissionIQ",
    },
    { 
      icon: <BarChart2 size={32} />, 
      value: "30%", 
      label: "Average Emission Reduction",
    },
    { 
      icon: <Award size={32} />, 
      value: "#1", 
      label: "In Emission Analytics",
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="landing-container">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        
      </nav>

      <main className="main-content">
        <div className="hero-section">
          <div className="hero-text">
            <h2 className="hero-title">
              Transform Your <span className="highlight">Environmental Impact </span> 
              {" "} with Real-Time Analytics
            </h2>
            <p className="hero-description">
              Harness the power of AI and real-time data to track, analyze, and 
              reduce your carbon footprint. Make informed decisions that benefit 
              both your business and the planet.
            </p>
            <div className="cta-wrapper">
              <button 
                className={`journey-button ${isHovered ? 'hovered' : ''}`}
                onClick={() => navigate('/basicinformation')}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={handleMouseMove}
                style={{
                  '--mouse-x': `${mousePosition.x}px`,
                  '--mouse-y': `${mousePosition.y}px`
                }}
              >
                <span className="button-content">Start Your Journey</span>
                <span className="button-glow"></span>
                <div className="particle-container">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`particle p${i + 1}`}></span>
                  ))}
                </div>
              </button>
            </div>
          </div>

          
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;