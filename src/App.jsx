import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Home/Dashboard.jsx";
import CategoryDashboard from "./components/Home/CategoryDashboard.jsx";
import CategoryItems from "./components/Home/CategoryItems.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/category-dashboard" element={<CategoryDashboard />} />
        <Route path="/category/:categoryId" element={<CategoryItems />} />
      </Routes>
    </Router>
  );
}

export default App;
