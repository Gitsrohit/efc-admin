import React from "react";
// import { useNavigate } from "react-router-dom"; 

const Dashboard = () => {
//   const navigate = useNavigate(); 
//   const handleViewMenuClick = () => {
//     navigate("/category-dashboard"); 
//   };
  return (
    <div className="min-h-screen bg-pink-200 flex flex-col items-center">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-10 w-11/12">
        <div
        //   onClick={handleViewMenuClick} 
          className="bg-red-500 text-white font-bold text-center py-6 rounded-lg shadow-lg cursor-pointer"
        >
          VIEW MENU
        </div>
        <div className="bg-red-500 text-white font-bold text-center py-6 rounded-lg shadow-lg">
          TABLES
        </div>
        <div className="bg-red-500 text-white font-bold text-center py-6 rounded-lg shadow-lg">
          TABLES
        </div>
        <div
        //   onClick={handleViewMenuClick} 
          className="bg-red-500 text-white font-bold text-center py-6 rounded-lg shadow-lg cursor-pointer"
        >
          VIEW MENU
        </div>
        <div className="bg-red-500 text-white font-bold text-center py-6 rounded-lg shadow-lg">
          TABLES
        </div>
        <div className="bg-red-500 text-white font-bold text-center py-6 rounded-lg shadow-lg">
          TABLES
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
