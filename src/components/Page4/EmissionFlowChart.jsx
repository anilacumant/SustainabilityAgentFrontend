import React from "react";
import { Pie } from "react-chartjs-2";
import "./styles.css";

const EmissionFlowChart = ({ data }) => {
  const chartData = {
    labels: data.chart.map((item) => item.label),
    datasets: [
      {
        label: "Emissions (kg CO₂e)",
        data: data.chart.map((item) => item.value),
        backgroundColor: [
          "#4caf50",
          "#ff9800",
          "#f44336",
          "#2196f3",
          "#9c27b0",
          "#ffeb3b",
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="emission-flow-chart">
      <h2>Emissions Breakdown</h2>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default EmissionFlowChart;
