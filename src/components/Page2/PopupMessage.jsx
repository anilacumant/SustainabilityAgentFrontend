// src/PopupMessage.jsx
import React from "react";
import "./PopupMessage.css";

const PopupMessage = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={onClose} className="popup-button">OK</button>
      </div>
    </div>
  );
};

export default PopupMessage;
