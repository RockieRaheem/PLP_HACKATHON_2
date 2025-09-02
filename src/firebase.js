// firebase.js - Production Ready Configuration
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Firebase Configuration with fallback for production
const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    "AIzaSyB4NFQyIN_P4Zd3kmixG11Fu4waFhTL1sk",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "eduaid-bot-hackathon.firebaseapp.com",
  projectId:
    process.env.REACT_APP_FIREBASE_PROJECT_ID || "eduaid-bot-hackathon",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "eduaid-bot-hackathon.firebasestorage.app",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "116732315494",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    "1:116732315494:web:cac67b9eeb10c42926eaa7",
  measurementId:
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-GM87QRPWYX",
};

// Debug logging for production
console.log("Firebase Config:", {
  apiKey: firebaseConfig.apiKey
    ? `${firebaseConfig.apiKey.substring(0, 10)}...`
    : "NOT_SET",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
});

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Cloud Storage
const storage = getStorage(app);

// Initialize Cloud Functions
const functions = getFunctions(app);

// Export for use in other files
export { auth, googleProvider, db, storage, functions };
export default app;

// Check if Firebase is properly configured
const isConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId;

if (!isConfigured) {
  console.error(
    "⚠️ Firebase configuration is incomplete. Please check your environment variables."
  );
} else {
  console.log("✅ Firebase initialized successfully");
}

export const isDemoMode = false; // Always use real Firebase in production
