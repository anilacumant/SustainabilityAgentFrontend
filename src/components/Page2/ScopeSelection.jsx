import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import ScopeDescription from "./ScopeDescription";
import RadioButtonGroup from "./RadioButtonGroup";
import ChatModal from "./ChatModal";
import "./ScopeSelection.css"; // Updated styles

const ScopeSelection = () => {
  const [selectedScopes, setSelectedScopes] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

  const scopes = [
    { id: "stationary", name: "Stationary Combustion" },
    { id: "mobile", name: "Mobile Combustion" },
    { id: "fugitive", name: "Fugitive Emissions" },
  ];

  // Fetch scope descriptions from the backend
  const fetchScopeDescription = async (scopeName) => {
    try {
      const response = await fetch("http://localhost:5000/api/get-scope-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scope: scopeName }),
      });

      const data = await response.json();
      setDescriptions((prevDescriptions) => ({
        ...prevDescriptions,
        [scopeName]: data.description || "Description not available",
      }));
    } catch (error) {
      console.error("Error fetching description:", error);
    }
  };

  // Fetch all scope descriptions on component mount
  useEffect(() => {
    scopes.forEach((scope) => {
      fetchScopeDescription(scope.name);
    });
  }, []);

  // Handle radio button selection
  const handleSelection = (id, value) => {
    setSelectedScopes((prev) => ({ ...prev, [id]: value }));
  };

  // Handle Next button click
  const handleNext = () => {
    if (selectedScopes.stationary === "Yes") {
      if (window.confirm("Are you sure you want to proceed to Stationary Combustion Fuel Selection?")) {
        navigate("/stationary-fuel-selection"); // Redirect to FuelSelection page
      }
    } else {
      alert("Please select at least one applicable scope.");
    }
  };

  return (
    <div className="scope-selection">
      <h1>Select Applicable Scopes</h1>
      {scopes.map((scope) => (
        <div key={scope.id} className="scope-item">
          <div className="response-box">
            <ScopeDescription title={scope.name} description={descriptions[scope.name] || "Loading..."} />
          </div>
          <RadioButtonGroup
            name={scope.id}
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
            selected={selectedScopes[scope.id] || ""}
            onChange={(value) => handleSelection(scope.id, value)}
          />
        </div>
      ))}
      <button className="next-button" onClick={handleNext}>Next</button>
      <div className="chat-button-wrapper">
        <button className="chat-button" onClick={() => setShowChat(!showChat)}>
          {showChat ? "▼" : "▲"}
        </button>
        {showChat && <ChatModal onClose={() => setShowChat(false)} position="bottom-right" />}
      </div>
    </div>
  );
};

export default ScopeSelection;
