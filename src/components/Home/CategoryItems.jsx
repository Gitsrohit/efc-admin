import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const CategoryItems = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [kotDetails, setKotDetails] = useState(null);

  const { tableId } = location.state || {};

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`https://efc-app-sprp.onrender.com/api/v1/admin/get-item/${categoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryId]);

  const prepareSelectedItems = () => {
    return Object.entries(selectedItems).map(([itemId, quantity]) => ({
      itemId,
      quantity,
    }));
  };

  const handleRemove = async () => {
    try {
      const response = await fetch(
        `https://efc-app-sprp.onrender.com/api/v1/admin/delete-category-item/${itemToRemove}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to remove item");
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

  const handleQuantityChange = (itemId, quantity) => {
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [itemId]: quantity,
    }));
  };

  const handleSubmit = async () => {
    if (!tableId) {
      alert("Table ID is required.");
      return;
    }

    const itemsToSubmit = prepareSelectedItems();

    if (itemsToSubmit.length === 0) {
      alert("No items selected.");
      return;
    }

    try {
      const response = await fetch(
        `https://efc-app-sprp.onrender.com/api/v1/admin/reserve-table/${tableId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: itemsToSubmit }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Items successfully added to the table!");
        setSelectedItems({});
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      console.error("Error submitting items:", err);
      alert("An error occurred while adding items.");
    }
  };
  const handleGenerateKOT = async () => {
    if (!tableId) {
      alert("Table ID is required.");
      return;
    }

    // const itemsToSubmit = prepareSelectedItems();

    // if (itemsToSubmit.length === 0) {
    //   alert("No items selected for KOT.");
    //   return;
    // }

    try {
      const response = await fetch(
        `https://efc-app-sprp.onrender.com/api/v1/admin/generate-table-kot`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tableId, operatorId:"efc" }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setKotDetails(result.data);
        alert("KOT generated successfully!");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      console.error("Error generating KOT:", err);
      alert("An error occurred while generating KOT.");
    }
  };

  const handlePrintKOT = () => {
    if (!kotDetails) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>KOT Ticket</title>
        </head>
        <body>
          <h1>Kitchen Order Ticket</h1>
          <p><strong>Ticket Number:</strong> ${kotDetails.ticketNumber}</p>
          <p><strong>Table Name:</strong> ${kotDetails.tableName}</p>
          <p><strong>Operator ID:</strong> ${kotDetails.operatorId}</p>
          <p><strong>Bill Date:</strong> ${new Date(
            kotDetails.billDate
          ).toLocaleString()}</p>
          <h2>Items</h2>
          <ul>
            ${kotDetails.items
              .map(
                (item) =>
                  `<li>${item.itemName} - Quantity: ${item.quantity}</li>`
              )
              .join("")}
          </ul>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return <div className="min-h-screen bg-red-100 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-red-100 flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen relative bg-red-50">
      {/* Top Red Bar */}
      <div className="bg-red-600 w-full py-4 shadow-lg flex items-center px-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-red-600 px-4 py-2 rounded-full shadow-md font-semibold hover:bg-red-200 transition"
        >
          Back
        </button>
        <h1 className="text-2xl text-white font-bold mx-auto">Category Items</h1>
      </div>

      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'url("https://via.placeholder.com/1920x1080")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center p-6">
        <h1 className="text-3xl font-extrabold mt-10 text-gray-700">Items in Category</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 w-full max-w-6xl">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <img
                src={item.image}
                alt={item.itemName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{item.itemName}</h2>
                <p className="text-gray-600">${item.price}</p>
                <p className="text-sm text-gray-500 mt-2">{item.description}</p>
              </div>
              <div className="p-4 bg-gray-100 border-t flex flex-col items-center">
                {tableId ? (
                  <>
                    <div className="flex items-center space-x-4">
                      <button
                        className={`w-10 h-10 rounded-full border ${
                          (selectedItems[item._id] || 0) === 0
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-800 hover:bg-gray-200"
                        }`}
                        disabled={(selectedItems[item._id] || 0) === 0}
                        onClick={() =>
                          handleQuantityChange(item._id, (selectedItems[item._id] || 0) - 1)
                        }
                      >
                        -
                      </button>
                      <span>{selectedItems[item._id] || 0}</span>
                      <button
                        className="w-10 h-10 rounded-full border text-gray-800 hover:bg-gray-200"
                        onClick={() =>
                          handleQuantityChange(item._id, (selectedItems[item._id] || 0) + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="mt-2 text-red-500 hover:text-red-700 text-sm"
                      onClick={() => handleQuantityChange(item._id, 0)}
                    >
                      Deselect
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-red-300 text-red-800 px-4 py-2 rounded-lg hover:bg-red-400 transition"
                    onClick={() => {
                      setItemToRemove(item._id);
                      setShowModal(true);
                    }}
                  >
                    Remove Item
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add to Table Button */}
        {tableId && Object.keys(selectedItems).some((id) => selectedItems[id] > 0) && (
          <button
            className="mt-6 bg-green-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:scale-105"
            onClick={handleSubmit}
          >
            Add Selected Items to Table
          </button>
        )}
        {tableId && (
          <div className="mt-6 flex space-x-4">
            <button
              className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:scale-105"
              onClick={handleGenerateKOT}
            >
              Generate KOT
            </button>
            {kotDetails && (
              <button
                className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:scale-105"
                onClick={handlePrintKOT}
              >
                Print KOT
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryItems;
