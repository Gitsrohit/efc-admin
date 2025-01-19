import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const CategoryDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const navigate = useNavigate();

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjc4MTA2NTRjZjllNGRhOTA2YjNmZWMwIiwiY29tcGFueUlkIjoiRUZDIiwiaWF0IjoxNzM2NTA5MDEzLCJleHAiOjE4MjI5MDkwMTN9.e2p1wGd8c8H2ilyy6VAc8iFd4ioDiKgAlYRvPsjRtOo"; // Keep the token secure, avoid hardcoding in production.

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://efc-app-sprp.onrender.com/api/v1/admin/get-category",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove category");
      }
      toast.success("Category removed successfully!");
      setCategories((prev) =>
        prev.filter((category) => category._id !== categoryId)
      );
      setRemoving(null);
    } catch (error) {
      console.error(error);
      toast.error("Error removing category!");
      setRemoving(null);
    }
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategoryName || !newCategoryImage) {
        toast.error("Please provide all required fields!");
        return;
      }

      const formData = new FormData();
      formData.append("name", newCategoryName);
      formData.append("image", newCategoryImage);

      const response = await fetch(
        "https://efc-app-sprp.onrender.com/api/v1/admin/add-category",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add category");
      }

      const data = await response.json();
      toast.success("Category added successfully!");
      setCategories((prev) => [...prev, data.data]);
      setIsModalOpen(false);
      setNewCategoryName("");
      setNewCategoryImage(null);
    } catch (error) {
      console.error("Error adding category:", error.message);
      toast.error(error.message || "Error adding category!");
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
    <div className="min-h-screen bg-pink-200 flex flex-col items-center p-4 relative">
      <h1 className="text-3xl font-bold mt-4 text-black">CATEGORY</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex flex-col items-center bg-red-500 rounded-lg p-4 cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => handleCategoryClick(category._id)}
          >
            <div className="w-16 h-16 bg-red-700 rounded-md"></div>
            <p className="mt-2 text-white font-semibold">
              {category.name.toUpperCase()}
            </p>
            <button
              className="mt-2 text-white font-semibold underline"
              onClick={() => handleRemoveCategory(category._id)}
              disabled={removing === category._id}
            >
              {removing === category._id ? "Removing..." : "Remove"}
            </button>
          </div>
        ))}
      </div>
      <button
        className="mt-6 bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
        onClick={() => setIsModalOpen(true)}
      >
        ADD NEW CATEGORY
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4 text-center">Add New Category</h2>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-md mb-4">
                {newCategoryImage ? (
                  <img
                    src={URL.createObjectURL(newCategoryImage)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <span>Upload Image</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="mb-4"
                onChange={(e) => setNewCategoryImage(e.target.files[0])}
              />
              <input
                type="text"
                placeholder="Enter category name"
                className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button
                className="bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
                onClick={handleAddCategory}
              >
                ADD
              </button>
              <button
                className="mt-4 text-red-500 underline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDashboard;
