import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../../public/assets/OIP.png";
import { useWebSocket } from "../Home/WebSocketContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { unreadMessages, setUnreadMessages, notificationMessage } = useWebSocket();

  // Handle unread messages and reset count when the "View Orders" button is clicked

   useEffect(() => {
    setUnreadMessages(0); // Reset unread messages when the Dashboard is mounted
  }, [setUnreadMessages]);
  const handleOrdersClick = async () => {
    try {
      navigate("/view-orders");
      setUnreadMessages(0); // Reset the unread messages count when clicked
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleViewMenuClick = async () => {
    try {
      navigate("/category-dashboard");
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const handleTableClick = async () => {
    try {
      navigate("/table-dashboard");
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-red-100">
      {/* Dark red bar with rounded corners */}
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
          {/* SVG Modern Back Icon */}
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

      {/* Buttons */}
      <div className="relative z-10 flex flex-col items-center pt-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 w-11/12 mt-20">
          {/* First Row */}
          <div
            onClick={handleViewMenuClick}
            className="bg-red-500 text-white font-bold text-center py-12 w-25 rounded-lg shadow-lg cursor-pointer"
          >
            VIEW MENU
          </div>
          <div
            className="bg-red-500 text-white font-bold text-center py-12 w-25 rounded-lg shadow-lg"
            onClick={handleTableClick}
          >
            TABLES
          </div>
          <div
            onClick={handleOrdersClick}
            className="relative bg-red-500 text-white font-bold text-center py-12 w-25 rounded-lg shadow-lg"
          >
            VIEW ORDERS
            {unreadMessages > 0 && (
              <div className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {unreadMessages}
              </div>
            )}
          </div>

          {/* Gap between rows */}
          <div className="col-span-full h-4"></div>

          {/* Second Row */}
          <div
            onClick={handleViewMenuClick}
            className="bg-red-500 text-white font-bold text-center py-12 w-25 rounded-lg shadow-lg cursor-pointer"
          >
            VIEW MENU
          </div>
          <div className="bg-red-500 text-white font-bold text-center py-12 w-25 rounded-lg shadow-lg">
            TABLES
          </div>
          <div className="bg-red-500 text-white font-bold text-center py-12 w-25 rounded-lg shadow-lg">
            TABLES
          </div>
        </div>
      </div>

      {/* Notification at top right */}
      {notificationMessage && (
        <div className="fixed top-0 right-0 bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg">
          {notificationMessage}
        </div>
      )}

      {/* Background Image in the center */}
      <div
        className="absolute inset-0 flex justify-center items-center"
        style={{ zIndex: 0 }}
      >
        <div
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "200px",
            width: "200px",
            opacity: 0.2,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Dashboard;
