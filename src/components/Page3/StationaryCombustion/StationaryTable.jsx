import React, { useState } from "react";
import "./styles.css";

const StationaryTable = ({ selectedFuels }) => {
  const [fuelData, setFuelData] = useState(
    selectedFuels.map((fuel) => ({
      fuelType: fuel,
      dataAvailable: "No",
      uom: "",
      value: "",
      emissionFactor: "",
      emissions: "",
    }))
  );

  const handleInputChange = (index, field, value) => {
    const updatedData = [...fuelData];
    updatedData[index][field] = value;

    // Automatically calculate emissions if value and emissionFactor are provided
    if (field === "value" || field === "emissionFactor") {
      const valueNum = parseFloat(updatedData[index].value || 0);
      const factorNum = parseFloat(updatedData[index].emissionFactor || 0);
      updatedData[index].emissions = (valueNum * factorNum).toFixed(2) || "";
    }

    setFuelData(updatedData);
  };

  return (
    <div className="stationary-table">
      <h3>Fuel Data Input</h3>
      <table>
        <thead>
          <tr>
            <th>Fuel Type</th>
            <th>Data Available?</th>
            <th>UoM</th>
            <th>Value</th>
            <th>Emission Factor</th>
            <th>Emissions</th>
          </tr>
        </thead>
        <tbody>
          {fuelData.map((row, index) => (
            <tr key={index}>
              <td>{row.fuelType}</td>
              <td>
                <select
                  value={row.dataAvailable}
                  onChange={(e) =>
                    handleInputChange(index, "dataAvailable", e.target.value)
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Unit"
                  value={row.uom}
                  onChange={(e) =>
                    handleInputChange(index, "uom", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="Value"
                  value={row.value}
                  onChange={(e) =>
                    handleInputChange(index, "value", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="Emission Factor"
                  value={row.emissionFactor}
                  onChange={(e) =>
                    handleInputChange(index, "emissionFactor", e.target.value)
                  }
                />
              </td>
              <td>{row.emissions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StationaryTable;
