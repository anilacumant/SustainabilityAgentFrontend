import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, ChevronRight } from "lucide-react";
import api from "../../api";
import ChatModal from "./ChatModal";
import PopupMessage from "./PopupMessage";
import './ScopeSelection.css';

const ScopeSelection = () => {
  const [selectedScopes, setSelectedScopes] = useState({});
  const [showChat, setShowChat] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const [descriptions, setDescriptions] = useState({});
  const navigate = useNavigate();
  
  const scope1 = [
    { id: "stationary", name: "Stationary Combustion", icon: "🌿" },
    { id: "mobile", name: "Mobile Combustion", icon: "🍃" },
    { id: "fugitive", name: "Fugitive Emissions", icon: "🌱" },
  ];
  
  const scope2 = [{ id: "scope2", name: "Scope 2", icon: "🌳" }];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await api.post("/api/get-scope-description", {
          company_row_key: localStorage.getItem("company"),
        });

        const data = response.data;
        console.log(data);
        
        const newDescriptions = {};
        const newSelections = {};

        [...scope1, ...scope2].forEach(scope => {
          if (data[scope.name]) {
            newDescriptions[scope.id] = data[scope.name].reason;
            newSelections[scope.id] = data[scope.name].applicable ? "Yes" : "No";
          }
        });

        setDescriptions(newDescriptions);
        setSelectedScopes(newSelections);
      } catch (error) {
        console.error("Error fetching initial scope data:", error);
      }
    };
    
    fetchInitialData();
  },[]);
  
  const handleSelection = (id, value) => {
    setSelectedScopes(prev => ({
      ...prev,
      [id]: prev[id] === value ? undefined : value,
    }));
  };

  const handleNext = () => {
    const updatedScopes = Object.fromEntries(
      Object.entries(selectedScopes).map(([key, value]) => [key, value === "Yes" ? "Yes" : "No"])
    );
    
    if (!Object.values(updatedScopes).some(value => value === "Yes")) {
      setPopupMessage("Please select at least one scope.");
      return;
    }
    navigate("/scopes-details", { state: { selectedScopes: updatedScopes } });
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <h1>
            <Leaf className="header-icon" />
            <span>Select Applicable Scopes</span>
          </h1>
          <button className="next-button" onClick={handleNext} disabled={!Object.keys(selectedScopes).length}>
            Continue <ChevronRight size={20} />
          </button>
        </div>
      </header>
      <main className="main-content">
        <div className="scopes-row">
          <section className="scope-section">
            <h2>Scope 1</h2>
            {scope1.map(scope => (
              <div key={scope.id} className={`scope-card ${selectedScopes[scope.id] === "Yes" ? "selected" : ""}`}>
                <div className="card-title">{scope.icon} {scope.name}</div>
                <div className="description">{descriptions[scope.id]?descriptions[scope.id]:"Loading..."}</div>
                <div className="selection-group">
                  <button className={`selection-btn ${selectedScopes[scope.id] === "Yes" ? "active" : ""}`} onClick={() => handleSelection(scope.id, "Yes")}>Yes</button>
                  <button className={`selection-btn ${selectedScopes[scope.id] === "No" ? "active" : ""}`} onClick={() => handleSelection(scope.id, "No")}>No</button>
                </div>
              </div>
            ))}
          </section>
          <section className="scope-section">
            <h2>Scope 2</h2>
            {scope2.map(scope => (
              <div key={scope.id} className={`scope-card ${selectedScopes[scope.id] === "Yes" ? "selected" : ""}`}>
                <div className="card-title">{scope.icon} {scope.name}</div>
                <div className="description">{descriptions[scope.id]?descriptions[scope.id]:"Loading..."}</div>
                <div className="selection-group">
                  <button className={`selection-btn ${selectedScopes[scope.id] === "Yes" ? "active" : ""}`} onClick={() => handleSelection(scope.id, "Yes")}>Yes</button>
                  <button className={`selection-btn ${selectedScopes[scope.id] === "No" ? "active" : ""}`} onClick={() => handleSelection(scope.id, "No")}>No</button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
      <div className="chat-wrapper">
        <button className="chat-btn" onClick={() => setShowChat(!showChat)}>
          {showChat ? "Close Chat" : "Need Help"} 
          <span className="chat-icon">{showChat ? "×" : "?"}</span>
        </button>
        {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      </div>
      {popupMessage && <PopupMessage message={popupMessage} onClose={() => setPopupMessage(null)} />}
    </div>
  );
};

export default ScopeSelection;    