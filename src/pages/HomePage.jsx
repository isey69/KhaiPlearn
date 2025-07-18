import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Gift, UserPlus, History } from "lucide-react";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4 text-white flex flex-col justify-between">
      {/* Hero Section */}
      <Card className="rounded-3xl shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-4">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">🎉 ยินดีต้อนรับกลับมา!</h1>
          <p className="mb-4 text-sm">คุณมี 820 แต้มสะสม ✨</p>
          <Progress value={82} className="h-3 rounded-full bg-white/20" />
          <p className="text-xs mt-2">เหลืออีก 180 แต้มจะถึงรางวัลถัดไป! 🎁</p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="rounded-3xl bg-gradient-to-br from-green-400 to-blue-500 text-white py-4 flex flex-col items-center justify-center shadow-xl"
        >
          <Sparkles className="w-6 h-6 mb-1" />
          <span className="text-sm font-semibold">สะสมแต้ม</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="rounded-3xl bg-gradient-to-br from-yellow-400 to-red-500 text-white py-4 flex flex-col items-center justify-center shadow-xl"
        >
          <Gift className="w-6 h-6 mb-1" />
          <span className="text-sm font-semibold">แลกรางวัล</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="rounded-3xl bg-gradient-to-br from-pink-500 to-purple-500 text-white py-4 flex flex-col items-center justify-center shadow-xl"
        >
          <UserPlus className="w-6 h-6 mb-1" />
          <span className="text-sm font-semibold">เพิ่มสมาชิก</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-700 text-white py-4 flex flex-col items-center justify-center shadow-xl"
        >
          <History className="w-6 h-6 mb-1" />
          <span className="text-sm font-semibold">ประวัติคะแนน</span>
        </motion.button>
      </div>

      {/* Bottom Nav (Glass Style) */}
      <div className="backdrop-blur-md bg-white/20 rounded-t-2xl p-3 flex justify-around items-center text-white">
        <span className="text-sm">🏠 หน้าแรก</span>
        <span className="text-sm">👥 สมาชิก</span>
        <span className="text-sm">🎁 ของรางวัล</span>
        <span className="text-sm">⚙️ ตั้งค่า</span>
      </div>
    </div>
  );
};

export default HomePage;
