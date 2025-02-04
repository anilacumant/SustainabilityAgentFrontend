import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import BasicInfoForm from "./components/Page1/BasicInfoForm";
import ScopeSelection from "./components/Page2/ScopeSelection";
import FuelSelection from "./components/Page3/StationaryCombustion/FuelSelection"; // Import FuelSelection
import FugitiveSelection from "./components/Page3/FugitiveEmissions/FugitiveSelection";
import MobileCombustion from "./components/Page3/MobileCombustion/MobileCombustion";
import Scope2Selection from "./components/Page3/Scope2/Scope2Selection";
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
        <Route path="/mobile-fuel-selection" element={<MobileCombustion />} />
        <Route path="/scope2-selection" element={<Scope2Selection />} />
      </Routes>
    </Router>
  );
}

export default App;
