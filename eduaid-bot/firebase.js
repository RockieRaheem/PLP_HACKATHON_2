// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4NFQyIN_P4Zd3kmixG11Fu4waFhTL1sk",
  authDomain: "eduaid-bot-hackathon.firebaseapp.com",
  projectId: "eduaid-bot-hackathon",
  storageBucket: "eduaid-bot-hackathon.firebasestorage.app",
  messagingSenderId: "116732315494",
  appId: "1:116732315494:web:cac67b9eeb10c42926eaa7",
  measurementId: "G-GM87QRPWYX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const analytics = getAnalytics(app);

// Export demo mode flag (false since we have real credentials)
export const isDemoMode = false;

export default app;
