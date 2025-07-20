// src/pages/Settings/Points.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Plus, Trash2, Edit, ArrowLeft } from "lucide-react";
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

const PointsSettingsPage = () => {
  const [rules, setRules] = useState([]);
  const [category, setCategory] = useState("");
  const [thb, setThb] = useState(10);
  const [editingRule, setEditingRule] = useState(null);

  const rulesCollectionRef = collection(db, "pointRules");

  useEffect(() => {
    const getRules = async () => {
      const data = await getDocs(rulesCollectionRef);
      setRules(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getRules();
  }, []);

  const handleAddRule = async () => {
    if (category && thb > 0) {
      await addDoc(rulesCollectionRef, { category, thbPerPoint: Number(thb) });
      setCategory("");
      setThb(10);
      // Refresh rules
      const data = await getDocs(rulesCollectionRef);
      setRules(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
  };

  const handleUpdateRule = async (id) => {
    if (category && thb > 0) {
      const ruleDoc = doc(db, "pointRules", id);
      await updateDoc(ruleDoc, { category, thbPerPoint: Number(thb) });
      setEditingRule(null);
      setCategory("");
      setThb(10);
      // Refresh rules
      const data = await getDocs(rulesCollectionRef);
      setRules(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
  };

  const handleDeleteRule = async (id) => {
    const ruleDoc = doc(db, "pointRules", id);
    await deleteDoc(ruleDoc);
    // Refresh rules
    const data = await getDocs(rulesCollectionRef);
    setRules(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const startEdit = (rule) => {
    setEditingRule(rule.id);
    setCategory(rule.category);
    setThb(rule.thbPerPoint);
  };

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
            ตั้งค่าการให้คะแนน
          </h1>
          <p className="text-blue-300">
            จัดการกฎการให้คะแนนสำหรับแต่ละหมวดหมู่
          </p>
        </motion.div>

        <div className="bg-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingRule ? "แก้ไขกฎ" : "เพิ่มกฎใหม่"}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              className="w-full px-4 py-3 bg-white/10 rounded-2xl placeholder-blue-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
              placeholder="ชื่อหมวดหมู่ (เช่น เครื่องดื่ม)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-full sm:w-24 px-4 py-3 bg-white/10 rounded-2xl placeholder-blue-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                value={thb}
                onChange={(e) => setThb(e.target.value)}
              />
              <span className="whitespace-nowrap">บาท / 1 แต้ม</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={
                editingRule
                  ? () => handleUpdateRule(editingRule)
                  : handleAddRule
              }
              className={`py-3 px-6 bg-gradient-to-r ${
                editingRule
                  ? "from-yellow-500 to-orange-600"
                  : "from-green-500 to-teal-600"
              } rounded-2xl text-white font-bold shadow-lg`}
            >
              {editingRule ? <Edit /> : <Plus />}
            </motion.button>
          </div>
        </div>

        <div className="space-y-4">
          {rules.map((rule) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 p-4 rounded-3xl shadow-lg flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-lg">{rule.category}</p>
                <p className="text-sm text-blue-200">
                  1 แต้ม ต่อทุกๆ {rule.thbPerPoint} บาท
                </p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => startEdit(rule)}
                  className="p-2 bg-yellow-500/50 rounded-full"
                >
                  <Edit size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteRule(rule.id)}
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

export default PointsSettingsPage;
