import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const AdmissionForm = () => {
  const [sameAsAddress, setSameAsAddress] = useState(false);
  const [address, setAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    fatherName: "",
    motherName: "",
    dobYear: "",
    dobMonth: "",
    dobDay: "",
    gender: "select",
    qualification: "select",
    category: "select",
    aadhar: "",
    email: "",
    mobile: "",
    alternateMobile: "",
    address: "",
    permanent_address: "",
    nationality: "select",
    district: "",
    pincode: "",
    state: "",
    keralite: "select",
    religion: "select",
    caste: "select",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSameAsAddress = (e) => {
    const checked = e.target.checked;
    setSameAsAddress(checked);
    setFormData((prev) => ({
      ...prev,
      permanent_address: checked ? prev.address : "",
    }));
  };
  


  const validateForm = () => {
    if (!String(formData.fullname).trim()) return "Full Name is required.";
    if (!String(formData.fatherName).trim()) return "Father's Name is required.";
    if (!String(formData.motherName).trim()) return "Mother's Name is required.";
    if (!formData.dobYear || !formData.dobMonth || !formData.dobDay)
      return "Date of Birth is required.";
    if (formData.gender === "select") return "Gender is required.";
    if (formData.qualification === "select") return "Qualification is required.";
    if (!String(formData.aadhar).match(/^\d{12}$/)) return "Enter a valid 12-digit Aadhar number.";
    if (!String(formData.mobile).match(/^\d{10}$/)) return "Enter a valid 10-digit mobile number.";
    if (formData.alternateMobile && !String(formData.alternateMobile).match(/^\d{10}$/))
      return "Enter a valid 10-digit alternate mobile number.";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Enter a valid email address.";
    if (!formData.address.trim()) return "Address is required.";
    if (!String(formData.district).trim()) return "District is required.";
    if (!String(formData.pincode).match(/^\d{6}$/)) return "Enter a valid 6-digit pincode.";
    if (formData.nationality === "select") return "Nationality is required.";
    if (formData.keralite === "select") return "Keralite Status is required.";
    if (formData.religion === "select") return "Religion is required.";
    if (!String(formData.caste).trim()) return "Caste is required.";
    if (formData.category === "select") return "Category is required.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    try {
      
      const response = await axios.post("http://localhost:5000/register", formData, {
        headers: { "Content-Type": "application/json" },
      });

      alert(response.data.message);
      navigate("/photo-upload"); // Move to photo upload page after successful registration
    } catch (error) {
      console.error("Error Response:", error.response?.data);
      alert("Error: " + (error.response?.data?.error || "Something went wrong"));
    }
  };

  // Generate years dynamically (1960 - current year)
  const years = Array.from({ length: 65 }, (_, i) => 1960 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Application Form</h2>
      <form onSubmit={handleSubmit}> {/* Wrap all fields inside the form */}
        <label className="block font-semibold">Full Name</label>
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label className="block font-semibold mt-4">Father's Name</label>
        <input
          type="text"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label className="block font-semibold mt-4">Mother's Name</label>
        <input
          type="text"
          name="motherName"
          value={formData.motherName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label className="block font-semibold mt-4">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Enter email address"
        />

        <label className="block font-semibold mt-4">Date of Birth</label>
        <div className="flex gap-2">
          <select
            name="dobYear"
            value={formData.dobYear}
            onChange={handleChange}
            className="w-1/3 p-2 border rounded"
          >
            <option value="">Year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            name="dobMonth"
            value={formData.dobMonth}
            onChange={handleChange}
            className="w-1/3 p-2 border rounded"
          >
            <option value="">Month</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>

          <select
            name="dobDay"
            value={formData.dobDay}
            onChange={handleChange}
            className="w-1/3 p-2 border rounded"
          >
            <option value="">Day</option>
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block font-semibold">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="select">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold">Qualification</label>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="select">Select Qualification</option>
              <option value="Graduate">Graduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Twelfth">Twelfth</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block font-semibold">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter mobile number"
            />
          </div>
          <div>
            <label className="block font-semibold">Alternative Mobile Number</label>
            <input
              type="tel"
              name="alternateMobile"
              value={formData.alternateMobile}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter alternate number"
            />
          </div>
        </div>

        <label className="block font-semibold mt-4">Aadhar Number</label>
        <input
          type="text"
          name="aadhar"
          value={formData.aadhar}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Enter Aadhar number"
        />
        {/* Address Fields */}
        <div className="flex flex-col gap-4 mt-4">
          <label className="block font-semibold">Current Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter Current Address"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sameAsAddress}
              onChange={handleSameAsAddress}
              id="sameAsAddress"
            />
            <label htmlFor="sameAsAddress">Same as Current Address</label>
          </div>

          <label className="block font-semibold">Permanent Address</label>
          <input
            type="text"
            name="permanent_address"
            value={formData.permanent_address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter Permanent Address"
            disabled={sameAsAddress}
          />
        </div>

  

<div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block font-semibold">District</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter pincode"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">
        <div className="grid grid-cols-1 gap-4 mt-4">
  <div>
    <label className="block font-semibold">State</label>
    <select
      name="state"
      value={formData.state}
      onChange={handleChange}
      className="w-full p-2 border rounded"
      required
    >
      <option value="">Select State</option>
      <option value="Kerala">Kerala</option>
      <option value="Tamil Nadu">Tamil Nadu</option>
      <option value="Karnataka">Karnataka</option>
      <option value="Andhra Pradesh">Andhra Pradesh</option>
      <option value="Maharashtra">Maharashtra</option>
    </select>
  </div>
</div>

          <div>
            <label className="block font-semibold">Nationality</label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="select">Select Nationality</option>
              <option value="Indian">Indian</option>
              <option value="Foreign">Foreign</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block font-semibold">Keralite</label>
            <select
              name="keralite"
              value={formData.keralite}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="select">Are you Keralite?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold">Religion</label>
            <select
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="select">Select Religion</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <label className="block font-semibold mt-4">Caste</label>
        <input
          type="text"
          name="caste"
          value={formData.caste}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Enter your caste"
        />

        <label className="block font-semibold mt-4">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="select">Select Category</option>
          <option value="General">General</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
        </select>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-6">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default AdmissionForm;
