import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Home/Dashboard.jsx";
import CategoryDashboard from "./components/Home/CategoryDashboard.jsx";
import CategoryItems from "./components/Home/CategoryItems.jsx";
import TableDashboard from "./components/Home/TableDashboard.jsx";
import ViewOrders from "./components/Home/ViewOrders.jsx";
import { WebSocketProvider } from "./components/Home/WebSocketContext.js";
import OrderDetails from "./components/Home/OrderDetails.jsx";

function App() {
  return (
    <WebSocketProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/category-dashboard" element={<CategoryDashboard />} />
        <Route path="/category/:categoryId" element={<CategoryItems />} />
        <Route path="/table-dashboard" element={<TableDashboard />} />
         <Route path="/view-orders" element={<ViewOrders />} />
        <Route path="/order-detail/:id" element={<OrderDetails />} /> 
      </Routes>
    </Router>
    </WebSocketProvider>
  );
}

export default App;
