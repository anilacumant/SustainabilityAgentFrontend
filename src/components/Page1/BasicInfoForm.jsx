import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import PopupMessage from "./PopupMessage";

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

  const [isPopupVisible, setPopupVisible] = useState(false);
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", 
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "The Bahamas", 
    "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", 
    "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", 
    "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", 
    "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", 
    "Costa Rica", "Ivory Coast", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor (Timor-Leste)", 
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", 
    "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "The Gambia", 
    "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", 
    "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", 
    "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", 
    "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", 
    "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", 
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", 
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", 
    "Mauritania", "Mauritius", "Mexico", "Micronesia, Federated States of", "Moldova", 
    "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", 
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", 
    "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", 
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", 
    "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", 
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", 
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", 
    "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", 
    "Sri Lanka", "Sudan", "Sudan, South", "Suriname", "Sweden", "Switzerland", 
    "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", 
    "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", 
    "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", 
    "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", 
    "Zimbabwe"
];
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setPopupVisible(true); // Show the custom pop-up
  };

  const handlePopupClose = () => {
    setPopupVisible(false); // Hide the pop-up
    navigate("/page2"); // Navigate to the next page
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

      {/* Custom Pop-up */}
      {isPopupVisible && (
        <PopupMessage
          message="Form submitted successfully!"
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
};

export default BasicInfoForm;
