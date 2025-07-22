// src/pages/AddMember.jsx
import React, { useState } from "react";
import { db } from "../firebase.js";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { UserPlus, ArrowLeft, Cake, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { getDocs } from "firebase/firestore";

function AddMember() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState({ name: "", phone: "" });

  const fetchMembers = async () => {
    const membersCollection = collection(db, "members");
    const membersSnapshot = await getDocs(membersCollection);
    const membersList = membersSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setMembers(membersList);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      setMessage("กรุณากรอกชื่อและเบอร์โทรศัพท์");
      setIsSuccess(false);
      return;
    }

    try {
      await addDoc(collection(db, "members"), {
        name,
        phone,
        birthday,
        points: 0,
        createdAt: Timestamp.now(),
      });
      setMessage("🎉 เพิ่มสมาชิกใหม่สำเร็จ!");
      setIsSuccess(true);
      setName("");
      setPhone("");
      setBirthday("");
      setTimeout(() => setMessage(""), 4000);
    } catch (error) {
      console.error("เกิดข้อผิดพลาด: ", error);
      setMessage("❌ ไม่สามารถเพิ่มสมาชิกได้");
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 p-4 text-white font-sans">
      <Link
        to="/"
        className="absolute top-6 left-6 text-white hover:scale-110 transition-transform animate-pulse"
      >
        <ArrowLeft size={32} />
      </Link>
      <div className="max-w-md mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center">
            <UserPlus className="mr-3 animate-bounce" />
            สร้างครอบครัว PointsMagic
          </h1>
          <p className="text-purple-200">มาเป็นส่วนหนึ่งกับเราสิ!</p>
        </motion.div>

        <motion.form
          onSubmit={handleAdd}
          className="space-y-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <InputWithIcon
            icon={<UserPlus />}
            placeholder="ชื่อ-นามสกุล"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputWithIcon
            icon={<Phone />}
            placeholder="เบอร์โทรศัพท์"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <InputWithIcon
            icon={<Cake />}
            type="date"
            placeholder="วันเกิด"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 20px rgba(52, 211, 153, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-green-400 to-teal-500 rounded-3xl text-white font-bold shadow-xl text-lg"
          >
            ลงทะเบียนเลย! ✨
          </motion.button>
        </motion.form>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mt-6 text-center p-4 rounded-3xl shadow-xl font-semibold ${
              isSuccess
                ? "bg-green-500/80 backdrop-blur-sm"
                : "bg-red-500/80 backdrop-blur-sm"
            }`}
          >
            {message}
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowMembers(!showMembers);
            if (!showMembers) {
              fetchMembers();
            }
          }}
          className="w-full mt-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl text-white font-bold shadow-xl text-lg"
        >
          {showMembers ? "Hide Members" : "View All Members"}
        </motion.button>

        {showMembers && (
          <div className="mt-8">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Filter by name"
                value={filter.name}
                onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 rounded-xl placeholder-blue-300"
              />
              <input
                type="text"
                placeholder="Filter by phone"
                value={filter.phone}
                onChange={(e) =>
                  setFilter({ ...filter, phone: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/10 rounded-xl placeholder-blue-300"
              />
            </div>
            <div className="bg-white/10 p-4 rounded-3xl shadow-lg">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {members
                    .filter(
                      (member) =>
                        member.name
                          .toLowerCase()
                          .includes(filter.name.toLowerCase()) &&
                        member.phone.includes(filter.phone)
                    )
                    .map((member) => (
                      <tr key={member.id}>
                        <td className="p-2">{member.name}</td>
                        <td className="p-2">{member.phone}</td>
                        <td className="p-2">{member.points}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const InputWithIcon = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-300">
      {icon}
    </div>
    <input
      {...props}
      className="w-full pl-12 pr-4 py-4 bg-white/10 rounded-3xl placeholder-purple-300 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-lg backdrop-blur-sm"
    />
  </div>
);

export default AddMember;
