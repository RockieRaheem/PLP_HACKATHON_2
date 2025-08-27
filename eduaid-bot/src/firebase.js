// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Check if we have valid Firebase credentials
const hasValidFirebaseConfig =
  process.env.REACT_APP_FIREBASE_API_KEY &&
  process.env.REACT_APP_FIREBASE_API_KEY !== "demo-api-key" &&
  process.env.REACT_APP_FIREBASE_API_KEY !== "your_actual_api_key_here";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "eduaid-bot-demo.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "eduaid-bot-demo",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "eduaid-bot-demo.appspot.com",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Export demo mode flag
export const isDemoMode = !hasValidFirebaseConfig;

let app, auth, googleProvider, db, storage, functions;

if (hasValidFirebaseConfig) {
  // Initialize real Firebase
  console.log("🔥 Using Real Firebase Configuration");
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);
} else {
  // Use demo mode
  console.log("🎭 Using Demo Mode - Authentication will be simulated");
  console.log(
    "💡 To use real Firebase, update your .env file with actual credentials"
  );

  // Import demo services
  import("./services/demoAuth").then(({ demoAuth, demoGoogleProvider }) => {
    // For demo mode, we'll handle this in the component
  });

  // Mock Firebase services for demo
  auth = {
    signInWithEmailAndPassword: async (email, password) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = {
            uid: "demo-user-" + Date.now(),
            email: email,
            displayName: email.split("@")[0],
            photoURL: null,
          };
          resolve({ user });
        }, 1000);
      });
    },
    signInWithPopup: async (provider) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = {
            uid: "demo-google-user-" + Date.now(),
            email: "demo.user@gmail.com",
            displayName: "Demo User",
            photoURL: "https://via.placeholder.com/100x100?text=Demo",
          };
          resolve({ user });
        }, 1500);
      });
    },
    createUserWithEmailAndPassword: async (email, password) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = {
            uid: "demo-new-user-" + Date.now(),
            email: email,
            displayName: email.split("@")[0],
            photoURL: null,
          };
          resolve({ user });
        }, 1200);
      });
    },
    signOut: async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    },
    onAuthStateChanged: (callback) => {
      // Simulate no user initially
      setTimeout(() => callback(null), 100);
      return () => {}; // unsubscribe function
    },
  };

  googleProvider = { providerId: "google.com" };

  // Mock other services
  db = {
    collection: () => ({
      add: async () => ({ id: "demo-doc-" + Date.now() }),
      doc: () => ({
        set: async () => {},
        get: async () => ({ exists: true, data: () => ({}) }),
      }),
    }),
  };

  storage = {
    ref: () => ({
      put: async () => ({ ref: { getDownloadURL: async () => "demo-url" } }),
    }),
  };

  functions = {
    httpsCallable: () => async () => ({ data: "demo-response" }),
  };
}

export { auth, googleProvider, db, storage, functions };
export default app;
