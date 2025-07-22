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
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCallback } from "react";

const HistoryPage = () => {
  const [phone, setPhone] = useState("");
  const [member, setMember] = useState(null);
  const [history, setHistory] = useState([]);
  const [members, setMembers] = useState({});
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState("sales"); // 'sales' or 'rewards'
  const [filter] = useState({ dateRange: "", category: "", member: "" });

  useEffect(() => {
    const fetchMembers = async () => {
      const membersCollection = collection(db, "members");
      const membersSnapshot = await getDocs(membersCollection);
      const membersData = {};
      membersSnapshot.forEach((doc) => {
        membersData[doc.id] = doc.data();
      });
      setMembers(membersData);
    };
    fetchMembers();
  }, []);

  const fetchHistory = useCallback(
    async (memberId) => {
      try {
        let q = query(
          collection(db, "transactions"),
          orderBy("createdAt", "desc")
        );

        if (memberId) {
          q = query(q, where("memberId", "==", memberId));
        }

        if (viewMode === "sales") {
          q = query(q, where("type", "==", "sale"));
        } else {
          q = query(q, where("type", "==", "redeem"));
        }

        const querySnapshot = await getDocs(q);
        let historyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (viewMode === "sales") {
          const unpaidDebtsQuery = query(
            collection(db, "unpaidDebts"),
            where("status", "==", "paid"),
            where("customerId", "==", memberId)
          );
          const unpaidDebtsSnapshot = await getDocs(unpaidDebtsQuery);
          const unpaidDebtsData = unpaidDebtsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            type: "sale",
            details: `Paid debt: ${doc
              .data()
              .items.map((item) => item.name)
              .join(", ")}`,
            points: doc.data().total,
          }));
          historyData = [...historyData, ...unpaidDebtsData];
          historyData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        }

        if (filter.dateRange) {
          // Implement date range filtering logic here
        }
        if (filter.category) {
          // Implement category filtering logic here
        }
        if (filter.member) {
          // Implement member filtering logic here
        }

        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching history:", error);
        setMessage("เกิดข้อผิดพลาดในการดึงข้อมูลประวัติ 📜");
      }
    },
    [viewMode, filter]
  );

  const handleSearch = async (e) => {
    e.preventDefault();
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

  useEffect(() => {
    fetchHistory(member ? member.id : null);
  }, [member, fetchHistory]);

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

        <div className="flex justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode("sales")}
            className={`py-2 px-6 rounded-full font-bold ${
              viewMode === "sales"
                ? "bg-cyan-400 text-white"
                : "bg-white/20 text-cyan-300"
            }`}
          >
            Sales History
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode("rewards")}
            className={`py-2 px-6 rounded-full font-bold ${
              viewMode === "rewards"
                ? "bg-cyan-400 text-white"
                : "bg-white/20 text-cyan-300"
            }`}
          >
            Rewards History
          </motion.button>
        </div>

        <div className="bg-white/10 p-4 rounded-3xl shadow-lg mb-8">
          <h3 className="font-bold text-lg mb-2">Filters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Date Range (not implemented)"
              className="w-full px-4 py-2 bg-white/10 rounded-xl placeholder-blue-300"
            />
            <input
              type="text"
              placeholder="Category (not implemented)"
              className="w-full px-4 py-2 bg-white/10 rounded-xl placeholder-blue-300"
            />
            <input
              type="text"
              placeholder="Member (not implemented)"
              className="w-full px-4 py-2 bg-white/10 rounded-xl placeholder-blue-300"
            />
          </div>
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
                {viewMode === "sales" ? (
                  <>
                    <div className="flex-grow">
                      <p className="font-bold">
                        {members[item.memberId]?.name}
                      </p>
                      <p className="text-sm">{item.details}</p>
                    </div>
                    <p className="font-bold text-xl ml-auto text-green-300">
                      {item.points} THB
                    </p>
                  </>
                ) : (
                  <>
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
                      <p className="font-bold">
                        {members[item.memberId]?.name}
                      </p>
                      <p>{item.details}</p>
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
                  </>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-center bg-white/10 p-6 rounded-3xl font-semibold">
              No history found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
