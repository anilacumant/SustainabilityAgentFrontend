import React from "react";
import "./ScopeSelection";

const RadioButtonGroup = ({ name, options, selected, onChange }) => {
  return (
    <div className="radio-group">
      {options.map((option, index) => (
        <label key={index} className="radio-option">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selected === option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default RadioButtonGroup;
