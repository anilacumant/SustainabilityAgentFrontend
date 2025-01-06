import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const LandingPage = () => {
  const navigate = useNavigate(); // Use navigate for routing

  const handleClick = () => {
    navigate("/page1"); // Redirect to Page 1
  };

  return (
    <div className="landing-page" onClick={handleClick}>
      <div className="content">
        <h1>Welcome to EmissionIQ</h1>
        <p>Click anywhere to begin tracking your emissions.</p>
      </div>
    </div>
  );
};

export default LandingPage;
