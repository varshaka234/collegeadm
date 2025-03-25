import React, { useState } from "react"; 

import { useNavigate } from "react-router-dom"; 

const ProgramSelection = () => {
  const navigate = useNavigate();

  const [qualification, setQualification] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  const qualificationOptions = [
    "12th Science",
    "12th Commerce",
    "12th Arts",
    "B.Sc Physics",
    "B.Tech CS",
    "M.Sc Mathematics",
    "M.Com",
  ];

  const qualificationPrograms = {
    "12th Science": [
      "B.Sc Computer Science",
      "B.Tech Mechanical",
      "B.Tech Electrical",
      "B.Sc Biotechnology",
    ],
    "12th Commerce": ["BBA", "B.Com", "BMS", "CA Foundation"],
    "12th Arts": ["BA English", "BA History", "BA Psychology", "BFA"],
    "B.Sc Physics": ["M.Sc Physics", "M.Tech Engineering Physics"],
    "B.Tech CS": ["M.Tech Computer Science", "MBA IT Management"],
    "M.Sc Mathematics": ["Ph.D in Mathematics", "M.Tech Data Science"],
    "M.Com": ["MBA Finance", "Ph.D in Commerce"],
  };

  const availablePrograms = qualificationPrograms[qualification] || [];

  const addProgram = () => {
    if (selectedProgram && !selectedPrograms.includes(selectedProgram)) {
      setSelectedPrograms([...selectedPrograms, selectedProgram]);
    }
    setSelectedProgram(""); // Reset selection
  };

  const removeProgram = (program) => {
    setSelectedPrograms(selectedPrograms.filter((p) => p !== program));
  };

  const handleSaveAndContinue = () => {
    if (selectedPrograms.length > 0) {
      navigate("/exam-fee-payment");
 // Corrected navigation
    } else {
      alert("Please select at least one program before continuing.");
    }
  };
  
  

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-br from-white to-gray-100 shadow-xl rounded-2xl p-8 mt-10 border border-gray-300">
      {/* Title */}
      <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-6">
        Program Selection 🎓
      </h2>

      {/* Qualification Selection */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2 text-lg">
          Select Your Qualification:
        </label>
        <select
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
          className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">-- Select Qualification --</option>
          {qualificationOptions.map((qual, index) => (
            <option key={index} value={qual}>
              {qual}
            </option>
          ))}
        </select>
      </div>

      {/* Program Selection */}
      {qualification && (
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Select Programs:
          </label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">-- Select Program --</option>
            {availablePrograms.map((program, index) => (
              <option key={index} value={program}>
                {program}
              </option>
            ))}
          </select>

          <button
            onClick={addProgram}
            className="w-full mt-4 bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            ➕ Add Program
          </button>
        </div>
      )}

      {/* Display Selected Programs */}
      {selectedPrograms.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow-md border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-700">Selected Programs:</h3>
          <ul className="mt-3">
            {selectedPrograms.map((program, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-2 hover:bg-gray-200 transition"
              >
                <span className="text-gray-700 font-medium">{program}</span>
                <button
                  onClick={() => removeProgram(program)}
                  className="text-red-500 font-bold hover:text-red-700"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Save & Continue Button */}
      <button
        onClick={handleSaveAndContinue}
        className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition duration-300 ease-in-out ${
          selectedPrograms.length > 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={selectedPrograms.length === 0}
      >
        ✅ Save & Continue
      </button>
    </div>
  );
};

export default ProgramSelection;
