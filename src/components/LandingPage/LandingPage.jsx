import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import image from "./image.jpeg"; // Import the image

const LandingPage = () => {
  const navigate = useNavigate(); // Use navigate for routing

  const handleClick = () => {
    navigate("/page1"); // Redirect to Page 1
  };

  return (
    <div className="landing-page">
      <div className="content">
        <h1>Welcome to EmissionIQ</h1>
        <p>
          "Sustainability is not a goal to be reached but a way of thinking, a way of being, a way of living."
        </p>
        <button className="start-button" onClick={handleClick}>
          Get Started
        </button>
      </div>
      <div className="image-section">
        <img src={image} alt="Sustainability Illustration" />
      </div>
    </div>
  );
};

export default LandingPage;
