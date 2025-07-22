// src/pages/LoyalCustomers.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const LoyalCustomersPage = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const membersCollection = collection(db, "members");
      const membersSnapshot = await getDocs(membersCollection);
      const membersList = membersSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const customersData = await Promise.all(
        membersList.map(async (member) => {
          const salesQuery = query(
            collection(db, "transactions"),
            where("memberId", "==", member.id),
            where("type", "==", "sale")
          );
          const salesSnapshot = await getDocs(salesQuery);
          const totalPurchases = salesSnapshot.docs.length;
          const accumulatedAmount = salesSnapshot.docs.reduce(
            (sum, doc) => sum + doc.data().points,
            0
          );

          const unpaidDebtsQuery = query(
            collection(db, "unpaidDebts"),
            where("customerId", "==", member.id),
            where("status", "==", "unpaid")
          );
          const unpaidDebtsSnapshot = await getDocs(unpaidDebtsQuery);
          const unpaidDebts = unpaidDebtsSnapshot.docs.length;

          return {
            ...member,
            totalPurchases,
            accumulatedAmount,
            unpaidDebts,
          };
        })
      );

      setCustomers(
        customersData.sort((a, b) => b.totalPurchases - a.totalPurchases)
      );
    };

    fetchCustomers();
  }, []);

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
            <Users className="mr-3 text-cyan-300" />
            Loyal Customers
          </h1>
        </motion.div>
        <div className="bg-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-lg space-y-4">
          {customers.map((customer) => (
            <CustomerRow key={customer.id} customer={customer} />
          ))}
        </div>
      </div>
    </div>
  );
};

const CustomerRow = ({ customer }) => (
  <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
    <div>
      <p className="font-bold text-lg">{customer.name}</p>
      <p className="text-sm text-blue-200">
        Total Purchases: {customer.totalPurchases}
      </p>
      <p className="text-sm text-blue-200">
        Accumulated Amount: {customer.accumulatedAmount} THB
      </p>
    </div>
    <div>
      <p
        className={`font-bold text-lg ${
          customer.unpaidDebts > 0 ? "text-red-400" : "text-green-400"
        }`}
      >
        Unpaid Debts: {customer.unpaidDebts}
      </p>
    </div>
  </div>
);

export default LoyalCustomersPage;
