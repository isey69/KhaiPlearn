// src/pages/AccumulatePoints.jsx
import React, { useState } from "react";
import { db } from "../firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { Sparkles, ArrowLeft, Search, User, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AccumulatePoints = () => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [member, setMember] = useState(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    setMember(null);
    setMessage("");

    if (!phone) {
      setMessage("กรุณาป้อนเบอร์โทรศัพท์ 🔮");
      setIsSuccess(false);
      return;
    }

    try {
      const q = query(collection(db, "members"), where("phone", "==", phone));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setMessage("ไม่พบสมาชิก 😢");
        setIsSuccess(false);
      } else {
        const memberData = querySnapshot.docs[0].data();
        setMember({ id: querySnapshot.docs[0].id, ...memberData });
      }
    } catch (error) {
      console.error("Error searching for member:", error);
      setMessage("เกิดข้อผิดพลาดในการค้นหา ⚡️");
      setIsSuccess(false);
    }
  };

  const handleAddPoints = async (e) => {
    e.preventDefault();
    if (!amount || !member) return;

    const pointsToAdd = Math.floor(Number(amount) / 10); // 10 baht = 1 point

    try {
      const memberRef = doc(db, "members", member.id);
      await updateDoc(memberRef, {
        points: (member.points || 0) + pointsToAdd,
      });

      await addDoc(collection(db, "transactions"), {
        memberId: member.id,
        type: "accumulate",
        points: pointsToAdd,
        details: `สะสมแต้มจากยอดซื้อ ${amount} บาท`,
        createdAt: new Date(),
      });

      setMessage(`🎉 เพิ่ม ${pointsToAdd} แต้มสำเร็จ!`);
      setIsSuccess(true);
      setMember(null);
      setPhone("");
      setAmount("");
      setSearched(false);
      setTimeout(() => setMessage(""), 4000);
    } catch (error) {
      console.error("Error adding points:", error);
      setMessage("ไม่สามารถเพิ่มแต้มได้ ❌");
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-4 text-white font-sans">
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
            <Sparkles className="mr-3 text-yellow-300 animate-pulse" />
            สะสมแต้ม Magic
          </h1>
          <p className="text-blue-200">ค้นหาลูกค้าแล้วเพิ่มแต้มได้เลย!</p>
        </motion.div>

        {!member && (
          <motion.form
            onSubmit={handleSearch}
            className="flex items-center space-x-4 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <input
              className="w-full px-5 py-4 bg-white/20 rounded-3xl placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-xl backdrop-blur-sm"
              placeholder="ค้นหาด้วยเบอร์โทร..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="p-4 bg-white/20 rounded-full shadow-xl"
            >
              <Search size={28} />
            </motion.button>
          </motion.form>
        )}

        {message && !member && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-center p-4 rounded-3xl shadow-xl font-semibold ${
              isSuccess ? "bg-green-500/80" : "bg-red-500/80"
            }`}
          >
            {message}
          </motion.div>
        )}

        {member && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/20 p-8 rounded-3xl shadow-2xl backdrop-blur-lg"
          >
            <div className="text-center mb-6">
              <User size={40} className="mx-auto mb-2 text-yellow-300" />
              <h2 className="text-2xl font-bold">{member.name}</h2>
              <p className="text-blue-200 flex items-center justify-center gap-2">
                <Gift size={16} /> {member.points || 0} แต้ม
              </p>
            </div>

            <form onSubmit={handleAddPoints} className="space-y-4">
              <input
                type="number"
                className="w-full px-5 py-4 bg-white/10 rounded-3xl placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-lg text-center text-xl"
                placeholder="จำนวนเงิน (บาท)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl text-white font-bold shadow-xl text-lg"
              >
                เพิ่มแต้ม ✨
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AccumulatePoints;
