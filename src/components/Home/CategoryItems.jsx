import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate
import { AiOutlineArrowLeft } from "react-icons/ai"; // Import the "Go Back" icon

const CategoryItems = () => {
  const { categoryId } = useParams(); // Capture categoryId from URL params
  const navigate = useNavigate(); // Initialize navigate hook
  const [foodItems, setFoodItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [newItem, setNewItem] = useState({
    itemName: "",
    type: "",
    kitchen: "",
    price: "",
    categoryId: categoryId,
    description: "",
    image: "",
  }); // State for new item data

  // Function to fetch food items
  const fetchFoodItems = async () => {
    if (!categoryId) {
      alert("Invalid category ID.");
      console.error("No categoryId provided.");
      return;
    }

    console.log("Fetching data for categoryId:", categoryId);

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://efc-app-sprp.onrender.com/api/v1/admin/get-item/${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjc4MTA2NTRjZjllNGRhOTA2YjNmZWMwIiwiY29tcGFueUlkIjoiRUZDIiwiaWF0IjoxNzM2NTA5MDEzLCJleHAiOjE4MjI5MDkwMTN9.e2p1wGd8c8H2ilyy6VAc8iFd4ioDiKgAlYRvPsjRtOo",
          },
        }
      );
      const result = await response.json();

      console.log("API Response:", result);

      if (response.ok && result.success) {
        setFoodItems(result.data || []);
      } else {
        console.error("Error message from API:", result.message);
        alert(result.message || "Failed to fetch food items.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred while fetching food items.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission to add item
  const handleAddItem = async () => {
    if (!newItem.itemName || !newItem.price || !newItem.type || !newItem.kitchen) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        "https://efc-app-sprp.onrender.com/api/v1/admin/add-item",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjc4MTA2NTRjZjllNGRhOTA2YjNmZWMwIiwiY29tcGFueUlkIjoiRUZDIiwiaWF0IjoxNzM2NTA5MDEzLCJleHAiOjE4MjI5MDkwMTN9.e2p1wGd8c8H2ilyy6VAc8iFd4ioDiKgAlYRvPsjRtOo",
          },
          body: JSON.stringify(newItem),
        }
      );
      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Item added successfully");
        setFoodItems((prev) => [...prev, result.item]);
        setIsModalOpen(false); // Close modal after success
      } else {
        alert(result.message || "Failed to add item.");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("An error occurred while adding the item.");
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, [categoryId]);

  return (
    <div className="bg-red-800 min-h-screen px-4 py-6">
      {/* Header with Go Back Icon */}
      <header className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)} // This will navigate to the previous page
          className="bg-transparent text-white p-2 rounded-full"
        >
          <AiOutlineArrowLeft size={24} /> {/* Go Back Icon */}
        </button>
        <h1 className="text-white text-2xl font-bold ml-4">Category Items</h1>
        <button
          onClick={() => setIsModalOpen(true)} // Open modal on click
          className="ml-auto text-white bg-green-600 p-2 rounded-full"
        >
          Add Item
        </button>
      </header>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            <div>
              <label className="block mb-2">Item Name</label>
              <input
                type="text"
                name="itemName"
                value={newItem.itemName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-4"
                placeholder="Item Name"
              />
              <label className="block mb-2">Type</label>
              <input
                type="text"
                name="type"
                value={newItem.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-4"
                placeholder="Type (e.g., veg, non-veg)"
              />
              <label className="block mb-2">Kitchen</label>
              <input
                type="text"
                name="kitchen"
                value={newItem.kitchen}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-4"
                placeholder="Kitchen"
              />
              <label className="block mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={newItem.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-4"
                placeholder="Price"
              />
              <label className="block mb-2">Image URL</label>
              <input
                type="text"
                name="image"
                value={newItem.image}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-4"
                placeholder="Image URL"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-lg">Loading...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.length > 0 ? (
            foodItems.map((item) => (
              <div
                key={item._id}
                className="bg-yellow-300 rounded-lg shadow-md p-4 flex flex-col items-center"
              >
                <img
                  src={
                    item.image
                      ? `https://efc-app-sprp.onrender.com/${item.image}`
                      : "/placeholder-image.png"
                  }
                  alt={item.itemName}
                  className="w-24 h-24 rounded-md mb-4"
                />
                <h3 className="text-lg font-bold text-black">{item.itemName}</h3>
                <p className="text-sm text-gray-700">
                  {item.description || "No description available"}
                </p>
                <p className="text-md font-semibold text-black mt-2">
                  ₹{item.price}
                </p>
              </div>
            ))
          ) : (
            <p className="text-white text-center text-lg">
              No items found for this category.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryItems;
