import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import DatePicker from "./DatePicker";
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
    startDate: "",
    endDate: "",
  });

  const countries = ["United States", "India", "United Kingdom", "Australia", "Canada"];
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted successfully!");
    navigate("/page2");
  };

  return (
    <div className="form-container">
      <h1>Basic Information</h1>
      <form className="basic-info-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Left Column */}
          <div className="form-column">
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <Dropdown
                label="Sector"
                options={["Technology", "Finance", "Energy"]}
                value={formData.sector}
                onChange={(value) => setFormData({ ...formData, sector: value })}
              />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <Dropdown
                label="Department"
                options={["HR", "Engineering", "Sales"]}
                value={formData.department}
                onChange={(value) => setFormData({ ...formData, department: value })}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="form-column">
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <Dropdown
                label="Country"
                options={countries}
                value={formData.officeLocation}
                onChange={(value) => setFormData({ ...formData, officeLocation: value })}
              />
            </div>
          </div>
        </div>

        {/* Full-width Section */}
        <div className="form-dates">
          <div className="form-group">
            <label>Reporting Start Date</label>
            <DatePicker
              value={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
            />
          </div>
          <div className="form-group">
            <label>Reporting End Date</label>
            <DatePicker
              value={formData.endDate}
              onChange={(date) => setFormData({ ...formData, endDate: date })}
            />
          </div>
        </div>

        <button type="submit" className="submit-button">Next</button>
      </form>
    </div>
  );
};

export default BasicInfoForm;
