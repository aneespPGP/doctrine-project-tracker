import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCa-IEesJUulO84_B37VObxwLS6LeZzFMM",
  authDomain: "doctrine-project-tracker.firebaseapp.com",
  projectId: "doctrine-project-tracker",
  storageBucket: "doctrine-project-tracker.firebasestorage.app",
  messagingSenderId: "1090984320285",
  appId: "1:1090984320285:web:5f3c6de94d8cb32fd6d5f4",
  measurementId: "G-4R5K141EBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, analytics };