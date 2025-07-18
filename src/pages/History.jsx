// src/pages/History.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase.js";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import {
  History,
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HistoryPage = () => {
  const [phone, setPhone] = useState("");
  const [member, setMember] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    setMember(null);
    setHistory([]);
    setMessage("");

    if (!phone) {
      setMessage("กรุณาป้อนเบอร์โทรศัพท์ 🔮");
      return;
    }

    try {
      const q = query(collection(db, "members"), where("phone", "==", phone));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setMessage("ไม่พบสมาชิก 😢");
      } else {
        const memberData = querySnapshot.docs[0].data();
        setMember({ id: querySnapshot.docs[0].id, ...memberData });
        fetchHistory(querySnapshot.docs[0].id);
      }
    } catch (error) {
      console.error("Error searching for member:", error);
      setMessage("เกิดข้อผิดพลาดในการค้นหา ⚡️");
    }
  };

  const fetchHistory = async (memberId) => {
    try {
      const q = query(
        collection(db, "transactions"),
        where("memberId", "==", memberId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const historyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching history:", error);
      setMessage("เกิดข้อผิดพลาดในการดึงข้อมูลประวัติ 📜");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-blue-700 p-4 text-white font-sans">
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
            <History className="mr-3 text-cyan-300" />
            ประวัติ Magic
          </h1>
          <p className="text-blue-200">ย้อนดูการเดินทางของแต้ม</p>
        </motion.div>

        {!member && (
          <motion.form
            onSubmit={handleSearch}
            className="flex items-center space-x-4 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <input
              className="w-full px-5 py-4 bg-white/20 rounded-3xl placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-xl backdrop-blur-sm"
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
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-300 bg-red-500/30 p-4 rounded-3xl shadow-xl font-semibold"
          >
            {message}
          </motion.p>
        )}

        {member && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-white/20 p-6 rounded-3xl shadow-2xl mb-8 text-center backdrop-blur-lg">
              <h2 className="text-2xl font-bold">{member.name}</h2>
              <p className="text-4xl font-bold my-2 text-yellow-300 flex items-center justify-center gap-2">
                <Star className="animate-pulse" /> {member.points || 0}
              </p>
              <p className="text-blue-200">แต้มสะสม</p>
            </div>

            <div className="space-y-4">
              {history.length > 0 ? (
                history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 150,
                    }}
                    className={`p-4 rounded-3xl shadow-xl flex items-center space-x-4 bg-white/10 backdrop-blur-md`}
                  >
                    <div
                      className={`p-3 rounded-full ${
                        item.type === "accumulate"
                          ? "bg-green-500/80"
                          : "bg-red-500/80"
                      }`}
                    >
                      {item.type === "accumulate" ? (
                        <TrendingUp />
                      ) : (
                        <TrendingDown />
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold">{item.details}</p>
                      <p className="text-xs text-blue-200">
                        {new Date(
                          item.createdAt.seconds * 1000
                        ).toLocaleString()}
                      </p>
                    </div>
                    <p
                      className={`font-bold text-xl ml-auto ${
                        item.type === "accumulate"
                          ? "text-green-300"
                          : "text-red-300"
                      }`}
                    >
                      {item.type === "accumulate"
                        ? `+${item.points}`
                        : `-${item.points}`}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-center bg-white/10 p-6 rounded-3xl font-semibold">
                  ไม่มีประวัติ 😢
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
