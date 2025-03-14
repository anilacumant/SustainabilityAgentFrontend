import React, { useState } from "react";
import api from "../../../api";
import { FaLightbulb } from "react-icons/fa"; 
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
  const [showDescription, setShowDescription] = useState({}); 
  const [error, setError] = useState(null);

  const handleFuelSelect = (energyType) => {
    if (!selectedFuels.includes(energyType)) {
      setSelectedFuels([...selectedFuels, energyType]);
      fetchFuelData(energyType); 
    }
  };

  const fetchFuelData = async (energyType) => {
    try {
      const response = await api.post("/api/get-energy-data", { energy_type: energyType });
      setEmissionData((prev) => ({
        ...prev,
        [energyType]: {
          description: response.data.description,
          emissionFactor: response.data.emission_factor,
          uom: response.data.uom || "Unknown",
          emission_factor_UOM :response.data.emission_factor_UOM
        },
      }));
    } catch (error) {
      console.error("Error fetching fuel data:", error);
      setError(`Error fetching fuel data for ${energyType}`);
    }
  };


  // Toggle description visibility
  const toggleDescription = (energyType) => {
    if (!emissionData[energyType]) {
      fetchFuelData(energyType);
    }
    setShowDescription((prev) => ({
      ...prev,
      [energyType]: !prev[energyType], 
    }));
  };

  // Render description dynamically
  const renderDescription = (energyType) => {
    const fuelData = emissionData[energyType];
    if (fuelData && showDescription[energyType]) {
      return (
        <p className="description">
          {fuelData.description || "No description available."}
        </p>
      );
    }
    return null;
  };

  const calculateEmissions = (energyType) => {
    const data = emissionData[energyType];
    if (data && data.value && data.emissionFactor) {
      return (data.value * data.emissionFactor).toFixed(2);
    }
    return 0;
  };
  const totalEmissions = () => {
    let total = 0.0; 
  
    total = selectedFuels.reduce((total, fuelType) => {
      const data = emissionData[fuelType];
      if (data && data.value && data.emissionFactor) {
        return total + data.value * data.emissionFactor;
      }
      return total;
    }, total);
    if (total===0.0){
      return total;
    } else{
    return `${total.toFixed(2)} kgCO₂e`; 
    }
  };
  const handleInputChange = (energyType, field, value) => {
    setEmissionData((prev) => ({
      ...prev,
      [energyType]: {
        ...prev[energyType],
        [field]: value,
      },
    }));
  };
  const saveData = async () => {
    const storedData = selectedFuels.map((fuelType) => ({
      fuelType,
      dataAvailable: emissionData[fuelType]?.dataAvailable || "",
      uom: emissionData[fuelType]?.uom || "",
      value: emissionData[fuelType]?.value || 0,
      actualEstimated: emissionData[fuelType]?.actualEstimated || "",
      attachment: emissionData[fuelType]?.attachment ? emissionData[fuelType]?.attachment.name : "",
      emissionFactor: emissionData[fuelType]?.emissionFactor || "",
      emissionFactorUOM: emissionData[fuelType]?.emission_factor_UOM || "",
      emissions: calculateEmissions(fuelType)
    }));
    
    storedData.push({company:localStorage.getItem("company")});
    storedData.push({scopetype:"Scope2"});

    // localStorage.setItem("StationaryCombustion", JSON.stringify(storedData));
    const response = await api.post("/api/emission-data", storedData);
    if (response.status === 200) {
      console.log("done");
      
    } else {
      console.error("Unexpected response:", response);
    }
    
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
            <th>Emission Factor UOM</th>
            <th>Emissions</th>
          </tr>
        </thead>
        <tbody>
          {selectedFuels.map((energyType) => (
            <tr key={energyType}>
              <td>{energyType}</td>
              <td>
                <select
                  onChange={(e) =>
                    handleInputChange(energyType, "dataAvailable", e.target.value)
                  }
                  className="dropdown"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td>{emissionData[energyType]?.uom || "Loading..."}</td>
              <td>
                <input
                  type="number"
                  placeholder="Enter value"
                  onChange={(e) =>
                    handleInputChange(energyType, "value", parseFloat(e.target.value))
                  }
                  className="input-field"
                />
              </td>
              <td>
                <select
                  onChange={(e) =>
                    handleInputChange(energyType, "actualEstimated", e.target.value)
                  }
                  className="dropdown"
                >
                  <option value="Actual">Actual</option>
                  <option value="Estimated">Estimated</option>
                </select>
              </td>
              <td>
                <div className="file-upload">
                  <label htmlFor={`file-${energyType}`} className="file-upload-label">
                    Choose File
                  </label>
                  <input
                    id={`file-${energyType}`}
                    type="file"
                    className="file-upload-input"
                    onChange={(e) =>
                      handleInputChange(energyType, "attachment", e.target.files[0])
                    }
                  />
                </div>
              </td>
              <td>{emissionData[energyType]?.emissionFactor || "Fetching..."}</td>
              <td>{emissionData[energyType]?.emission_factor_UOM || "Fetching..."}</td>
              <td>{calculateEmissions(energyType)}</td>
            </tr>
          ))}
          <tr>
                <td colSpan="8" style={{ textAlign: "right", fontWeight: "bold" }}>Total Emissions:</td>
                <td style={{ fontWeight: "bold" }}>{totalEmissions()}</td>
              </tr>
        </tbody>
      </table>
      <button className="save-button" onClick={saveData}>Save Data</button>
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
        {energyTypes.map((energyType) => (
          <tr key={energyType}>
            <td>
              <input
                type="checkbox"
                onChange={() => handleFuelSelect(energyType)}
                checked={selectedFuels.includes(energyType)}
              />
            </td>
            <td>{energyType}</td>
            <td>
              <FaLightbulb
                onClick={() => toggleDescription(energyType)}
                className="lightbulb-icon"
              />
              {renderDescription(energyType)}
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
