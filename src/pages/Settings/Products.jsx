// src/pages/Settings/Products.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Plus, Trash2, Edit, ArrowLeft, Package } from "lucide-react";
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

const ProductsSettingsPage = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Active");
  const [editingProduct, setEditingProduct] = useState(null);

  const productsCollectionRef = collection(db, "products");

  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productsCollectionRef);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProducts();
  }, []);

  const handleAddProduct = async () => {
    if (name && price > 0 && category) {
      await addDoc(productsCollectionRef, {
        name,
        price: Number(price),
        category,
        status,
      });
      setName("");
      setPrice(0);
      setCategory("");
      setStatus("Active");
      // Refresh products
      const data = await getDocs(productsCollectionRef);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
  };

  const handleUpdateProduct = async (id) => {
    if (name && price > 0 && category) {
      const productDoc = doc(db, "products", id);
      await updateDoc(productDoc, {
        name,
        price: Number(price),
        category,
        status,
      });
      setEditingProduct(null);
      setName("");
      setPrice(0);
      setCategory("");
      setStatus("Active");
      // Refresh products
      const data = await getDocs(productsCollectionRef);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
  };

  const handleDeleteProduct = async (id) => {
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
    // Refresh products
    const data = await getDocs(productsCollectionRef);
    setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const startEdit = (product) => {
    setEditingProduct(product.id);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setStatus(product.status);
  };

  const toggleProductStatus = async (product) => {
    const productDoc = doc(db, "products", product.id);
    const newStatus = product.status === "Active" ? "Inactive" : "Active";
    await updateDoc(productDoc, { status: newStatus });
    // Refresh products
    const data = await getDocs(productsCollectionRef);
    setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
            <Package className="mr-3 text-cyan-300" />
            ตั้งค่าสินค้า
          </h1>
          <p className="text-blue-300">จัดการรายการสินค้าและราคา</p>
        </motion.div>

        <div className="bg-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              className="w-full px-4 py-3 bg-white/10 rounded-2xl placeholder-blue-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
              placeholder="ชื่อสินค้า"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              className="w-full px-4 py-3 bg-white/10 rounded-2xl placeholder-blue-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
              placeholder="ราคา"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="text"
              className="w-full px-4 py-3 bg-white/10 rounded-2xl placeholder-blue-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
              placeholder="หมวดหมู่"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <select
              className="w-full px-4 py-3 bg-white/10 rounded-2xl placeholder-blue-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={
                editingProduct
                  ? () => handleUpdateProduct(editingProduct)
                  : handleAddProduct
              }
              className={`py-3 px-6 bg-gradient-to-r ${
                editingProduct
                  ? "from-yellow-500 to-orange-600"
                  : "from-green-500 to-teal-600"
              } rounded-2xl text-white font-bold shadow-lg`}
            >
              {editingProduct ? <Edit /> : <Plus />}
            </motion.button>
          </div>
        </div>

        <div className="space-y-4">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 p-4 rounded-3xl shadow-lg flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-lg">{product.name}</p>
                <p className="text-sm text-blue-200">
                  {product.category} - {product.price} THB
                </p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleProductStatus(product)}
                  className={`p-2 rounded-full ${
                    product.status === "Active"
                      ? "bg-green-500/50"
                      : "bg-red-500/50"
                  }`}
                >
                  {product.status === "Active" ? "Active" : "Inactive"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => startEdit(product)}
                  className="p-2 bg-yellow-500/50 rounded-full"
                >
                  <Edit size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteProduct(product.id)}
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

export default ProductsSettingsPage;
