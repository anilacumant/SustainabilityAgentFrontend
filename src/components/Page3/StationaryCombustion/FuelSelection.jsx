import React, { useState } from "react";
import axios from "axios";
import "./FuelSelection.css";

const FuelSelection = () => {
  const [fuelTypes, setFuelTypes] = useState([
    "Natural Gas",
    "Diesel",
    "Gasoline/Petrol",
    "Propane (LPG)",
    "Light Density Fuel Oil",
    "Heavy Density Fuel Oil",
    "Coal",
    "Wood Biomass",
    "Wood Pellets",
    "Kerosene",
    "Biodiesel",
    "Landfill Gas",
    "Waste Oil",
    "Hydrogen (H₂)",
  ]);
  const [selectedFuels, setSelectedFuels] = useState([]);
  const [emissionData, setEmissionData] = useState({});
  const [error, setError] = useState(null);

  // Handle fuel selection
  const handleFuelSelect = (fuelType) => {
    if (!selectedFuels.includes(fuelType)) {
      setSelectedFuels([...selectedFuels, fuelType]);
    }
  };

  // Handle user input for values
  const handleInputChange = (fuelType, field, value) => {
    setEmissionData((prev) => ({
      ...prev,
      [fuelType]: {
        ...prev[fuelType],
        [field]: value,
      },
    }));
  };

  // Fetch emission factor from the backend
  const fetchEmissionFactor = async (fuelType) => {
    try {
      const response = await axios.post("http://localhost:5000/api/get-emission-factor", { fuel_type: fuelType });
      setEmissionData((prev) => ({
        ...prev,
        [fuelType]: {
          ...prev[fuelType],
          emissionFactor: response.data.emission_factor,
        },
      }));
    } catch (error) {
      console.error("Error fetching emission factor:", error);
      setError(`Error fetching emission factor for ${fuelType}`);
    }
  };

  // Calculate emissions
  const calculateEmissions = (fuelType) => {
    const data = emissionData[fuelType];
    if (data && data.value && data.emissionFactor) {
      return (data.value * data.emissionFactor).toFixed(2);
    }
    return "N/A";
  };

  return (
    <div className="fuel-selection">
      <h1>Fuel Selection</h1>
      <table>
        <thead>
          <tr>
            <th>Fuel Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {fuelTypes.map((fuelType) => (
            <tr key={fuelType} onClick={() => handleFuelSelect(fuelType)}>
              <td>{fuelType}</td>
              <td>{selectedFuels.includes(fuelType) ? "Selected" : "Click to Select"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedFuels.length > 0 && (
        <div className="emission-calculation">
          <h2>Emission Calculation</h2>
          <table>
            <thead>
              <tr>
                <th>Fuel Type</th>
                <th>Value (User Input)</th>
                <th>UoM</th>
                <th>Emission Factor</th>
                <th>Emissions</th>
              </tr>
            </thead>
            <tbody>
              {selectedFuels.map((fuelType) => (
                <tr key={fuelType}>
                  <td>{fuelType}</td>
                  <td>
                    <input
                      type="number"
                      placeholder="Enter value"
                      onChange={(e) => handleInputChange(fuelType, "value", parseFloat(e.target.value))}
                    />
                  </td>
                  <td>
                    <select onChange={(e) => handleInputChange(fuelType, "uom", e.target.value)}>
                      <option value="liters">Liters</option>
                      <option value="cubic meters">Cubic Meters</option>
                      <option value="kWh">kWh</option>
                    </select>
                  </td>
                  <td>
                    {emissionData[fuelType]?.emissionFactor || (
                      <button onClick={() => fetchEmissionFactor(fuelType)}>Fetch Factor</button>
                    )}
                  </td>
                  <td>{calculateEmissions(fuelType)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FuelSelection;
