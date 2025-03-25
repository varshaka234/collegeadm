import React from "react";

const AboutUs = () => {
  return (
    <div className="relative w-full">
      {/* Background Image */}
      <div className="relative w-full">
        <img
          src="/aboutus.jpg"  // Place your image in the 'public' folder
          alt="Graduation Hats"
          className="w-200 h-96 object-cover"
        />
      </div>

      {/* About Us Section */}
      <div className="bg-white px-4 py-8">
        <h2 className="text-2xl font-bold underline mb-4">ABOUT US</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
        Oxfordia University of Science and Technology is a prestigious institution dedicated to 
        fostering innovation, academic excellence, and groundbreaking research. Established with a vision
         to bridge the gap between theoretical knowledge and real-world application, the university offers
          a dynamic learning environment that nurtures intellectual curiosity and professional growth. 
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mt-4">
          With a diverse range of programs in engineering, technology, and applied sciences, 
          Oxfordia University is committed to equipping students with the skills and expertise 
          needed to excel in their respective fields.The university prides itself on its world-class faculty,
           state-of-the-art infrastructure, and a vibrant campus culture that promotes creativity, collaboration, 
           and lifelong learning. Through cutting-edge research initiatives, industry partnerships, and global 
           collaborations, Oxfordia University continues to push the boundaries of scientific discovery and technological advancement,
            preparing future leaders for a rapidly evolving world."
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
