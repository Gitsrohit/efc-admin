import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Add toast notifications
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Loader icon
import { FaCheckCircle } from "react-icons/fa"; // Success tick icon

const CategoryDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null); // Track which category is being removed
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
    navigate(`/category/${categoryId}`);
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
      }, 1000); // Show tick animation for 1 second
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
    <div className="min-h-screen bg-pink-200 flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-10">Category Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-11/12">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => handleCategoryClick(category._id)}
          >
            {/* Image Section */}
            <img
              src={
                category.image.includes("http")
                  ? category.image
                  : `https://efc-app-sprp.onrender.com/${category.image}`
              }
              alt={category.name}
              className="w-full h-48 object-cover"
            />
            {/* Text Section */}
            <div className="p-4 text-center">
              <h2
                className="text-lg font-bold text-gray-800"
                // onClick={() => handleCategoryClick(category._id)}
              >
                {category.name}
              </h2>
              <p className="text-sm text-gray-600">{category.type || "Category"}</p>
            </div>

            {/* Delete Button below category name */}
            <div className="p-4 text-center">
              <button
                className="bg-red-300 text-red-800 rounded-lg p-2 w-28 text-center transition-all duration-200 hover:bg-red-400 hover:opacity-90"
                onClick={() => handleRemoveCategory(category._id)}
              >
                {removing === category._id ? (
                  <div className="flex items-center justify-center">
                    <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>

            {/* Success Tick Animation */}
            {removing === category._id && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                <FaCheckCircle className="text-green-500 text-4xl animate-bounce" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDashboard;
