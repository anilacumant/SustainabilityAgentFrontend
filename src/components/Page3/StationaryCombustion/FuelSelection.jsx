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
  const [customFuel, setCustomFuel] = useState("");

  // Handle fuel selection
  const handleFuelSelect = (fuelType) => {
    if (!selectedFuels.includes(fuelType)) {
      setSelectedFuels([...selectedFuels, fuelType]);
      fetchFuelData(fuelType);
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

  // Handle custom fuel input
  const handleAddCustomFuel = () => {
    if (customFuel && !fuelTypes.includes(customFuel)) {
      setFuelTypes([...fuelTypes, customFuel]);
      fetchFuelData(customFuel);
      setCustomFuel("");
    }
  };

  // Handle input changes for the table
  const handleInputChange = (fuelType, field, value) => {
    setEmissionData((prev) => ({
      ...prev,
      [fuelType]: {
        ...prev[fuelType],
        [field]: value,
      },
    }));
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
                {emissionData[fuelType]?.description || (
                  <button onClick={() => fetchFuelData(fuelType)}>Show Description</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="custom-fuel">
        <h2>Add Custom Fuel</h2>
        <input
          type="text"
          value={customFuel}
          onChange={(e) => setCustomFuel(e.target.value)}
          placeholder="Enter custom fuel type"
        />
        <button onClick={handleAddCustomFuel}>Add Fuel</button>
      </div>

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
                    />
                  </td>
                  <td>
                    <select
                      onChange={(e) => handleInputChange(fuelType, "actualEstimated", e.target.value)}
                    >
                      <option value="Actual">Actual</option>
                      <option value="Estimated">Estimated</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="file"
                      onChange={(e) => handleInputChange(fuelType, "attachment", e.target.files[0])}
                    />
                  </td>
                  <td>{emissionData[fuelType]?.emissionFactor || "Fetching..."}</td>
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
