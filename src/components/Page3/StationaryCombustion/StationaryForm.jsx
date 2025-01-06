import React, { useState } from "react";
import StationaryDescription from "./StationaryDescription";
import StationaryTable from "./StationaryTable";
import "./styles.css";

const StationaryForm = () => {
  const [fuelTypes, setFuelTypes] = useState([
    "Natural Gas",
    "Diesel",
    "Gasoline/Petrol",
    "Propane (LPG)",
    "Coal",
    "Wood Biomass",
    "Hydrogen (H₂)",
    "Others",
  ]);
  const [selectedFuels, setSelectedFuels] = useState([]);
  const [otherFuel, setOtherFuel] = useState("");

  const handleFuelSelection = (fuel) => {
    setSelectedFuels((prev) =>
      prev.includes(fuel) ? prev.filter((f) => f !== fuel) : [...prev, fuel]
    );
  };

  const handleAddOtherFuel = () => {
    if (otherFuel) {
      setFuelTypes((prev) => [...prev, otherFuel]);
      setSelectedFuels((prev) => [...prev, otherFuel]);
      setOtherFuel("");
    }
  };

  return (
    <div className="stationary-form">
      <h1>Stationary Combustion</h1>
      <StationaryDescription />

      <h3>Select Fuel Types:</h3>
      <div className="fuel-options">
        {fuelTypes.map((fuel, index) => (
          <div key={index} className="fuel-option">
            <input
              type="checkbox"
              id={fuel}
              checked={selectedFuels.includes(fuel)}
              onChange={() => handleFuelSelection(fuel)}
            />
            <label htmlFor={fuel}>{fuel}</label>
          </div>
        ))}
      </div>

      <div className="add-other-fuel">
        <input
          type="text"
          placeholder="Add Other Fuel"
          value={otherFuel}
          onChange={(e) => setOtherFuel(e.target.value)}
        />
        <button onClick={handleAddOtherFuel}>Add</button>
      </div>

      {selectedFuels.length > 0 && (
        <StationaryTable selectedFuels={selectedFuels} />
      )}
    </div>
  );
};

export default StationaryForm;
