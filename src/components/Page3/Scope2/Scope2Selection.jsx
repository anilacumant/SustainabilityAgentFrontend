import React, { useState } from "react";
import axios from "axios";
import { FaLightbulb } from "react-icons/fa"; // Light Bulb Icon for Description Toggle
import "./Scope2Selection.css";

const Scope2Selection = () => {
  const [energyTypes, setenergyTypes] = useState([
"Grid Supply",
"Renewable Sources",
"Purchased Power from Supplier",
"District Heating",
"Purchased Natural Gas Heating",
"District Cooling",
"Purchased Steam",
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
    if (customFuel && !energyTypes.includes(customFuel)) {
      setenergyTypes([...energyTypes, customFuel]);
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
    <div className="fuel-selection-container">
  <h1 className="fuel-selection-title">Energy Selection</h1>


  {/* Based on Chosen Items Section */}
  {selectedFuels.length > 0 && (
    <div className="based-on-items-section">
      <h2>Based on Chosen Items</h2>
      <table className="based-on-items-table">
        <thead>
          <tr>
            <th>Energy Type</th>
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
                  onChange={(e) =>
                    handleInputChange(fuelType, "dataAvailable", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleInputChange(fuelType, "value", parseFloat(e.target.value))
                  }
                  className="input-field"
                />
              </td>
              <td>
                <select
                  onChange={(e) =>
                    handleInputChange(fuelType, "actualEstimated", e.target.value)
                  }
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
                    onChange={(e) =>
                      handleInputChange(fuelType, "attachment", e.target.files[0])
                    }
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
  <div className="fuel-selection-table-section">
    <table className="fuel-selection-table">
      <thead>
        <tr>
          <th>Select</th>
          <th>Energy Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {energyTypes.map((fuelType) => (
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
</div>
  );
};

export default Scope2Selection;
