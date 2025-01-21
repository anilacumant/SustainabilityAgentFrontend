import React, { useState } from "react";
import axios from "axios";
import { FaLightbulb } from "react-icons/fa"; // Light Bulb Icon for Description Toggle
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
  const [customFuel, setCustomFuel] = useState("");
  const [showDescription, setShowDescription] = useState({}); // Toggles for descriptions
  const [error, setError] = useState(null); // Error handling

  // Handle fuel selection
  const handleFuelSelect = (fuelType) => {
    if (!selectedFuels.includes(fuelType)) {
      setSelectedFuels([...selectedFuels, fuelType]);
      fetchFuelData(fuelType); // Fetch data for the selected fuel
    }
  };

  // Handle fetching description and emission factor
  const fetchFuelData = async (fuelType) => {
    try {
      const response = await axios.post("http://localhost:5000/api/get-fuel-data", { fuel_type: fuelType });
      setEmissionData((prev) => ({
        ...prev,
        [fuelType]: {
          description: response.data.description,
          emissionFactor: response.data.emission_factor,
          uom: response.data.uom || "Unknown",
        },
      }));
    } catch (error) {
      console.error("Error fetching fuel data:", error);
      setError(`Error fetching fuel data for ${fuelType}`);
    }
  };

  // Handle adding custom fuel
  const handleAddCustomFuel = () => {
    if (customFuel && !fuelTypes.includes(customFuel)) {
      setFuelTypes([...fuelTypes, customFuel]);
      fetchFuelData(customFuel);
      setCustomFuel("");
    }
  };

  // Toggle description visibility
  const toggleDescription = (fuelType) => {
    if (!emissionData[fuelType]) {
      // If data isn't loaded, fetch it first
      fetchFuelData(fuelType);
    }
    setShowDescription((prev) => ({
      ...prev,
      [fuelType]: !prev[fuelType], // Toggle the visibility
    }));
  };

  // Render description dynamically
  const renderDescription = (fuelType) => {
    const fuelData = emissionData[fuelType];
    if (fuelData && showDescription[fuelType]) {
      return (
        <p className="description">
          {fuelData.description || "No description available."}
        </p>
      );
    }
    return null;
  };

  // Calculate emissions
  const calculateEmissions = (fuelType) => {
    const data = emissionData[fuelType];
    if (data && data.value && data.emissionFactor) {
      return (data.value * data.emissionFactor).toFixed(2);
    }
    return "N/A";
  };

  // Handle user input changes
  const handleInputChange = (fuelType, field, value) => {
    setEmissionData((prev) => ({
      ...prev,
      [fuelType]: {
        ...prev[fuelType],
        [field]: value,
      },
    }));
  };

  return (
    <div className="fuel-selection">
      <h1>Fuel Selection</h1>

      {/* Add Custom Fuel Section */}
      <div className="custom-fuel">
  <h2>Add Custom Fuel</h2>
  <div className="custom-fuel-container">
    <input
      type="text"
      value={customFuel}
      onChange={(e) => setCustomFuel(e.target.value)}
      placeholder="Enter custom fuel type"
      className="custom-fuel-input"
    />
    <button onClick={handleAddCustomFuel} className="custom-fuel-btn">
      Add
    </button>
  </div>
</div>


      {/* Based on Chosen Items Section */}
      {selectedFuels.length > 0 && (
        <div className="emission-calculation">
          <h2>Based on Chosen Items</h2>
          <table>
            <thead>
              <tr>
                <th>Fuel Type</th>
                <th>Data Available?</th>
                <th>UoM</th>
                <th>Value (User Input)</th>
                <th>Actual/Estimated</th>
                <th>Attachment</th>
                <th>Emission Factor</th>
                <th>Emissions</th>
              </tr>
            </thead>
            <tbody>
  {selectedFuels.map((fuelType) => (
    <tr key={fuelType}>
      <td>{fuelType}</td>
      <td>
        <select
          onChange={(e) => handleInputChange(fuelType, "dataAvailable", e.target.value)}
          className="dropdown"
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </td>
      <td>{emissionData[fuelType]?.uom || "Loading..."}</td>
      <td>
        <input
          type="number"
          placeholder="Enter value"
          onChange={(e) => handleInputChange(fuelType, "value", parseFloat(e.target.value))}
          className="input-field"
        />
      </td>
      <td>
        <select
          onChange={(e) => handleInputChange(fuelType, "actualEstimated", e.target.value)}
          className="dropdown"
        >
          <option value="Actual">Actual</option>
          <option value="Estimated">Estimated</option>
        </select>
      </td>
      <td>
        <div className="file-upload">
          <label htmlFor={`file-${fuelType}`} className="file-upload-label">
            Choose File
          </label>
          <input
            id={`file-${fuelType}`}
            type="file"
            className="file-upload-input"
            onChange={(e) => handleInputChange(fuelType, "attachment", e.target.files[0])}
          />
        </div>
      </td>
      <td>{emissionData[fuelType]?.emissionFactor || "Fetching..."}</td>
      <td>{calculateEmissions(fuelType)}</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}

      {/* Fuel Selection Table */}
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Fuel Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {fuelTypes.map((fuelType) => (
            <tr key={fuelType}>
              <td>
                <input
                  type="checkbox"
                  onChange={() => handleFuelSelect(fuelType)}
                  checked={selectedFuels.includes(fuelType)}
                />
              </td>
              <td>{fuelType}</td>
              <td>
                <FaLightbulb
                  onClick={() => toggleDescription(fuelType)}
                  className="lightbulb-icon"
                />
                {renderDescription(fuelType)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FuelSelection;
