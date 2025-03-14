import React from "react";
import { BrowserRouter as Router, Routes, Route,Navigate  } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import BasicInfoForm from "./components/Page1/BasicInfoForm";
import ScopeSelection from "./components/Page2/ScopeSelection";
import SustainabilityNav from "./components/CombinedScopes/SustainabilityNav";
import EmissionsDashboard from "./components/Dashboard/EmissionsDashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/basicinformation" element={localStorage.getItem("company") && localStorage.getItem("company").trim() !== ""? <EmissionsDashboard /> : <BasicInfoForm />}/>
        <Route path="/scopeselection" element={localStorage.getItem("isFormFilled")=="true"?<ScopeSelection />:<Navigate to="/basicinformation" />} />
        <Route path="/scopes-details" element={<SustainabilityNav />} />
        <Route path="/dashboard" element={<EmissionsDashboard />} />
        <Route path="/scopes" element={<ScopeSelection />} />


      </Routes>
    </Router>
  );
}

export default App;
