import React from "react";
import "./ScopeSelection.css"
const ScopeDescription = ({ title, description }) => {
  return (
    <div className="scope-description">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default ScopeDescription;
