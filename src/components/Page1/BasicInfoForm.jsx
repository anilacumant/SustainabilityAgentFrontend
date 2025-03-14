import React, { useState, useEffect, useCallback } from "react";
import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./styles.css";

const BasicInfoForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    sector: "",
    name: "",
    jobTitle: "",
    department: "",
    email: "",
    phoneNumber: "",
    officeLocation: "",
    country: "",
    state: "",
    city: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dynamicSectors, setDynamicSectors] = useState([]); // Stores fetched sectors
  const navigate = useNavigate();

  const countries = Country.getAllCountries();
  const states = formData.country ? State.getStatesOfCountry(formData.country) : [];
  const cities = formData.state ? City.getCitiesOfState(formData.country, formData.state) : [];

  const staticSectors = [
    "Clean Energy",
    "Sustainable Manufacturing",
    "Green Technology",
    "Environmental Services",
    "Waste Management",
    "Carbon Capture",
    "Renewable Resources",
  ];

  const departments = [
    "Environmental Control",
    "Sustainability",
    "Emissions Management",
    "Compliance",
    "Green Operations",
    "Environmental Research",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = "Company name is required";
    if (!formData.sector) newErrors.sector = "Sector is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number";
    }
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.city) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchSector = useCallback(async (companyName) => {
    console.log(companyName);
    
    if (!companyName) {
      setFormData((prevData) => ({ ...prevData, sector: "" }));
      return;
    }

    try {
      const response = await api.post(`/api/get-sector`,{companyname:companyName});
      if (response.status === 200 && response.data?.sector) {
        const fetchedSector = response.data.sector;

        setDynamicSectors((prevSectors) =>
          prevSectors.includes(fetchedSector) ? prevSectors : [...prevSectors, fetchedSector]
        );

        setFormData((prevData) => ({ ...prevData, sector: fetchedSector }));
      }
    } catch (error) {
      console.error("Error fetching sector:", error);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSector(formData.companyName);
    }, 1000); 

    return () => clearTimeout(delayDebounceFn);
  }, [formData.companyName, fetchSector]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // if (!validateForm()) {
    //   return;
    // }

    setLoading(true);
    try {
      console.log(formData);
      
      const response = await api.post("/api/get-basic-information", formData);
      if (response.status === 200) {
        console.log(response.data.companyRowKey);
        localStorage.setItem("company", response.data.companyRowKey);
        localStorage.setItem("isFormFilled", "true");
        
        navigate("/scopes"); 
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">
            Basic Information
          </h1>
        </div>

        <div className="form-content">
          <form onSubmit={handleSubmit} className={loading ? 'form-loading' : ''}>
            {/* Company Information & Job Title */}
            <div className="form-section">
              <div className="form-grid">
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.companyName ? 'error' : ''}`}
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                  {errors.companyName && <span className="error-message">{errors.companyName}</span>}
                </div>

                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your job title"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  />
                </div>
              </div>
            </div>
            {/* Full Name & Phone Number */}
            <div className="form-section">
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your first name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your last name"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Department & Sector */}
            <div className="form-section">
              <div className="form-grid">
                <div className="form-group">
                  <label>Department</label>
                  <select
                    className="form-control"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Sector</label>
                  <select
                    className={`form-control ${errors.sector ? 'error' : ''}`}
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  >
                    <option value="">Select Sector</option>
                    {[...staticSectors, ...dynamicSectors].map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                  {errors.sector && <span className="error-message">{errors.sector}</span>}
                </div>
              </div>
            </div>
            {/* Email & Country */}
            <div className="form-section">
              <div className="form-grid">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <select
                    className="form-control"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value, state: "" })}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* State & City */}
            <div className="form-section">
              <div className="form-grid">
                <div className="form-group">
                  <label>State</label>
                  <select
                    className="form-control"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    disabled={!formData.country}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>City</label>
                  <select
                    className="form-control"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={!formData.state}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Start Date & End Date */}
            <div className="form-section">
              <div className="form-grid">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="button-group">
              <button
                type="button"
                className="back-button"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
