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

  const navigate = useNavigate(); // Use navigate for routing

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted successfully!");
    navigate("/page2"); // Redirect to Page 2
  };

  return (
    <form className="basic-info-form" onSubmit={handleSubmit}>
      <h1>Basic Information</h1>
      <input
        type="text"
        placeholder="Company Name"
        value={formData.companyName}
        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
      />
      <Dropdown
        label="Sector"
        options={["Technology", "Finance", "Energy"]}
        value={formData.sector}
        onChange={(value) => setFormData({ ...formData, sector: value })}
      />
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Job Title"
        value={formData.jobTitle}
        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
      />
      <Dropdown
        label="Department"
        options={["HR", "Engineering", "Sales"]}
        value={formData.department}
        onChange={(value) => setFormData({ ...formData, department: value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
      />
      <Dropdown
        label="Country"
        options={countries}
        value={formData.officeLocation}
        onChange={(value) => setFormData({ ...formData, officeLocation: value })}
      />
      <DatePicker
        label="Reporting Start Date"
        value={formData.startDate}
        onChange={(date) => setFormData({ ...formData, startDate: date })}
      />
      <DatePicker
        label="Reporting End Date"
        value={formData.endDate}
        onChange={(date) => setFormData({ ...formData, endDate: date })}
      />
      <button type="submit">Next</button>
    </form>
  );
};

export default BasicInfoForm;
