import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import {
  Sparkles,
  Gift,
  UserPlus,
  History,
  ShoppingCart,
  Settings,
  BarChart2,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4 text-white flex flex-col justify-start font-sans">
      {/* Header */}
      <header className="text-center my-8 relative">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-300 to-pink-400 text-transparent bg-clip-text animate-pulse">
          SunFight ✨
        </h1>
        <p className="text-purple-200 mt-2">By komchalatPOS</p>
        <Link to="/profile" className="absolute top-0 right-0">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <UserPlus
              className="text-white bg-white/10 p-2 rounded-full"
              size={40}
            />
          </motion.div>
        </Link>
      </header>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-auto">
        <ActionCard
          to="/accumulate-points"
          icon={<Sparkles size={40} />}
          text="สะสมแต้ม"
          description="รับแต้มจากทุกยอดซื้อ"
          gradient="from-green-400 to-blue-500"
        />
        <ActionCard
          to="/redeem-points"
          icon={<Gift size={40} />}
          text="แลกรางวัล"
          description="ดูของรางวัลและแลกแต้ม"
          gradient="from-yellow-400 to-orange-500"
        />
        <ActionCard
          to="/sales"
          icon={<ShoppingCart size={40} />}
          text="Go to Sales"
          description="Start a new sale"
          gradient="from-blue-500 to-green-500"
        />
      </div>

      {/* Bottom Nav (Glass Style) */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed bottom-0 left-0 right-0 p-4"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 flex justify-around items-center text-white shadow-2xl max-w-sm mx-auto">
          <BottomNavItem to="/" text="Home" icon={<History />} active />
          <BottomNavItem to="/sales" text="Sales" icon={<ShoppingCart />} />
          <BottomNavItem to="/history" text="History" icon={<History />} />
          <BottomNavItem
            to="/AddMember"
            text="Add Member"
            icon={<UserPlus />}
          />
          <BottomNavItem to="/profile" text="Profile" icon={<UserPlus />} />
          <BottomNavItem to="/settings" text="Settings" icon={<Settings />} />
          <BottomNavItem to="/summary" text="Summary" icon={<BarChart2 />} />
          <BottomNavItem
            to="/loyal-customers"
            text="Loyal Customers"
            icon={<Users />}
          />
        </div>
      </motion.div>
    </div>
  );
};

const ActionCard = ({ to, icon, text, description, gradient }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      className={`rounded-3xl bg-gradient-to-br ${gradient} text-white p-6 flex flex-col items-center justify-center shadow-xl h-full text-center`}
    >
      <div className="mb-4 animate-bounce">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{text}</h3>
      <p className="text-sm text-purple-200">{description}</p>
    </motion.div>
  </Link>
);

const BottomNavItem = ({ to, icon, text, active = false }) => (
  <Link to={to} className="flex flex-col items-center gap-1">
    <div className={`${active ? "text-yellow-300" : "text-purple-300"}`}>
      {icon}
    </div>
    <span
      className={`text-xs ${
        active ? "font-bold text-white" : "text-purple-300"
      }`}
    >
      {text}
    </span>
  </Link>
);

export default HomePage;
