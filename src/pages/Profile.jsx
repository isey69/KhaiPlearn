// src/pages/Profile.jsx
import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Award, LogOut, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-4 text-white font-sans">
      <Link
        to="/"
        className="absolute top-6 left-6 text-white hover:scale-110 transition-transform"
      >
        <ArrowLeft size={32} />
      </Link>
      <div className="max-w-md mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center">
            <User className="mr-3 text-cyan-300" />
            My Profile
          </h1>
          <p className="text-blue-300">ดูข้อมูลส่วนตัวและแต้มของคุณ</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-lg"
        >
          <div className="space-y-6">
            <InfoRow icon={<User />} label="Name" value="Jules Verne" />
            <InfoRow
              icon={<Mail />}
              label="Email"
              value="jules.v@example.com"
            />
            <InfoRow icon={<Award />} label="Points" value="2,345" />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl text-white font-bold shadow-xl text-lg flex items-center justify-center"
          >
            <LogOut className="mr-2" />
            Logout
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center">
    <div className="p-2 bg-white/10 rounded-full mr-4">{icon}</div>
    <div>
      <p className="text-sm text-blue-200">{label}</p>
      <p className="font-bold text-lg">{value}</p>
    </div>
  </div>
);

export default ProfilePage;
