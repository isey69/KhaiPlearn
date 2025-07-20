// src/pages/Settings/Rewards.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Plus, Trash2, Edit, ArrowLeft, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const RewardsSettingsPage = () => {
  const [rewards, setRewards] = useState([]);
  const [name, setName] = useState("");
  const [points, setPoints] = useState(0);
  const [editingReward, setEditingReward] = useState(null);

  const rewardsCollectionRef = collection(db, "rewards");

  useEffect(() => {
    const getRewards = async () => {
      const data = await getDocs(rewardsCollectionRef);
      setRewards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getRewards();
  }, []);

  const handleAddReward = async () => {
    if (name && points > 0) {
      await addDoc(rewardsCollectionRef, { name, points: Number(points) });
      setName("");
      setPoints(0);
      // Refresh rewards
      const data = await getDocs(rewardsCollectionRef);
      setRewards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
  };

  const handleUpdateReward = async (id) => {
    if (name && points > 0) {
      const rewardDoc = doc(db, "rewards", id);
      await updateDoc(rewardDoc, { name, points: Number(points) });
      setEditingReward(null);
      setName("");
      setPoints(0);
      // Refresh rewards
      const data = await getDocs(rewardsCollectionRef);
      setRewards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
  };

  const handleDeleteReward = async (id) => {
    const rewardDoc = doc(db, "rewards", id);
    await deleteDoc(rewardDoc);
    // Refresh rewards
    const data = await getDocs(rewardsCollectionRef);
    setRewards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const startEdit = (reward) => {
    setEditingReward(reward.id);
    setName(reward.name);
    setPoints(reward.points);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-blue-800 p-4 text-white font-sans">
      <Link
        to="/settings"
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
            <Gift className="mr-3 text-cyan-300" />
            ตั้งค่าของรางวัล
          </h1>
          <p className="text-blue-300">จัดการรายการของรางวัลและแต้มที่ใช้แลก</p>
        </motion.div>

        <div className="bg-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingReward ? "แก้ไขของรางวัล" : "เพิ่มของรางวัลใหม่"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              className="w-full px-4 py-3 bg-white/10 rounded-2xl placeholder-blue-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
              placeholder="ชื่อของรางวัล"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              className="w-full px-4 py-3 bg-white/10 rounded-2xl placeholder-blue-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
              placeholder="แต้มที่ใช้แลก"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={
                editingReward
                  ? () => handleUpdateReward(editingReward)
                  : handleAddReward
              }
              className={`col-span-2 py-3 px-6 bg-gradient-to-r ${
                editingReward
                  ? "from-yellow-500 to-orange-600"
                  : "from-green-500 to-teal-600"
              } rounded-2xl text-white font-bold shadow-lg`}
            >
              {editingReward ? <Edit /> : <Plus />}
            </motion.button>
          </div>
        </div>

        <div className="space-y-4">
          {rewards.map((reward) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 p-4 rounded-3xl shadow-lg flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-lg">{reward.name}</p>
                <p className="text-sm text-blue-200">{reward.points} แต้ม</p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => startEdit(reward)}
                  className="p-2 bg-yellow-500/50 rounded-full"
                >
                  <Edit size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteReward(reward.id)}
                  className="p-2 bg-red-500/50 rounded-full"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardsSettingsPage;
