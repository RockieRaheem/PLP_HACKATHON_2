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

// Initialize Firebase services with error handling
let auth, googleProvider, db, storage, functions, analytics;
let isDemoMode = false;

try {
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);
  analytics = getAnalytics(app);
  console.log("🔥 Using Real Firebase Configuration");
} catch (error) {
  console.warn(
    "⚠️ Firebase services not fully configured. Some features may not work."
  );
  console.warn(
    "Please enable Authentication and Firestore in Firebase Console"
  );
  console.warn("Error:", error.message);

  // Create mock services to prevent app crashes
  auth = {
    signInWithEmailAndPassword: () =>
      Promise.reject(
        new Error(
          "Authentication not enabled. Please enable it in Firebase Console."
        )
      ),
    signInWithPopup: () =>
      Promise.reject(
        new Error(
          "Authentication not enabled. Please enable it in Firebase Console."
        )
      ),
    createUserWithEmailAndPassword: () =>
      Promise.reject(
        new Error(
          "Authentication not enabled. Please enable it in Firebase Console."
        )
      ),
    signOut: () => Promise.resolve(),
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    },
  };

  googleProvider = { providerId: "google.com" };
  db = { collection: () => ({ add: () => Promise.resolve({ id: "mock" }) }) };
  storage = {
    ref: () => ({
      put: () =>
        Promise.resolve({
          ref: { getDownloadURL: () => Promise.resolve("mock-url") },
        }),
    }),
  };
  functions = { httpsCallable: () => () => Promise.resolve({ data: "mock" }) };
  analytics = null;

  isDemoMode = true;
}

export { auth, googleProvider, db, storage, functions, analytics, isDemoMode };
export default app;
