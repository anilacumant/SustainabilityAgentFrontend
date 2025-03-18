import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FuelSelection from '../Page3/StationaryCombustion/FuelSelection';
import FugitiveSelection from '../Page3/FugitiveEmissions/FugitiveSelection';
import Scope2Selection from '../Page3/Scope2/Scope2Selection';
import MobileCombustion from '../Page3/MobileCombustion/MobileCombustion';
import ChatModal from '../Page2/ChatModal';
import "./styles.css"

const SustainabilityNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedScopes = location.state?.selectedScopes || {};
  
  const [activeComponent, setActiveComponent] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [scope1Expanded, setScope1Expanded] = useState(true);

  const enabledComponents = {
    fuel: selectedScopes.stationary === 'Yes',
    fugitive: selectedScopes.fugitive === 'Yes',
    mobile: selectedScopes.mobile === 'Yes',
    scope2: selectedScopes.scope2 === 'Yes'
  };

  const anyScope1Enabled = enabledComponents.fuel || enabledComponents.fugitive || enabledComponents.mobile;
  const enabledCount = Object.values(enabledComponents).filter(Boolean).length;

  const toggleScope1 = () => {
    setScope1Expanded(!scope1Expanded);
  };

  useEffect(() => {
    if (activeComponent === null) {
      if (enabledComponents.fuel) {
        setActiveComponent('fuel');
      } else if (enabledComponents.mobile) {
        setActiveComponent('mobile');
      } else if (enabledComponents.fugitive) {
        setActiveComponent('fugitive');
      } else if (enabledComponents.scope2) {
        setActiveComponent('scope2');
      }
    }
  }, [selectedScopes]); 
  return (
    <div className="sustainability-container">
      <nav className="sustainability-nav">
        {/* Scope 1 Category */}
        <button
          className={`nav-button scope-button ${anyScope1Enabled ? '' : 'disabled'} ${scope1Expanded ? 'expanded' : ''}`}
          onClick={toggleScope1}
          disabled={!anyScope1Enabled}
        >
          Scope 1
          <span className="expand-icon">{scope1Expanded ? '−' : '+'}</span>
        </button>
        
        {/* Scope 1 Subcategories */}
        <div className={`scope-submenu ${scope1Expanded ? 'expanded' : ''}`}>
          <button
            className={`nav-button submenu-button ${activeComponent === 'fuel' ? 'active' : ''}`}
            onClick={() => setActiveComponent('fuel')}
            disabled={!enabledComponents.fuel}
          >
            Stationary Combustion
          </button>
          <button
            className={`nav-button submenu-button ${activeComponent === 'mobile' ? 'active' : ''}`}
            onClick={() => setActiveComponent('mobile')}
            disabled={!enabledComponents.mobile}
          >
            Mobile Combustion
          </button>
          <button
            className={`nav-button submenu-button ${activeComponent === 'fugitive' ? 'active' : ''}`}
            onClick={() => setActiveComponent('fugitive')}
            disabled={!enabledComponents.fugitive}
          >
            Fugitive Emissions
          </button>
        </div>

        {/* Scope 2 Category */}
        <button
          className={`nav-button scope-button ${activeComponent === 'scope2' ? 'active' : ''}`}
          onClick={() => setActiveComponent('scope2')}
          disabled={!enabledComponents.scope2}
        >
          Scope 2
        </button>

        {/* Dashboard Navigation */}
        <button
          className="nav-button dashboard-button"
          onClick={() => navigate("/dashboard")}
        >
          Go to dashboard
        </button>
      </nav>
      
      {enabledCount === 0 ? (
        <div className="no-selection-message">
          Please select at least one scope to proceed
        </div>
      ) : (
        <div className="component-wrapper">
          {activeComponent === 'fuel' && enabledComponents.fuel && <FuelSelection />}
          {activeComponent === 'fugitive' && enabledComponents.fugitive && <FugitiveSelection />}
          {activeComponent === 'mobile' && enabledComponents.mobile && <MobileCombustion />}
          {activeComponent === 'scope2' && enabledComponents.scope2 && <Scope2Selection />}
          {!activeComponent && (
            <div className="selection-prompt">
              Please select a component from the navigation bar
            </div>
          )}
        </div>
      )}
      <div className="chat-wrapper">
        <button className="chat-btn" onClick={() => setShowChat(!showChat)}>
          {showChat ? "Close Chat" : "Need Help"} 
          <span className="chat-icon">{showChat ? "×" : "?"}</span>
        </button>
        {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      </div>
    </div>
  );
};

export default SustainabilityNav;
