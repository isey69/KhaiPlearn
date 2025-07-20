// src/pages/Sales.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Phone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { calculatePoints, recordSale } from "../lib/points";

const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [phone, setPhone] = useState("");
  const [member, setMember] = useState(null);
  const [total, setTotal] = useState(0);
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState("");

  const handleSearchMember = async () => {
    if (!phone) {
      setMessage("Please enter a phone number.");
      return;
    }
    const membersRef = collection(db, "members");
    const q = query(membersRef, where("phone", "==", phone));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setMessage("Member not found.");
      setMember(null);
    } else {
      const memberData = querySnapshot.docs[0].data();
      setMember({ id: querySnapshot.docs[0].id, ...memberData });
      setMessage(`Member found: ${memberData.name}`);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const q = query(productsCollection, where("status", "==", "Active"));
      const productsSnapshot = await getDocs(q);
      const productsList = productsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const calculate = async () => {
      const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
      setTotal(totalAmount);
      const earnedPoints = await calculatePoints(items);
      setPoints(earnedPoints);
    };
    calculate();
  }, [items]);

  const handleAddItem = (item) => {
    setItems([...items, item]);
  };

  const handleRecordSale = async () => {
    if (!phone || items.length === 0) {
      setMessage("กรุณาเพิ่มสินค้าและเบอร์โทรศัพท์");
      return;
    }
    const result = await recordSale(items, phone);
    if (result.success) {
      setMessage(
        `บันทึกการขายสำเร็จ! ${result.pointsEarned} แต้มได้ถูกเพิ่มแล้ว`
      );
      setItems([]);
      setPhone("");
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 text-white font-sans">
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
            <ShoppingCart className="mr-3 text-yellow-300" />
            หน้าขายสินค้า
          </h1>
          <p className="text-purple-200">เลือกสินค้าและบันทึกยอดขาย</p>
        </motion.div>

        <div className="space-y-6">
          <div className="bg-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-lg">
            <h2 className="text-xl font-bold mb-4">รายการสินค้า</h2>
            <div className="relative mb-4">
              <input
                className="w-full pl-12 pr-4 py-4 bg-white/10 rounded-3xl placeholder-purple-300 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-lg backdrop-blur-sm"
                placeholder="เบอร์โทรศัพท์สมาชิก"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearchMember}
                className="absolute right-2 top-2 py-2 px-4 bg-gradient-to-r from-green-400 to-teal-500 rounded-3xl text-white font-bold shadow-xl text-lg"
              >
                Search
              </motion.button>
            </div>
            {message && <p className="text-center mb-4">{message}</p>}

            <div className={`bg-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-lg ${!member ? 'opacity-50' : ''}`}>
              <h2 className="text-xl font-bold mb-4">รายการสินค้า</h2>
              <div className="grid grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductButton
                    key={product.id}
                    name={product.name}
                    price={product.price}
                    category={product.category}
                    onAddItem={handleAddItem}
                    disabled={!member}
                  />
                ))}
                {products.length === 0 && (
                  <p className="text-center col-span-3">No active products found.</p>
                )}
              </div>
            </div>

            <div className="bg-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-lg">
              <h2 className="text-xl font-bold mb-4">สรุปยอด</h2>
              <ul>
                {items.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>{item.price} THB</span>
                  </li>
                ))}
              </ul>
              <hr className="my-4 border-white/20" />
              <div className="text-2xl font-bold flex justify-between">
                <span>รวม:</span>
                <span>{total} THB</span>
              </div>
              <div className="text-lg text-yellow-300 flex justify-between">
                <span>แต้มที่ได้รับ:</span>
                <span>{points} ✨</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRecordSale}
              disabled={!member || items.length === 0}
              className="w-full mt-4 py-3 bg-gradient-to-r from-green-400 to-teal-500 rounded-3xl text-white font-bold shadow-xl text-lg disabled:opacity-50"
            >
              บันทึกการขาย
            </motion.button>
        </div>
      </div>
    </div>
  );
};

const ProductButton = ({ name, price, category, onAddItem, disabled }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => onAddItem({ name, price, category })}
    disabled={disabled}
    className="bg-white/20 p-4 rounded-2xl shadow-lg disabled:opacity-50"
  >
    <p>{name}</p>
    <p className="text-sm text-yellow-300">{price} THB</p>
  </motion.button>
);

export default SalesPage;
