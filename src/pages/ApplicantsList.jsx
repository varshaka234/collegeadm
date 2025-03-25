import React, { useState, useEffect } from "react";

export default function ApplicantsList() {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/applicants")
      .then((res) => res.json())
      .then((data) => setApplicants(data))
      .catch((err) => console.error("Error fetching applicants:", err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold">Applicants List</h2>
      <ul>
        {applicants.map((applicant) => (
          <li key={applicant.id}>{applicant.name}</li>
        ))}
      </ul>
    </div>
  );
  

    return (
      <div>
        <h2>Applicants List</h2>
        {/* Add your component code here */}
      </div>
    );
  }
  
