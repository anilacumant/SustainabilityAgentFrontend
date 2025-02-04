import React, { useState } from "react";
import axios from "axios";
import "./FugitiveSelection.css";

const GasList = ({ gases, fuelType, onSelectionChange,fetchFuelData }) => {
  const [checkedGases, setCheckedGases] = useState(gases.map(() => false));

  const handleCheckboxChange = (index,gas) => {
    // console.log(gas);
    fetchFuelData(gas);
    
    setCheckedGases((prevChecked) => {
      const updated = [...prevChecked];
      updated[index] = !updated[index];

      const selectedGases = gases.filter((_, idx) => updated[idx]);

      if (onSelectionChange) {
        onSelectionChange(fuelType, selectedGases);
      }
      return updated;
    });
  };

  return (
    <div className="gas-list">
      {gases.map((gas, index) => (
        <div key={index} className="gas-item" style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <input type="checkbox" checked={checkedGases[index]} onChange={() => handleCheckboxChange(index,gas)} />
          <span style={{ marginLeft: "8px" }}>{gas}</span>
        </div>
      ))}
    </div>
  );
};

const FugitiveSelection = () => {
  const [fuelTypes, setFuelTypes] = useState([
    "Refrigeration and Air Conditioning",
    "Methane Emissions from Fossil Fuel Systems",
    "Petroleum Storage and Distribution",
    "Coal Mining Operations",
    "SF₆ (Sulfur Hexafluoride) Emissions from Electrical Equipment",
    "Ventilation Losses from Industrial Processes",
    "Landfills and Waste Management",
    "Hydrocarbon Extraction",
    "Fire Suppression Systems (Halons)",
    "CO₂ Fire Extinguishers",
    "Pneumatic Devices",
    "Flaring Activity",
  ]);

  const [customFuel, setCustomFuel] = useState("");
  const [selectedGases, setSelectedGases] = useState({});
  const [emissionData, setEmissionData] = useState({});
  const [gasData, setGasData] = useState({});
  const [gasLoading, setGasLoading] = useState({});
  const [showDescription, setShowDescription] = useState({});
  const [error, setError] = useState(null);

  const fetchFuelData = async (fuelType) => {
    console.log(fuelType);
    
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
  


  const fetchGasData = async (fuelType) => {
    setGasLoading((prev) => ({ ...prev, [fuelType]: true }));
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/get-sources-fugitive-emissions", { gas_type: fuelType });
      setGasData((prev) => ({
        ...prev,
        [fuelType]: {
          gases: response.data.res,
        },
      }));
    } catch (error) {
      console.error("Error fetching gas data:", error);
      setError(`Error fetching gas data for ${fuelType}`);
    } finally {
      setGasLoading((prev) => ({ ...prev, [fuelType]: false }));
    }
  };

  const handleAddCustomFuel = () => {
    if (customFuel && !fuelTypes.includes(customFuel)) {
      setFuelTypes([...fuelTypes, customFuel]); 
      setGasData((prev) => ({
        ...prev,
        [customFuel]: { gases: [] }, 
      }));
      setCustomFuel(""); 
    }
  };

  const toggleDescription = (fuelType) => {
    if (!gasData[fuelType]) {
      fetchGasData(fuelType);
    }
    setShowDescription((prev) => ({
      ...prev,
      [fuelType]: !prev[fuelType],
    }));
  };

  const handleGasSelection = (fuelType, selectedGasList) => {
    setSelectedGases((prev) => ({
      ...prev,
      [fuelType]: selectedGasList, 
    }));
  };

  const rendergases = (fuelType) => {
    if (!showDescription[fuelType]) return null;
    if (gasLoading[fuelType]) return <p className="description">Fetching...</p>;

    const fuelGasData = gasData[fuelType];
    if (fuelGasData && fuelGasData.gases?.length > 0) {
      return <GasList gases={fuelGasData.gases} fuelType={fuelType} onSelectionChange={handleGasSelection} fetchFuelData={fetchFuelData} />;
    }
    return <p className="description">No description available.</p>;
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
      <h1 className="fuel-selection-title">Fuel Selection</h1>

      {/* Add Custom Fuel Section */}
      <div className="custom-fuel-section">
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

      {/* Based on Selected Gases Section */}
      {Object.keys(selectedGases).some((fuel) => selectedGases[fuel].length > 0) && (
  <div className="based-on-items-section">
    <h2>Based on Selected Gases</h2>
    <table className="based-on-items-table">
      <thead>
        <tr>
          <th>Gas Type</th>
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
        {Object.entries(selectedGases).flatMap(([fuelType, gases]) =>
          gases.map((gas) => (
            <tr key={gas}>
              <td>{gas}</td>
              <td>
                <select
                  onChange={(e) =>
                    handleInputChange(gas, "dataAvailable", e.target.value)
                  }
                  className="dropdown"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td>{emissionData[gas]?.uom || "Loading..."}</td>
              <td>
                <input
                  type="number"
                  placeholder="Enter value"
                  onChange={(e) =>
                    handleInputChange(gas, "value", parseFloat(e.target.value))
                  }
                  className="input-field"
                />
              </td>
              <td>
                <select
                  onChange={(e) =>
                    handleInputChange(gas, "actualEstimated", e.target.value)
                  }
                  className="dropdown"
                >
                  <option value="Actual">Actual</option>
                  <option value="Estimated">Estimated</option>
                </select>
              </td>
              <td>
                <div className="file-upload">
                  <label htmlFor={`file-${gas}`} className="file-upload-label">
                    Choose File
                  </label>
                  <input
                    id={`file-${gas}`}
                    type="file"
                    className="file-upload-input"
                    onChange={(e) =>
                      handleInputChange(gas, "attachment", e.target.files[0])
                    }
                  />
                </div>
              </td>
              <td>{emissionData[gas]?.emissionFactor || "Fetching..."}</td>
              <td>{calculateEmissions(gas)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)}


      {/* Fuel Selection Table */}
      <div className="fuel-selection-table-section">
        <table className="fuel-selection-table">
          <thead>
            <tr>
              <th>Source of Fugitive Emissions</th>
              <th>Typical Gases</th>
            </tr>
          </thead>
          <tbody>
            {fuelTypes.map((fuelType) => (
              <tr key={fuelType}>
                <td>{fuelType}</td>
                <td>
                  <span onClick={() => toggleDescription(fuelType)} className="lightbulb-icon">
                    {showDescription[fuelType] ? "Hide" : "Show"}
                  </span>
                  {rendergases(fuelType)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FugitiveSelection;
