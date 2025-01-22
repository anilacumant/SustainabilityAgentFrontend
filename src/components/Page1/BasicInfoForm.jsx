import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        {/* Row 1: Company Name and Sector */}
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            placeholder="Enter Company Name"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Sector</label>
          <select
            value={formData.sector}
            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
          >
            <option value="">Select Sector</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Energy">Energy</option>
          </select>
        </div>

        {/* Row 2: Name and Job Title */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            placeholder="Enter Job Title"
            value={formData.jobTitle}
            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
          />
        </div>

        {/* Row 3: Department and Email */}
        <div className="form-group">
          <label>Department</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* Row 4: Phone Number and Country */}
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="Enter Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <select
            value={formData.officeLocation}
            onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Row 5: Dates */}
        <div className="inline-group">
          <div className="form-group">
            <label>Reporting Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Reporting End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Next
        </button>
      </form>
    </div>
  );
};

export default BasicInfoForm;
