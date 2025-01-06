import React, { useState, useEffect } from "react";
import EmissionFlowChart from "./EmissionFlowChart";
import "./styles.css";

const EmissionSummary = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch summary data from the backend
    fetch("/api/emission-summary")
      .then((response) => response.json())
      .then((data) => {
        setSummaryData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching emission summary:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading Emission Summary...</div>;
  }

  if (!summaryData) {
    return <div className="error">Failed to load emission summary.</div>;
  }

  return (
    <div className="emission-summary">
      <h1>Emission Summary</h1>
      <EmissionFlowChart data={summaryData} />

      <div className="summary-details">
        <h2>Details</h2>
        <table>
          <thead>
            <tr>
              <th>Scope</th>
              <th>Fuel Type</th>
              <th>Emissions (kg CO₂e)</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.details.map((item, index) => (
              <tr key={index}>
                <td>{item.scope}</td>
                <td>{item.fuelType}</td>
                <td>{item.emissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmissionSummary;
