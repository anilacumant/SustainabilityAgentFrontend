import React, { useState, useEffect } from "react";
import ScopeDescription from "./ScopeDescription";
import RadioButtonGroup from "./RadioButtonGroup";
import ChatModal from "./ChatModal";
import "./ScopeSelection.css"; // Import ScopeSelection styles


const ScopeSelection = () => {
  const [selectedScopes, setSelectedScopes] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [showChat, setShowChat] = useState(false);

  const scopes = [
    { id: "stationary", name: "Stationary Combustion" },
    { id: "mobile", name: "Mobile Combustion" },
    { id: "fugitive", name: "Fugitive Emissions" },
  ];

  // Corrected fetchScopeDescription to update the state
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

  // Use useEffect to fetch all scope descriptions on component mount
  useEffect(() => {
    scopes.forEach((scope) => {
      fetchScopeDescription(scope.name);
    });
  }, []);

  const handleSelection = (id, value) => {
    setSelectedScopes((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    const selected = Object.keys(selectedScopes).filter((id) => selectedScopes[id] === "Yes");
    if (selected.length === 0) {
      alert("Please select at least one applicable scope.");
      return;
    }
    const query = selected.map((scope) => `scope=${scope}`).join("&");
    window.location.href = `/page3?${query}`;
  };

  return (
    <div className="scope-selection">
      <h1>Select Applicable Scopes</h1>
      {scopes.map((scope) => (
        <div key={scope.id} className="scope-item">
          <ScopeDescription title={scope.name} description={descriptions[scope.name] || "Loading..."} />
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
      <button className="next-button" onClick={handleNext}>
        Next
      </button>
      <button className="chat-button" onClick={() => setShowChat(true)}>
        Need Help? Chat with AI
      </button>
      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default ScopeSelection;
