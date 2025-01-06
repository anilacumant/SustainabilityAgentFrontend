import React from "react";
import "./styles.css";

const Dropdown = ({ label, options, value, onChange }) => {
  return (
    <div className="dropdown">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} required>
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
