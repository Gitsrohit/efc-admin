import React from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../Home/WebSocketContext"; // Import WebSocket context

const ViewOrders = () => {
  const { orders } = useWebSocket(); // Get orders from WebSocket context
  const navigate = useNavigate();

  const handleOrderClick = (order) => {
    navigate(`/order-detail/${order.id}`, { state: { order } });
  };

  return (
    <div className="min-h-screen bg-red-100 p-4">
      <div className="bg-red-700 w-full py-4 flex items-center px-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-red-600 px-4 py-2 rounded-full shadow-md font-semibold hover:bg-red-200 transition"
        >
          Back
        </button>
        <h1 className="text-2xl text-white font-bold mx-auto">View Orders</h1>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold text-red-700">TOTAL ORDERS: {orders.length}</h2>
          <p className="text-gray-600 mt-2">Order Remaining: {orders.filter(o => o.deliveryStatus === 'Pending').length}</p>
          <p className="text-gray-600">Order Prepared: {orders.filter(o => o.deliveryStatus === 'Prepared').length}</p>
          <p className="text-gray-600">Order Checkout: {orders.filter(o => o.deliveryStatus === 'Checkout').length}</p>
          <p className="text-gray-600">Order Delivered: {orders.filter(o => o.deliveryStatus === 'Delivered').length}</p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4 text-gray-700">Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders received yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => handleOrderClick(order)}
                >
                  <div>
                    <h3 className="font-bold text-gray-800">{order.user.name}</h3>
                    <p className="text-sm text-gray-600">{order.deliveryType}</p>
                  </div>
                  <p className="text-sm text-gray-500">{new Date(order.orderTime).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewOrders;
