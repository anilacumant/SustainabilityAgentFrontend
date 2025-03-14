import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import { useNavigate } from "react-router-dom";
import HighchartsReact from 'highcharts-react-official';
import { Leaf, Wind, Car, Factory, Zap } from 'lucide-react';
import ChatModal from '../Page2/ChatModal';
import api from '../../api';
import './Dashboard.css';

const EmissionsDashboard = () => {
  const navigate = useNavigate();
  const [emissionsData, setEmissionsData] = useState({
    stationaryData: 0,
    mobileData: 0,
    fugitiveData: 0,
    scope2Data: 0,
  });
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchEmissionsData = async () => {
      try {
        const response = await api.post('/api/get-emission-data', {
          company: localStorage.getItem("company"),
        });
        setEmissionsData(response.data);
      } catch (error) {
        console.error('Error fetching emissions data:', error);
      }
    };

    fetchEmissionsData();
  }, []);

  const emissions = [
    {
      category: "Fugitive Emissions",
      value: emissionsData.fugitiveData,
      icon: Wind,
    },
    {
      category: "Mobile Combustion",
      value: emissionsData.mobileData,
      icon: Car,
    },
    {
      category: "Stationary Combustion",
      value: emissionsData.stationaryData,
      icon: Factory,
    },
    {
      category: "Scope 2",
      value: emissionsData.scope2Data,
      icon: Zap,
    },
  ];

  const totalEmissions = emissions.reduce((acc, curr) => acc + curr.value, 0);

  const chartOptions = {
    chart: {
      type: 'column',
      height: '400px',
      style: {
        fontFamily: 'inherit'
      },
      backgroundColor: 'transparent'
    },
    title: {
      text: null
    },
    xAxis: {
      categories: emissions.map(item => item.category),
      labels: {
        style: {
          color: '#6b7280'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Emissions',
        style: {
          color: '#374151'
        }
      },
      labels: {
        style: {
          color: '#6b7280'
        }
      }
    },
    series: [{
      name: 'Scopes',
      data: emissions.map(item => ({
        y: item.value,
        name: item.category
      })),
      color: '#059669'
    }],
    plotOptions: {
      column: {
        borderRadius: 8,
        states: {
          hover: {
            color: '#047857'
          }
        }
      }
    },
    credits: {
      enabled: false
    }
  };

  const pieChartOptions = {
    chart: {
      type: 'pie',
      height: '400px',
      backgroundColor: 'transparent'
    },
    title: {
      text: 'Emissions Distribution',
      style: {
        color: '#374151',
        fontSize: '16px'
      }
    },
    series: [{
      name: 'Emissions',
      data: emissions.map(item => ({
        name: item.category,
        y: item.value
      })),
      colors: ['#059669', '#047857', '#065f46', '#064e3b']
    }],
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f}%'
        },
        showInLegend: true,
      }
    },
    legend: {
      enabled: true,
      align: 'left',
      verticalAlign: 'start',
      layout: 'vertical',
      itemStyle: {
        color: '#374151',
        fontSize: '14px'
      }
    },
    credits: {
      enabled: false
    }
  };
  

  return (
    <div className="dashboard">
      <button className="eco-button" onClick={()=>navigate('/scopeselection')}>Go to scope selection</button>

      <div className="container">
        <header className="header">
          <div className="header-title">
            <div className="icon-container">
              <Leaf size={32} />
            </div>
            <h1 className="dashboard-title">Emissions Dashboard</h1>
          </div>
          <div className="total-emissions">
            <p className="total-emissions-label">Total Emissions</p>
            <p className="total-emissions-value">
              {totalEmissions.toLocaleString()} kgCO₂e
            </p>
          </div>
        </header>

        <div className="emissions-grid">
          {emissions.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.category} className="emission-card">
                <div className="card-header">
                  <div className="card-icon">
                    <Icon />
                  </div>
                  <h3 className="card-title">{item.category}</h3>
                </div>
                <p className="card-value">
                  {item.value.toLocaleString()} kgCO₂e
                </p>
              </div>
            );
          })}
        </div>

        <div className="charts-container">
          <div className="chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          </div>
          <div className="chart-wrapper">
            <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
          </div>
        </div>
      </div>
      <div className="chat-wrapper">
        <button className="chat-btn" onClick={() => setShowChat(!showChat)}>
          {showChat ? "Close Chat" : "Need Help"} 
          <span className="chat-icon">{showChat ? "×" : "?"}</span>
        </button>
        {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      </div>
    </div>
  );
};

export default EmissionsDashboard;