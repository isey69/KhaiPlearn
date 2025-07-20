// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddMember from "./pages/AddMember";
import HomePage from "./pages/HomePage";
import AccumulatePoints from "./pages/AccumulatePoints";
import RedeemPoints from "./pages/RedeemPoints";
import HistoryPage from "./pages/History";
import ProfilePage from "./pages/Profile";
import SalesPage from "./pages/Sales";
import PointsSettingsPage from "./pages/Settings/Points";
import RewardsSettingsPage from "./pages/Settings/Rewards";
import ProductsSettingsPage from "./pages/Settings/Products";
import SettingsPage from "./pages/Settings";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AddMember" element={<AddMember />} />
        <Route path="/accumulate-points" element={<AccumulatePoints />} />
        <Route path="/redeem-points" element={<RedeemPoints />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/settings/points" element={<PointsSettingsPage />} />
        <Route path="/settings/rewards" element={<RewardsSettingsPage />} />
        <Route path="/settings/products" element={<ProductsSettingsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
