// src/lib/points.js
import { db } from "../firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

export const calculatePoints = async (items) => {
  const rulesCollectionRef = collection(db, "pointRules");
  const data = await getDocs(rulesCollectionRef);
  const rules = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  let totalPoints = 0;
  for (const item of items) {
    const rule = rules.find((r) => r.category === item.category);
    if (rule) {
      totalPoints += Math.floor(item.price / rule.thbPerPoint);
    } else {
      // Default rule if no category matches
      totalPoints += Math.floor(item.price / 10);
    }
  }
  return totalPoints;
};

export const recordSale = async (items, phone) => {
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
  const pointsEarned = await calculatePoints(items);

  // Find member by phone
  const membersRef = collection(db, "members");
  const q = query(membersRef, where("phone", "==", phone));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const memberDoc = querySnapshot.docs[0];
    const memberRef = doc(db, "members", memberDoc.id);
    const currentPoints = memberDoc.data().points || 0;

    await updateDoc(memberRef, {
      points: currentPoints + pointsEarned,
    });

    await addDoc(collection(db, "transactions"), {
      memberId: memberDoc.id,
      type: "sale",
      details: `ซื้อสินค้ารวม ${totalAmount} บาท`,
      points: pointsEarned,
      createdAt: new Date(),
    });

    return { success: true, pointsEarned };
  } else {
    return { success: false, message: "ไม่พบสมาชิก" };
  }
};
