// src/pages/AddMember.jsx
import React, { useState } from "react";
import { db } from "../firebase.js";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function AddMember() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [point, setPoint] = useState(0);
  const [message, setMessage] = useState("");

  const handleAdd = async () => {
    try {
      await addDoc(collection(db, "members"), {
        name,
        phone,
        point: Number(point),
        createdAt: Timestamp.now(),
      });
      setMessage("เพิ่มสมาชิกเรียบร้อยแล้ว!");
      setName("");
      setPhone("");
      setPoint(0);
    } catch (error) {
      console.error("เกิดข้อผิดพลาด: ", error);
      setMessage("ไม่สามารถเพิ่มสมาชิกได้");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>เพิ่มสมาชิก</h2>
      <input
        placeholder="ชื่อ"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        placeholder="เบอร์โทร"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <br />
      <input
        placeholder="แต้มเริ่มต้น"
        type="number"
        value={point}
        onChange={(e) => setPoint(e.target.value)}
      />
      <br />
      <button onClick={handleAdd}>➕ เพิ่มสมาชิก</button>
      <p>{message}</p>
    </div>
  );
}

export default AddMember;
