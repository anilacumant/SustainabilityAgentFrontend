import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import api from "../../../api";
import "./FugitiveSelection.css";

const GasList = ({ gases, fuelType, onSelectionChange, fetchFuelData, preselectedGases }) => {
  // This state should reflect both API gases and preselected gases
  const [allGases, setAllGases] = useState(gases);
  const [checkedGases, setCheckedGases] = useState(allGases.map(gas => preselectedGases.includes(gas)));
  const processedGases = useRef(new Set());

  useEffect(() => {
    // Merge gases from API with preselected gases to avoid duplicates
    const combinedGases = [...new Set([...gases, ...preselectedGases])];
    setAllGases(combinedGases);
    // console.log(allGases)
    
    // Update the checked and unchecked states based on the combined list
    const updatedChecked = combinedGases.map(gas => preselectedGases.includes(gas));
    setCheckedGases(updatedChecked);
    
    // Fetch data for preselected gases that haven't been processed yet
    preselectedGases.forEach((gas) => {
      const key = `${fuelType}:${gas}`;
      if (!processedGases.current.has(key)) {
        fetchFuelData(gas, fuelType);
        processedGases.current.add(key);
      }
    });
  }, [preselectedGases, gases, fetchFuelData, fuelType]);

  const handleCheckboxChange = (index, gas) => {
    // Only fetch if we haven't already processed this gas
    const key = `${fuelType}:${gas}`;
    if (!processedGases.current.has(key)) {
      fetchFuelData(gas, fuelType);
      processedGases.current.add(key);
    }
  
    setCheckedGases((prevChecked) => {
      const updated = [...prevChecked];
      updated[index] = !updated[index];
  
      // Update the unchecked state as the complement of checked state
  
      // Use allGases instead of gases to include both API and preselected gases
      const selectedGases = allGases.filter((_, idx) => updated[idx]);
  
      if (onSelectionChange) {
        onSelectionChange(fuelType, selectedGases);
      }
      return updated;
    });
  };

  return (
    <div className="gas-list">
      {allGases.map((gas, index) => (
        <div key={index} className="gas-item" style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <input 
            type="checkbox" 
            checked={checkedGases[index]} 
            onChange={() => handleCheckboxChange(index, gas)} 
          />
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
  const [description, setDescription] = useState('');
  const [customFuel, setCustomFuel] = useState("");
  const [selectedGases, setSelectedGases] = useState({});
  const [emissionData, setEmissionData] = useState({});
  const [gasData, setGasData] = useState({});
  const [gasLoading, setGasLoading] = useState({});
  const [showDescription, setShowDescription] = useState({});
  const [selectedSources, setselectedSources] = useState([]);

  const [totalGases, settotalGases] = useState([]);
  
  const [error, setError] = useState(null);

  // Global cache to track which gas/fuel combinations we've already fetched data for
  const fetchedDataCache = useRef(new Set());
  // Track ongoing API requests
  const pendingRequests = useRef(new Set());

  const fetchFuelData = useCallback(async (gas, fuelType) => {
    const key = `${fuelType}:${gas}`;
    
    // Skip if we already have this data, if it's already fetched, or if there's a pending request
    if (emissionData[key] || fetchedDataCache.current.has(key) || pendingRequests.current.has(key)) {
      return;
    }
    
    // Mark this request as in progress
    pendingRequests.current.add(key);
    fetchedDataCache.current.add(key);
    
    try {
      const response = await api.post("/api/get-fuel-data", { fuel_type: gas });
      setEmissionData((prev) => {
        // Only update if we don't already have this data
        if (prev[key]) return prev;
        
        return {
          ...prev,
          [key]: {
            description: response.data.description,
            emissionFactor: response.data.emission_factor !== undefined ? response.data.emission_factor : 0.0,
            uom: response.data.uom || "Unknown",
            emission_factor_UOM: response.data.emission_factor_UOM,
            gas: gas,
            fuelType: fuelType
          }
        };
      });
    } catch (error) {
      console.error("Error fetching fuel data:", error);
      setError(`Error fetching fuel data for ${gas}`);
      // If there was an error, remove from the fetched cache so we can try again later
      fetchedDataCache.current.delete(key);
    } finally {
      // Remove from pending requests
      pendingRequests.current.delete(key);
    }
  }, [emissionData]);
  
  const fetchGasData = useCallback(async (fuelType) => {
    // Skip if we're already loading this data
    // if (gasLoading[fuelType]) {
    //   return;
    // }
    
    setGasLoading((prev) => ({ ...prev, [fuelType]: true }));
    try {
      const response = await api.post("/api/get-sources-fugitive-emissions", { gas_type: fuelType });
      
      // Get existing preselected gases for this fuel type
      const preselected = selectedGases[fuelType] || [];
      
      // Merge API response with preselected gases to avoid duplicates
      const combinedGases = [...new Set([...response.data.res, ...preselected])];
      
      setGasData((prev) => ({
        ...prev,
        [fuelType]: {
          gases: combinedGases,
        },
      }));
    } catch (error) {
      console.error("Error fetching gas data:", error);
      setError(`Error fetching gas data for ${fuelType}`);
    } finally {
      setGasLoading((prev) => ({ ...prev, [fuelType]: false }));
    }
  }, [gasLoading, selectedGases]);

  const toggleDescription = useCallback((fuelType) => {
    // No need to fetch gas data again if we already have it
    fetchGasData(fuelType);
    
  
    setShowDescription((prev) => ({
      ...prev,
      [fuelType]: !prev[fuelType], 
    }));
  }, [gasData, gasLoading, fetchGasData]);

  useEffect(() => {
    const fetchFuelTypes = async () => {
      try {
        const response = await api.post("/api/get-fuels", {
          scope: "Fugitive Emissions",
          company_row_key: localStorage.getItem("company"),
        });
  
        if (response.data && response.data.fuels && response.data.fuels.fugitive_emissions) {
          const fugitiveEmissions = response.data.fuels.fugitive_emissions;
          
          // Extract sources with non-empty arrays
          const sourcesWithValues = Object.keys(fugitiveEmissions).filter(
            key => fugitiveEmissions[key].length > 0
          );
          setselectedSources(sourcesWithValues);
          
          try {
            for (const fuelType of sourcesWithValues) {
              try {
                const response = await api.post("/api/get-sources-fugitive-emissions", { gas_type: fuelType });
          
                // Directly use API response data
                setGasData(prev => ({
                  ...prev,
                  [fuelType]: { gases: response.data.res },
                }));
              } catch (error) {
                console.error(`Error fetching gas data for ${fuelType}:`, error);
                setError(prev => ({ ...prev, [fuelType]: `Error fetching gas data for ${fuelType}` }));
              } 
            }
          } catch (error) {
            console.error("Unexpected error:", error);
          }
          
          
          // setGasData(initialGasData);
          
          // Set the selected gases
          setSelectedGases(fugitiveEmissions);
  
          // Fetch data for each gas from each fuel type - but only once
          Object.entries(fugitiveEmissions).forEach(([fuelType, gases]) => {
            gases.forEach(gas => {
              const key = `${fuelType}:${gas}`;
              if (!fetchedDataCache.current.has(key)) {
                fetchFuelData(gas, fuelType);
              }
            });
          });
          
          // Set initial showDescription state for all fuel types with gases
          const initialShowDescription = {};
          Object.entries(fugitiveEmissions).forEach(([fuelType, gases]) => {
            if (gases && gases.length > 0) {
              initialShowDescription[fuelType] = true;
            }
          });
          setShowDescription(initialShowDescription);
        }
  
        setDescription(response.data.description);
      } catch (err) {
        console.error("Error fetching fuel types:", err);
        setError("Failed to load fuel types.");
      }
    };
  
    fetchFuelTypes();
  }, []);

  const handleAddCustomFuel = () => {
    if (customFuel && !fuelTypes.includes(customFuel)) {
      setFuelTypes([...fuelTypes, customFuel]); 
      setGasData((prev) => ({
        ...prev,
        [customFuel]: { gases: [] }, 
      }));
      setSelectedGases((prev) => ({
        ...prev,
        [customFuel]: [],
      }));
      setCustomFuel(""); 
    }
  };
  
  const handleGasSelection = (fuelType, selectedGasList) => {
    setSelectedGases((prev) => ({
      ...prev,
      [fuelType]: selectedGasList, 
    }));
  };

  // Calculate emissions for a specific gas and fuel type
  const calculateEmissions = (fuelType, gas) => {
    const key = `${fuelType}:${gas}`;
    const data = emissionData[key];
    
    if (data && data.value && data.emissionFactor) {
      const result = (data.value * data.emissionFactor).toFixed(2);
      return result;
    }
    return "0.00";
  };
  
  // Calculate total emissions across all gases and fuel types
  const totalEmissions = () => {
    let total = 0.0;
  
    Object.entries(selectedGases).forEach(([fuelType, gases]) => {
      gases.forEach((gas) => {
        const key = `${fuelType}:${gas}`;
        const data = emissionData[key];
        if (data && data.value && data.emissionFactor) {
          total += parseFloat(data.value) * parseFloat(data.emissionFactor);
        }
      });
    });
  
    return total > 0 ? `${total.toFixed(2)} kgCO₂e` : "0.00 kgCO₂e";
  };
  
  // Handle changes to emission data inputs
  const handleInputChange = (fuelType, gas, field, value) => {
    const key = `${fuelType}:${gas}`;
    
    setEmissionData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [field]: value,
        gas: gas,
        fuelType: fuelType
      },
    }));
  };

  // Save emission data to the API
  const saveData = async () => {
    const storedData = [];
  
    Object.entries(selectedGases).forEach(([fuelType, gases]) => {
      gases.forEach((gas) => {
        const key = `${fuelType}:${gas}`;
        const data = emissionData[key] || {};
  
        const emissionFactor = parseFloat(data.emissionFactor) || 0;
        const value = parseFloat(data.value) || 0;
        const emissions = (value * emissionFactor).toFixed(2);
  
        storedData.push({
          gasType: gas,
          source: fuelType,
          dataAvailable: data.dataAvailable || "No",
          uom: data.uom || "Unknown",
          value: data.value || 0,
          actualEstimated: data.actualEstimated || "Estimated",
          attachment: data.attachment ? data.attachment.name : "",
          emissionFactor: data.emissionFactor || "N/A",
          emissionFactorUOM: data.emission_factor_UOM || "N/A",
          emissions,
        });
      });
    });
  
    storedData.push({ company: localStorage.getItem("company") });
    storedData.push({ scopetype: "FugitiveEmissions" });

    try {
      const response = await api.post("/api/emission-data", storedData);
      if (response.status === 200) {
        alert("Data saved successfully!");
      } else {
        console.error("Unexpected response:", response);
        alert("Error saving data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data: " + error.message);
    }
  };

  return (
    <div className="fuel-selection-container">
      <h1 className="fuel-selection-title">Fugitive Emissions</h1>

      {/* Add Custom Fuel Section */}
      <div className="custom-fuel-section">
        <h2>Add Custom Fuel</h2>
        <div className="custom-fuel-container">
          <input
            type="text"
            value={customFuel}
            onChange={(e) => setCustomFuel(e.target.value)}
            placeholder="Enter source of Fugitive Emission"
            className="custom-fuel-input"
          />
          <button onClick={handleAddCustomFuel} className="custom-fuel-btn">
            Add
          </button>
        </div>
      </div>

      {/* Based on Selected Gases Section */}
      {Object.keys(selectedGases).some((fuel) => selectedGases[fuel] && selectedGases[fuel].length > 0) && (
        <div className="based-on-items-section">
          <h2>Based on Selected Gases</h2>
          <table className="based-on-items-table">
            <thead>
              <tr>
                <th>Gas Type</th>
                <th>Source</th>
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
              {Object.entries(selectedGases).flatMap(([fuelType, gases]) =>
                gases && gases.length > 0 ? gases.map((gas) => {
                  const key = `${fuelType}:${gas}`;
                  return (
                    <tr key={key}>
                      <td>{gas}</td>
                      <td>{fuelType}</td>
                      <td>
                        <select
                          value={emissionData[key]?.dataAvailable || "No"}
                          onChange={(e) =>
                            handleInputChange(fuelType, gas, "dataAvailable", e.target.value)
                          }
                          className="dropdown"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </td>
                      <td>{emissionData[key]?.uom || "Loading..."}</td>
                      <td>
                        <input
                          type="number"
                          placeholder="Enter value"
                          value={emissionData[key]?.value || ""}
                          onChange={(e) => handleInputChange(fuelType, gas, "value", parseFloat(e.target.value))}
                          className="input-field"
                        />
                      </td>
                      <td>
                        <select
                          value={emissionData[key]?.actualEstimated || "Estimated"}
                          onChange={(e) =>
                            handleInputChange(fuelType, gas, "actualEstimated", e.target.value)
                          }
                          className="dropdown"
                        >
                          <option value="Actual">Actual</option>
                          <option value="Estimated">Estimated</option>
                        </select>
                      </td>
                      <td>
                        <div className="file-upload">
                          <label htmlFor={`file-${key}`} className="file-upload-label">
                            {emissionData[key]?.attachment?.name || "Choose File"}
                          </label>
                          <input
                            id={`file-${key}`}
                            type="file"
                            className="file-upload-input"
                            onChange={(e) =>
                              handleInputChange(fuelType, gas, "attachment", e.target.files[0])
                            }
                          />
                        </div>
                      </td>
                      <td>{emissionData[key]?.emissionFactor !== undefined ? emissionData[key].emissionFactor : "Fetching..."}</td>
                      <td>{emissionData[key]?.emission_factor_UOM || "Fetching..."}</td>
                      <td>{calculateEmissions(fuelType, gas)}</td>
                    </tr>
                  );
                }) : []
              )}
              <tr>
                <td colSpan="9" style={{ textAlign: "right", fontWeight: "bold" }}>Total Emissions:</td>
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
                  {showDescription[fuelType] && (
                    <GasList
                      gases={gasData[fuelType]?.gases || []}
                      fuelType={fuelType}
                      onSelectionChange={handleGasSelection}
                      fetchFuelData={fetchFuelData}
                      preselectedGases={selectedGases[fuelType] || []}
                    />
                  )}
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
