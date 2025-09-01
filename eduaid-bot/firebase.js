import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB4NFQyIN_P4Zd3kmixG11Fu4waFhTL1sk",
  authDomain: "eduaid-bot-hackathon.firebaseapp.com",
  projectId: "eduaid-bot-hackathon",
  storageBucket: "eduaid-bot-hackathon.firebasestorage.app",
  messagingSenderId: "116732315494",
  appId: "1:116732315494:web:cac67b9eeb10c42926eaa7",
  measurementId: "G-GM87QRPWYX",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);
const analytics = getAnalytics(app);

export { auth, googleProvider, db, storage, functions, analytics };
export default app;
