import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.order) {
    return <p>No order details available.</p>;
  }

  const { order } = state;

  return (
    <div className="min-h-screen bg-red-100 p-4">
     
      <div className="bg-red-700 w-full py-4 flex items-center px-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-red-600 px-4 py-2 rounded-full shadow-md font-semibold hover:bg-red-200 transition"
        >
          Back
        </button>
        <h1 className="text-2xl text-white font-bold mx-auto">Order Details</h1>
      </div>

      <div className="bg-white p-4 shadow-lg rounded-lg mt-8">
        <h2 className="text-lg font-bold text-gray-700">Order ID: {order.id}</h2>
        <p className="text-gray-600">Delivery Type: {order.deliveryType}</p>
        <p className="text-gray-600">Payment Status: {order.paymentStatus}</p>
        <p className="text-gray-600">Total Price: ${order.totalPrice}</p>

        <h3 className="font-bold text-gray-800 mt-4">Items:</h3>
        <ul className="mt-2 text-gray-600">
          {order.items.map((item, index) => (
            <li key={index}>
              {item.itemName} x {item.quantity} (${item.price})
            </li>
          ))}
        </ul>

        <h3 className="font-bold text-gray-800 mt-4">Delivery Address:</h3>
        <p className="text-gray-600">
          {order.deliveryAddress.addressLine1}, {order.deliveryAddress.addressLine2}, {order.deliveryAddress.city},{" "}
          {order.deliveryAddress.state}, {order.deliveryAddress.postalCode}, {order.deliveryAddress.country}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
