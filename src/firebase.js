// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOfZC63BYO6_cp9SwWgNvyTiBBNUNbn4o",
  authDomain: "khaiplearn-e95a5.firebaseapp.com",
  projectId: "khaiplearn-e95a5",
  storageBucket: "khaiplearn-e95a5.firebasestorage.app",
  messagingSenderId: "959448605499",
  appId: "1:959448605499:web:736ea48173ffdb3197cd1e",
  measurementId: "G-65Y1SFJYTE",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
