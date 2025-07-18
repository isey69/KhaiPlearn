// src/pages/AddMember.jsx
import React, { useState } from "react";
import { db } from "../firebase.js";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { UserPlus, ArrowLeft, Cake, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function AddMember() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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
