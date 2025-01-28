import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLightbulb } from "react-icons/fa";
import ChatModal from "./ChatModal"; // ChatModal component
import PopupMessage from "./PopupMessage"; // Import PopupMessage
import "./ScopeSelection.css";

const ScopeSelection = () => {
  const [selectedScopes, setSelectedScopes] = useState({});
  const [expandedScope, setExpandedScope] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null); // Popup message state
  const [nextPath, setNextPath] = useState(""); // Stores the next navigation path
  const [descriptions, setDescriptions] = useState({});
  const [loadingDescriptions, setLoadingDescriptions] = useState({});
  const navigate = useNavigate();

  // Scope Definitions
  const scope1Definition = "Scope 1 covers direct emissions from owned or controlled sources, including fuel combustion and industrial processes.";
  const scope2Definition = "Scope 2 covers indirect emissions from the consumption of purchased electricity, heat, steam, and cooling.";

  // Scope Data
  const scope1 = [
    { id: "stationary", name: "Stationary Combustion" },
    { id: "mobile", name: "Mobile Combustion" },
    { id: "fugitive", name: "Fugitive Emissions" },
  ];

  const scope2 = [
    { id: "grid", name: "Purchased Grid Electricity Consumption" },
    { id: "heat", name: "Purchased Heat/Steam Consumption" },
    { id: "cooling", name: "Purchased Cooling" },
  ];

  // Fetch description for a single scope
  const fetchDescription = async (scopeName, scopeId) => {
    try {
      setLoadingDescriptions((prev) => ({ ...prev, [scopeId]: true }));

      const res = await fetch("http://localhost:5000/api/get-scope-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: scopeName }),
      });

      if (!res.ok) {
        throw new Error(`API call failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      setDescriptions((prev) => ({
        ...prev,
        [scopeId]: data.description || "Description unavailable.",
      }));
      setLoadingDescriptions((prev) => ({ ...prev, [scopeId]: false }));
    } catch (error) {
      console.error("Failed to fetch description:", error);
      setDescriptions((prev) => ({
        ...prev,
        [scopeId]: "Failed to load description.",
      }));
      setLoadingDescriptions((prev) => ({ ...prev, [scopeId]: false }));
    }
  };

  // Handle radio button selection
  const handleSelection = (id, value) => {
    setSelectedScopes((prev) => ({ ...prev, [id]: value }));
  };

  // Handle Next button click
  const handleNext = () => {
    if (selectedScopes.stationary === "Yes") {
      setPopupMessage("Proceed to Stationary Combustion Fuel Selection?");
      setNextPath("/stationary-fuel-selection");
    } else if (selectedScopes.mobile === "Yes") {
      setPopupMessage("Proceed to Mobile Combustion Fuel Selection?");
      setNextPath("/mobile-fuel-selection");
    } else if (selectedScopes.fugitive === "Yes") {
      setPopupMessage("Proceed to Fugitive Emissions Page?");
      setNextPath("/fugitive-emissions");
    } else if (selectedScopes.grid === "Yes") {
      setPopupMessage("Proceed to Grid Electricity Page?");
      setNextPath("/grid-electricity");
    } else if (selectedScopes.heat === "Yes") {
      setPopupMessage("Proceed to Heat/Steam Consumption Page?");
      setNextPath("/heat-consumption");
    } else if (selectedScopes.cooling === "Yes") {
      setPopupMessage("Proceed to Cooling Page?");
      setNextPath("/cooling");
    } else {
      setPopupMessage("Please select at least one scope.");
      setNextPath("");
    }
  };

  // Handle popup confirmation
  const handlePopupClose = () => {
    setPopupMessage(null);
    if (nextPath) {
      navigate(nextPath);
    }
  };

  return (
    <div className="scope-selection">
      <header className="header">
        <h1>Select Applicable Scopes</h1>
        <button
          className={`next-button ${Object.values(selectedScopes).length > 0 ? "enabled" : "disabled"}`}
          onClick={handleNext}
          disabled={Object.values(selectedScopes).length === 0}
        >
          Next
        </button>
      </header>

      {/* Scope 1 Section */}
      <h2>Scope 1</h2>
      <p className="scope-description-text">{scope1Definition}</p>
      <div className="scope-list">
        {scope1.map((scope) => (
          <div key={scope.id} className="scope-card">
            <div className="scope-header">
              <span className="scope-name">
                {scope.name}
                <FaLightbulb
                  className="info-icon"
                  onClick={() => {
                    if (!descriptions[scope.id]) {
                      fetchDescription(scope.name, scope.id);
                    }
                    setExpandedScope(expandedScope === scope.id ? null : scope.id);
                  }}
                />
              </span>
            </div>
            {expandedScope === scope.id && (
              <div className="scope-description">
                {loadingDescriptions[scope.id] ? "Loading..." : descriptions[scope.id] || "Click the bulb to load the description."}
              </div>
            )}
            <div className="radio-group">
              <label>
                <input type="radio" name={scope.id} value="Yes" onChange={() => handleSelection(scope.id, "Yes")} checked={selectedScopes[scope.id] === "Yes"} />
                Yes
              </label>
              <label>
                <input type="radio" name={scope.id} value="No" onChange={() => handleSelection(scope.id, "No")} checked={selectedScopes[scope.id] === "No"} />
                No
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Scope 2 Section */}
      <h2>Scope 2</h2>
      <p className="scope-description-text">{scope2Definition}</p>
      <div className="scope-list">
        {scope2.map((scope) => (
          <div key={scope.id} className="scope-card">
            <div className="scope-header">
              <span className="scope-name">
                {scope.name}
                <FaLightbulb
                  className="info-icon"
                  onClick={() => {
                    if (!descriptions[scope.id]) {
                      fetchDescription(scope.name, scope.id);
                    }
                    setExpandedScope(expandedScope === scope.id ? null : scope.id);
                  }}
                />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-button-wrapper">
        <button className="chat-button" onClick={() => setShowChat(!showChat)}>
          {showChat ? "▼" : "▲"} Chat with AI
        </button>
        {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      </div>

      {popupMessage && <PopupMessage message={popupMessage} onClose={handlePopupClose} />}
    </div>
  );
};

export default ScopeSelection;
