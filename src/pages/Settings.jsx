// src/pages/Settings.jsx
import React from "react";
import { motion } from "framer-motion";
import { Settings, ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-blue-800 p-4 text-white font-sans">
      <Link
        to="/"
        className="absolute top-6 left-6 text-white hover:scale-110 transition-transform"
      >
        <ArrowLeft size={32} />
      </Link>
      <div className="max-w-lg mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center">
            <Settings className="mr-3 text-cyan-300 animate-spin-slow" />
            ตั้งค่า
          </h1>
          <p className="text-blue-300">จัดการการตั้งค่าต่างๆ ของระบบ</p>
        </motion.div>

        <div className="space-y-4">
          <SettingsLink
            to="/settings/points"
            title="ตั้งค่าการให้คะแนน"
            description="จัดการกฎการให้คะแนนสำหรับแต่ละหมวดหมู่"
          />
        </div>
      </div>
    </div>
  );
};

const SettingsLink = ({ to, title, description }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white/10 p-6 rounded-3xl shadow-lg flex justify-between items-center"
    >
      <div>
        <p className="font-bold text-lg">{title}</p>
        <p className="text-sm text-blue-200">{description}</p>
      </div>
      <ChevronRight size={24} />
    </motion.div>
  </Link>
);

export default SettingsPage;
