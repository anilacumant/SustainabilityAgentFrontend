import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import BasicInfoForm from "./components/Page1/BasicInfoForm";
import ScopeSelection from "./components/Page2/ScopeSelection";
import FuelSelection from "./components/Page3/StationaryCombustion/FuelSelection"; // Import FuelSelection
import FugitiveSelection from "./components/Page3/FugitiveEmissions/FugitiveSelection";
function App() {
  return (
    <Router>
      <Routes>
        {/* Define the routes for the pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/page1" element={<BasicInfoForm />} />
        <Route path="/page2" element={<ScopeSelection />} />
        <Route path="/stationary-fuel-selection" element={<FuelSelection />} /> {/* New route */}
        <Route path="/fugitive-emissions" element={<FugitiveSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
