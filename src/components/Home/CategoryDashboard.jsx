import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const CategoryDashboard = () => {
  const { state } = useLocation();
  const tableId = state?.tableId;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://efc-app-sprp.onrender.com/api/v1/admin/get-category"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`, { state: { tableId } });
  };

  const handleRemoveCategory = async (categoryId) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this category?"
    );
    if (!confirm) return;

    try {
      setRemoving(categoryId);
      const response = await fetch(
        `https://efc-app-sprp.onrender.com/api/v1/admin/delete-category/${categoryId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove category");
      }
      toast.success("Category removed successfully!");
      setCategories((prev) =>
        prev.filter((category) => category._id !== categoryId)
      );
      setTimeout(() => {
        setRemoving(null);
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Error removing category!");
      setRemoving(null);
    }
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
    
    <div
      className="min-h-screen bg-pink-200 flex flex-col items-center p-4 relative"

      style={{
        backgroundImage: "url('../../public/assets/OIP.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
      }}
    >
      <h1 className="text-3xl font-bold mt-4 text-black">CATEGORY</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex flex-col items-center bg-red-500 rounded-lg p-4 cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => handleCategoryClick(category._id)}
          >
            <div className="w-16 h-16 bg-red-700 rounded-md"></div>
            <p className="mt-2 text-white font-semibold">{category.name.toUpperCase()}</p>
          </div>
        ))}
      </div>
      <button
        className="mt-6 bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
        onClick={() => navigate("/add-category")}
      >
        ADD NEW CATEGORY
      </button>
    </div>
  );
};

export default CategoryDashboard;
