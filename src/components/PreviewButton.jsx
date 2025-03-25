import React, { useState } from "react";
import axios from "axios";

const PreviewButton = () => {
  const [status, setStatus] = useState("");
  
  const handleClick = async () => {
    setStatus("Loading...");
    
    try {
      const response = await axios.get("http://localhost:5000/preview");
      setStatus(response.data.message);
    } catch (error) {
      setStatus("Failed to navigate");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={handleClick}
        className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600"
      >
        View Short Preview
      </button>
      <p className="mt-4 text-gray-700">{status}</p>
    </div>
  );
};

export default PreviewButton;
