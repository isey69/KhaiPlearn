// src/components/UnpaidDebts.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

const UnpaidDebts = ({ onClose }) => {
  const [debts, setDebts] = useState([]);
  const [members, setMembers] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [selectedDebts, setSelectedDebts] = useState([]);

  useEffect(() => {
    const fetchDebts = async () => {
      const debtsCollection = collection(db, "unpaidDebts");
      const q = query(debtsCollection, where("status", "==", "unpaid"));
      const debtsSnapshot = await getDocs(q);
      const debtsList = debtsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDebts(debtsList);
    };

    const fetchMembers = async () => {
      const membersCollection = collection(db, "members");
      const membersSnapshot = await getDocs(membersCollection);
      const membersData = {};
      membersSnapshot.forEach((doc) => {
        membersData[doc.id] = doc.data();
      });
      setMembers(membersData);
    };

    fetchDebts();
    fetchMembers();
  }, []);

  const handleMarkAsPaid = (debt) => {
    setSelectedDebt(debt);
    setShowPaymentModal(true);
  };

  const handlePayment = async (paymentMethod) => {
    if (selectedDebt.isBulk) {
      const debtIds = selectedDebt.id;
      for (const debtId of debtIds) {
        const debtDoc = doc(db, "unpaidDebts", debtId);
        await updateDoc(debtDoc, {
          status: "paid",
          paidAt: new Date(),
          paymentMethod: paymentMethod,
        });
      }
    } else {
      const debtDoc = doc(db, "unpaidDebts", selectedDebt.id);
      await updateDoc(debtDoc, {
        status: "paid",
        paidAt: new Date(),
        paymentMethod: paymentMethod,
      });
    }
    // Refresh debts
    const debtsCollection = collection(db, "unpaidDebts");
    const q = query(debtsCollection, where("status", "==", "unpaid"));
    const debtsSnapshot = await getDocs(q);
    const debtsList = debtsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setDebts(debtsList);
    setShowPaymentModal(false);
    setSelectedDebt(null);
    setSelectedDebts([]);
  };

  const handleSelectDebt = (debtId) => {
    setSelectedDebts((prev) =>
      prev.includes(debtId)
        ? prev.filter((id) => id !== debtId)
        : [...prev, debtId]
    );
  };

  const handleBulkPay = () => {
    const debtsToPay = debts.filter((debt) => selectedDebts.includes(debt.id));
    const total = debtsToPay.reduce((sum, debt) => sum + debt.total, 0);
    setSelectedDebt({ id: selectedDebts, total: total, isBulk: true });
    setShowPaymentModal(true);
  };

  const groupedDebts = debts.reduce((acc, debt) => {
    const customerName = members[debt.customerId]?.name || "Unknown";
    if (!acc[customerName]) {
      acc[customerName] = [];
    }
    acc[customerName].push(debt);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-blue-800 p-6 rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Unpaid Debts</h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            onClick={onClose}
            className="p-2 text-white"
          >
            <X />
          </motion.button>
        </div>
        <div className="space-y-6">
          {Object.entries(groupedDebts).map(([customerName, customerDebts]) => (
            <div key={customerName}>
              <h3 className="font-bold text-lg text-cyan-300 mb-2">
                {customerName}
              </h3>
              {customerDebts.map((debt) => (
                <div
                  key={debt.id}
                  className="bg-white/10 p-4 rounded-2xl mb-4 flex items-center"
                >
                  <input
                    type="checkbox"
                    className="mr-4"
                    checked={selectedDebts.includes(debt.id)}
                    onChange={() => handleSelectDebt(debt.id)}
                  />
                  <div className="flex-grow flex justify-between items-start">
                    <div>
                      <p className="text-xs text-blue-200">
                        {new Date(
                          debt.createdAt.seconds * 1000
                        ).toLocaleDateString()}
                      </p>
                      <ul>
                        {debt.items.map((item, index) => (
                          <li key={index} className="text-sm">
                            {item.name} x 1
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-red-400">
                        {debt.total} THB
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMarkAsPaid(debt)}
                        className="mt-2 py-1 px-3 bg-green-500 text-white rounded-full text-sm"
                      >
                        Mark as Paid
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {Object.keys(groupedDebts).length === 0 && (
            <p className="text-center text-white">No unpaid debts found.</p>
          )}
          {selectedDebts.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBulkPay}
              className="w-full mt-4 py-3 bg-gradient-to-r from-green-400 to-teal-500 rounded-3xl text-white font-bold shadow-xl text-lg"
            >
              Mark Selected as Paid
            </motion.button>
          )}
        </div>
      </motion.div>
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onPayment={handlePayment}
          total={selectedDebt.total}
        />
      )}
    </motion.div>
  );
};

const PaymentModal = ({ onClose, onPayment, total }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-blue-800 p-6 rounded-3xl shadow-2xl w-full max-w-sm"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Select Payment Method
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            onClick={onClose}
            className="p-2 text-white"
          >
            <X />
          </motion.button>
        </div>
        <div className="text-center mb-4">
          <p className="text-lg text-white">
            Total Amount:{" "}
            <span className="font-bold text-cyan-300">{total} THB</span>
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPayment("Cash")}
            className="py-2 px-6 rounded-full font-bold bg-green-500 text-white"
          >
            Cash
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPayment("QR Code")}
            className="py-2 px-6 rounded-full font-bold bg-blue-500 text-white"
          >
            QR Code
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UnpaidDebts;
