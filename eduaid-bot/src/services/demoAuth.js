// Demo Authentication Service for Hackathon Demo
// This simulates Firebase Auth without requiring real credentials

export class DemoAuthService {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
  }

  // Simulate successful sign-in
  signInWithEmailAndPassword = async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = {
          uid: "demo-user-" + Date.now(),
          email: email,
          displayName: email.split("@")[0],
          photoURL: null,
        };
        this.notifyListeners();
        resolve({ user: this.currentUser });
      }, 1000); // Simulate network delay
    });
  };

  // Simulate Google sign-in
  signInWithPopup = async (provider) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = {
          uid: "demo-google-user-" + Date.now(),
          email: "demo.user@gmail.com",
          displayName: "Demo User",
          photoURL: "https://via.placeholder.com/100x100?text=Demo",
        };
        this.notifyListeners();
        resolve({ user: this.currentUser });
      }, 1500);
    });
  };

  // Simulate user registration
  createUserWithEmailAndPassword = async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = {
          uid: "demo-new-user-" + Date.now(),
          email: email,
          displayName: email.split("@")[0],
          photoURL: null,
        };
        this.notifyListeners();
        resolve({ user: this.currentUser });
      }, 1200);
    });
  };

  // Simulate sign out
  signOut = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null;
        this.notifyListeners();
        resolve();
      }, 500);
    });
  };

  // Auth state listener
  onAuthStateChanged = (callback) => {
    this.listeners.push(callback);
    // Immediately call with current state
    callback(this.currentUser);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  };

  notifyListeners() {
    this.listeners.forEach((callback) => callback(this.currentUser));
  }
}

// Create singleton instance
export const demoAuth = new DemoAuthService();

// Demo Google provider
export const demoGoogleProvider = {
  providerId: "google.com",
};
