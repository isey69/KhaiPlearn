// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddMember from "./pages/AddMember";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AddMember" element={<AddMember />} />
      </Routes>
    </Router>
  );
}

export default App;
