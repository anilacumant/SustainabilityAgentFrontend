import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLightbulb } from "react-icons/fa";
import ChatModal from "./ChatModal"; // ChatModal component
import "./ScopeSelection.css";

const ScopeSelection = () => {
  const [selectedScopes, setSelectedScopes] = useState({});
  const [expandedScope, setExpandedScope] = useState(null);
  const [showChat, setShowChat] = useState(false); // Chatbot toggle state
  const [scopes] = useState([
    { id: "stationary", name: "Stationary Combustion" },
    { id: "mobile", name: "Mobile Combustion" },
    { id: "fugitive", name: "Fugitive Emissions" },
  ]);
  const [descriptions, setDescriptions] = useState({});
  const [loadingDescriptions, setLoadingDescriptions] = useState({});
  const navigate = useNavigate();

  // Fetch description for a single scope
  const fetchDescription = async (scopeName, scopeId) => {
    try {
      // Set loading state for the specific scope
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

      // Set the description and clear loading state
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
      if (window.confirm("Are you sure you want to proceed to Stationary Combustion Fuel Selection?")) {
        navigate("/stationary-fuel-selection"); // Redirect to Stationary Combustion Fuel Selection
      }
    } else if (selectedScopes.mobile === "Yes") {
      navigate("/mobile-fuel-selection"); // Redirect to Mobile Combustion Fuel Selection
    } else if (selectedScopes.fugitive === "Yes") {
      navigate("/fugitive-emissions"); // Redirect to Fugitive Emissions page
    } else {
      alert("Please select at least one scope.");
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
      <div className="scope-list">
        {scopes.map((scope) => (
          <div key={scope.id} className="scope-card">
            <div className="scope-header">
              <span className="scope-name">
                {scope.name}
                <FaLightbulb
                  className="info-icon"
                  onClick={() => {
                    if (!descriptions[scope.id]) {
                      fetchDescription(scope.name, scope.id); // Fetch description only if not already fetched
                    }
                    setExpandedScope(expandedScope === scope.id ? null : scope.id); // Toggle scope expansion
                  }}
                />
              </span>
            </div>
            {expandedScope === scope.id && (
              <div className="scope-description">
                {loadingDescriptions[scope.id]
                  ? "Loading..."
                  : descriptions[scope.id] || "Click the bulb to load the description."}
              </div>
            )}
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name={scope.id}
                  value="Yes"
                  onChange={() => handleSelection(scope.id, "Yes")}
                  checked={selectedScopes[scope.id] === "Yes"}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name={scope.id}
                  value="No"
                  onChange={() => handleSelection(scope.id, "No")}
                  checked={selectedScopes[scope.id] === "No"}
                />
                No
              </label>
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
    </div>
  );
};

export default ScopeSelection;
