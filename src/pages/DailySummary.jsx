// src/pages/DailySummary.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

const DailySummaryPage = () => {
  const [summary, setSummary] = useState({
    totalSales: 0,
    newUnpaidDebts: 0,
    paymentsReceived: 0,
    expectedCash: 0,
    salesByPaymentMethod: {},
  });

  const [filter, setFilter] = useState({ date: new Date() });

  useEffect(() => {
    const fetchSummary = async () => {
      const today = filter.date;
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const salesQuery = query(
        collection(db, "transactions"),
        where("type", "==", "sale"),
        where("createdAt", ">=", Timestamp.fromDate(startOfDay)),
        where("createdAt", "<=", Timestamp.fromDate(endOfDay))
      );
      const salesSnapshot = await getDocs(salesQuery);
      const salesData = salesSnapshot.docs.map((doc) => doc.data());

      const unpaidDebtsQuery = query(
        collection(db, "unpaidDebts"),
        where("createdAt", ">=", Timestamp.fromDate(startOfDay)),
        where("createdAt", "<=", Timestamp.fromDate(endOfDay))
      );
      const unpaidDebtsSnapshot = await getDocs(unpaidDebtsQuery);
      const newUnpaidDebts = unpaidDebtsSnapshot.docs.length;

      const paymentsReceivedQuery = query(
        collection(db, "unpaidDebts"),
        where("status", "==", "paid"),
        where("paidAt", ">=", Timestamp.fromDate(startOfDay)),
        where("paidAt", "<=", Timestamp.fromDate(endOfDay))
      );
      const paymentsReceivedSnapshot = await getDocs(paymentsReceivedQuery);
      const paymentsReceivedData = paymentsReceivedSnapshot.docs.map((doc) =>
        doc.data()
      );

      const totalSales = salesData.reduce((sum, sale) => sum + sale.points, 0);
      const paymentsReceived = paymentsReceivedData.reduce(
        (sum, debt) => sum + debt.total,
        0
      );
      const expectedCash =
        salesData
          .filter((sale) => sale.paymentMethod === "Cash")
          .reduce((sum, sale) => sum + sale.points, 0) +
        paymentsReceivedData
          .filter((debt) => debt.paymentMethod === "Cash")
          .reduce((sum, debt) => sum + debt.total, 0);

      const salesByPaymentMethod = salesData.reduce((acc, sale) => {
        const method = sale.paymentMethod || "Unknown";
        if (!acc[method]) {
          acc[method] = 0;
        }
        acc[method] += sale.points;
        return acc;
      }, {});

      setSummary({
        totalSales,
        newUnpaidDebts,
        paymentsReceived,
        expectedCash,
        salesByPaymentMethod,
      });
    };

    fetchSummary();
  }, [filter]);

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
            <BarChart2 className="mr-3 text-cyan-300" />
            Daily Summary Report
          </h1>
        </motion.div>
        <div className="bg-white/10 p-4 rounded-3xl shadow-lg mb-8">
          <h3 className="font-bold text-lg mb-2">Filters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              value={filter.date.toISOString().split("T")[0]}
              onChange={(e) =>
                setFilter({ ...filter, date: new Date(e.target.value) })
              }
              className="w-full px-4 py-2 bg-white/10 rounded-xl placeholder-blue-300"
            />
          </div>
        </div>
        <div className="bg-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-lg space-y-4">
          <SummaryRow label="Total Sales" value={`${summary.totalSales} THB`} />
          <SummaryRow label="New Unpaid Debts" value={summary.newUnpaidDebts} />
          <SummaryRow
            label="Payments Received"
            value={`${summary.paymentsReceived} THB`}
          />
          <SummaryRow
            label="Expected Cash in Drawer"
            value={`${summary.expectedCash} THB`}
          />
          <div>
            <h3 className="font-bold text-lg text-cyan-300 mb-2">
              Sales by Payment Method
            </h3>
            {Object.entries(summary.salesByPaymentMethod).map(
              ([method, amount]) => (
                <SummaryRow
                  key={method}
                  label={method}
                  value={`${amount} THB`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <p className="text-blue-200">{label}</p>
    <p className="font-bold text-lg">{value}</p>
  </div>
);

export default DailySummaryPage;
