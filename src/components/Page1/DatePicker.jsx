import React from "react";
import "./styles.css";

const DatePicker = ({ label, value, onChange }) => {
  return (
    <div className="date-picker">
      <label>{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
};

export default DatePicker;
