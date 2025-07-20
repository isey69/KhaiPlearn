// src/pages/RedeemPoints.jsx
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
import { Gift, ArrowLeft, Search, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const RedeemPoints = () => {
  const [rewards, setRewards] = useState([]);
  const [phone, setPhone] = useState("");
  const [member, setMember] = useState(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fetchRewards = async () => {
      const rewardsCollection = collection(db, "rewards");
      const rewardsSnapshot = await getDocs(rewardsCollection);
      const rewardsList = rewardsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setRewards(rewardsList);
    };

    fetchRewards();
  }, []);

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

  const handleRedeem = async (reward) => {
    if (!member || member.points < reward.points) {
      setMessage("แต้มไม่พอจ้า 😭");
      setIsSuccess(false);
      return;
    }

    try {
      const memberRef = doc(db, "members", member.id);
      await updateDoc(memberRef, {
        points: member.points - reward.points,
      });

      await addDoc(collection(db, "transactions"), {
        memberId: member.id,
        type: "redeem",
        points: reward.points,
        details: `แลกของรางวัล: ${reward.name}`,
        createdAt: new Date(),
      });

      setMessage(`🎉 แลก '${reward.name}' สำเร็จ!`);
      setIsSuccess(true);
      setMember({ ...member, points: member.points - reward.points });
      setTimeout(() => setMessage(""), 4000);
    } catch (error) {
      console.error("Error redeeming points:", error);
      setMessage("แลกรางวัลไม่สำเร็จ ❌");
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-4 text-white font-sans">
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
            <Gift className="mr-3 text-pink-300 animate-bounce" />
            แลกรางวัล Magic
          </h1>
          <p className="text-orange-200">ใช้แต้มสะสมแลกของรางวัลสุดพิเศษ!</p>
        </motion.div>

        {!member && (
          <motion.form
            onSubmit={handleSearch}
            className="flex items-center space-x-4 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <input
              className="w-full px-5 py-4 bg-white/20 rounded-3xl placeholder-orange-200 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-xl backdrop-blur-sm"
              placeholder="ค้นหาด้วยเบอร์โทร..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="p-4 bg-white/20 rounded-full shadow-xl"
            >
              <Search size={28} />
            </motion.button>
          </motion.form>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`my-4 text-center p-4 rounded-3xl shadow-xl font-semibold ${
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
          >
            <div className="bg-white/20 p-6 rounded-3xl shadow-2xl mb-8 text-center backdrop-blur-lg">
              <h2 className="text-2xl font-bold">{member.name}</h2>
              <p className="text-4xl font-bold my-2 text-yellow-300 flex items-center justify-center gap-2">
                <Star className="animate-pulse" /> {member.points || 0}
              </p>
              <p className="text-orange-200">แต้มสะสม</p>
            </div>

            <div className="space-y-4">
              {rewards.map((reward) => (
                <motion.div
                  key={reward.name}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className={`p-5 rounded-3xl flex justify-between items-center shadow-xl transition-all bg-gradient-to-r ${
                    member.points >= reward.points
                      ? reward.gradient
                      : "from-gray-600 to-gray-700 opacity-60"
                  }`}
                >
                  <div>
                    <p className="font-bold text-lg">{reward.name}</p>
                    <p className="text-sm text-white/80">
                      {reward.points} แต้ม
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRedeem(reward)}
                    disabled={member.points < reward.points}
                    className="px-5 py-2 bg-white/30 rounded-full text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                  >
                    แลก
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RedeemPoints;
