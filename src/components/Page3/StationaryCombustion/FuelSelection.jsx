import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FaLightbulb } from "react-icons/fa"; 
import api from "../../../api";
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
    "Hydrogen",
  ]);
  const [description,setDescription] = useState('')
  const [selectedFuels, setSelectedFuels] = useState([]);
  const [emissionData, setEmissionData] = useState({});
  const [customFuel, setCustomFuel] = useState("");
  const [showDescription, setShowDescription] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFuelTypes = async () => {
      try {
        const response = await api.post("/api/get-fuels", {
          scope: "Stationary Combustion",
          company_row_key: localStorage.getItem("company"),
        });
  
        const apiFuelTypes = response.data.fuels.stationary_combustion || []; 
        setFuelTypes((prevFuelTypes) => [...new Set([...prevFuelTypes, ...apiFuelTypes])]);
        setDescription(response.data.description); 
  
        setSelectedFuels(apiFuelTypes);
        apiFuelTypes.forEach(fetchFuelData);
      } catch (err) {
        console.error("Error fetching fuel types:", err);
        setError("Failed to load fuel types.");
      }
    };
  
    fetchFuelTypes();
  }, []);
  

  const handleFuelSelect = (fuelType) => {
    setSelectedFuels((prevSelectedFuels) => 
      prevSelectedFuels.includes(fuelType)
        ? prevSelectedFuels.filter((fuel) => fuel !== fuelType)
        : [...prevSelectedFuels, fuelType] 
    );
  
    if (!selectedFuels.includes(fuelType)) {
      fetchFuelData(fuelType);
    }
  };

  const fetchFuelData = async (fuelType) => {
    try {
      const response = await api.post("/api/get-fuel-data", { fuel_type: fuelType });
      setEmissionData((prev) => ({
        ...prev,
        [fuelType]: {
          description: response.data.description,
          emissionFactor: response.data.emission_factor !== undefined ? response.data.emission_factor : 0.0,
          uom: response.data.uom || "Unknown",
          emission_factor_UOM: response.data.emission_factor_UOM,
        },
      }));
    } catch (error) {
      console.error("Error fetching fuel data:", error);
      setError(`Error fetching fuel data for ${fuelType}`);
    }
  };

  const handleAddCustomFuel = () => {
    if (customFuel && !fuelTypes.includes(customFuel)) {
      setFuelTypes([...fuelTypes, customFuel]);
      fetchFuelData(customFuel);
      setCustomFuel("");
    }
  };

   const toggleDescription = (fuelType) => {
    if (!emissionData[fuelType]) {
      fetchFuelData(fuelType);
    }
    setShowDescription((prev) => ({
      ...prev,
      [fuelType]: !prev[fuelType],
    }));
  };

  const renderDescription = (fuelType) => {
    const fuelData = emissionData[fuelType];
    if (fuelData && showDescription[fuelType]) {
      return <p className="description">{fuelData.description || "No description available."}</p>;
    }
    return null;
  };

  const calculateEmissions = (fuelType) => {
    const data = emissionData[fuelType];    
    
    if (data && data.value && data.emissionFactor) {
      return (data.value * data.emissionFactor).toFixed(2);
    }
    return 0;
  };

  const totalEmissions = () => {
    let total = selectedFuels.reduce((sum, fuelType) => {
      const data = emissionData[fuelType];
      if (data && data.value && data.emissionFactor) {
        return sum + data.value * data.emissionFactor;
      }
      return sum;
    }, 0);
    
    return total === 0 ? total : `${total.toFixed(2)} kgCO₂e`;
  };

  const handleInputChange = (fuelType, field, value) => {
    setEmissionData((prev) => ({
      ...prev,
      [fuelType]: {
        ...prev[fuelType],
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
      emissions: calculateEmissions(fuelType),
    }));

    storedData.push({ company: localStorage.getItem("company") });
    storedData.push({ scopetype: "StationaryCombustion" });

    try {
      const response = await api.post("/api/emission-data", storedData);
      if (response.status === 200) {
        console.log("Data saved successfully");
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="fuel-selection-container">
      <h1 className="fuel-selection-title">Stationary Combustion</h1>

      {error && <p className="error-message">{error}</p>}

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
          <button onClick={handleAddCustomFuel} className="custom-fuel-btn">Add</button>
        </div>
      </div>
      
        {/* Selected Fuels Data Table */}
        {selectedFuels.length > 0 && (
    <div className="based-on-items-section">
      <h2>Based on Chosen Items</h2>
      <table className="based-on-items-table">
        <thead>
          <tr>
            <th>Fuel Type</th>
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
              <td>{emissionData[fuelType]?.emissionFactor !== undefined ? emissionData[fuelType]?.emissionFactor : "Fetching..."}</td>
              <td>{emissionData[fuelType]?.emission_factor_UOM || "Fetching..."}</td>
              <td>{calculateEmissions(fuelType)}</td>
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
      <ReactMarkdown>{description}</ReactMarkdown>
        <table className="fuel-selection-table">
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

      
    </div>
  );
};

export default FuelSelection;
