import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryItems = () => {
  const { categoryId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`https://efc-app-sprp.onrender.com/api/v1/admin/get-item/${categoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data.data); // Adjust based on API response format
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryId]);

const handleRemove = async () => {
  try {
    const objectId = itemToRemove; // Ensure this matches your database format
    const response = await fetch(`https://efc-app-sprp.onrender.com/api/v1/admin/delete-category-item/${objectId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to remove item");
    }
    setItems((prevItems) => prevItems.filter((item) => item._id !== itemToRemove));
    setItemToRemove(null);
    setShowModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  } catch (err) {
    console.error(err);
    alert("Error removing item");
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-100">
        {/* Improved loader */}
        <div className="loader">
          <div className="inner one"></div>
          <div className="inner two"></div>
          <div className="inner three"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-600 font-bold text-xl">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 relative">
      <h1 className="text-3xl font-extrabold mt-10 text-gray-700">Items in Category</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 w-full max-w-6xl">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <img
              src={item.image} // Adjust the path if necessary
              alt={item.itemName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{item.itemName}</h2>
              <p className="text-gray-600">${item.price}</p>
              <p className="text-sm text-gray-500 mt-2">{item.description}</p>
            </div>
            <div className="p-4 bg-gray-100 border-t flex justify-center">
              <button
                className="bg-red-300 text-red-800 px-4 py-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-red-400 transition-opacity duration-200"
                onClick={() => {
                  setItemToRemove(item._id);
                  setShowModal(true);
                }}
              >
                Remove Item
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to remove this item?</h3>
            <div className="flex justify-around mt-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-300 text-red-800 px-4 py-2 rounded-lg hover:bg-red-400 transition"
                onClick={handleRemove}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-green-100 p-6 rounded-full shadow-lg">
            <svg
              className="w-16 h-16 text-green-600 animate-pulse"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryItems;
