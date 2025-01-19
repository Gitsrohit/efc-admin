import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import bg from "../../public/assets/OIP.png";

const TableDashboard = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(
          "https://efc-app-sprp.onrender.com/api/v1/admin/get-all-table"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tables");
        }
        const data = await response.json();
        setTables(data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  const handleTableClick = async (tableId) => {
    try {
      navigate(`/category-dashboard`, { state: { tableId } });
    } catch (error) {
      console.error("Error navigating:", error);
    }
  };

  const calculateTotalPrice = (menuItems) => {
    return menuItems.reduce(
      (total, item) => total + item.item.price * item.quantity,
      0
    );
  };
  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="relative min-h-screen bg-red-200">
      <div
        className="bg-red-700 w-full h-16 flex items-center px-4"
        style={{
          borderTopLeftRadius: "20%",
          borderTopRightRadius: "20%",
        }}
      >
        <button
          onClick={handleBackClick}
          className="text-white p-3 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      </div>

      <div className="min-h-screen bg-red-200 flex flex-col items-center p-4 relative">
        <h1 className="text-3xl font-bold mt-4 text-black">TABLES</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
          {tables.map((table) => (
            <div
              key={table._id}
              className={`relative flex flex-col items-center rounded-lg p-4 cursor-pointer transform transition-transform hover:scale-105 ${
                table.reserved ? "bg-green-500" : "bg-red-500"
              }`}
              onClick={() => handleTableClick(table._id)}
            >
              <div
                className="w-16 h-16 rounded-md relative flex justify-center items-center"
                style={{
                  backgroundColor: table.reserved ? "#2ecc71" : "#e74c3c",
                }}
              >
                {table.reserved && (
                  <span className="absolute text-white text-sm font-bold">
                    ₹{calculateTotalPrice(table.menuItems)}
                  </span>
                )}
              </div>
              <p className="mt-2 text-white font-semibold">
                {table.name.toUpperCase()}
              </p>
            </div>
          ))}
        </div>

        <button
          className="mt-6 bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          onClick={() => navigate("/add-table")}
        >
          ADD NEW TABLE
        </button>
      </div>
      <div
        className="absolute inset-0 flex justify-center items-center"
        style={{ zIndex: -1 }}
      >
        <div
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "200px",
            width: "200px",
            opacity: 0.1,
          }}
        ></div>
      </div>
    </div>
  );
};

export default TableDashboard;
