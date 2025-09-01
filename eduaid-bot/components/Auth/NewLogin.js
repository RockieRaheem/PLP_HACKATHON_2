import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "../../src/LuxuryAuth.css";

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    grade: "",
    subjects: [],
    country: "",
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Save profile to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          ...profile,
          createdAt: new Date(),
          email: email,
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Save user profile if it's a new user
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          createdAt: new Date(),
          provider: "google",
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Google auth error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const africaCountries = [
    "Nigeria",
    "Kenya",
    "South Africa",
    "Ghana",
    "Uganda",
    "Tanzania",
    "Ethiopia",
    "Egypt",
    "Morocco",
    "Algeria",
    "Other",
  ];

  return (
    <div className="luxury-auth-container">
      {/* Animated Background */}
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      <div className="auth-content">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="brand-showcase">
            <div className="brand-icon-large">
              <span className="icon-gradient">🎓</span>
            </div>
            <h1 className="brand-title-large">EduAid</h1>
            <p className="brand-tagline">
              Your AI-powered study companion for African excellence
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="luxury-auth-card">
          <div className="card-header">
            <h2 className="auth-title">
              {isLogin ? "Welcome Back" : "Start Your Journey"}
            </h2>
            <p className="auth-subtitle">
              {isLogin
                ? "Continue your learning adventure"
                : "Join thousands of African students succeeding with AI"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="auth-form">
            {!isLogin && (
              <div className="form-section">
                <h3 className="section-title">Personal Information</h3>
                <div className="form-row">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      required={!isLogin}
                      className="luxury-input"
                    />
                    <span className="input-icon">👤</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <select
                      value={profile.grade}
                      onChange={(e) =>
                        setProfile({ ...profile, grade: e.target.value })
                      }
                      required={!isLogin}
                      className="luxury-select"
                    >
                      <option value="">Select Grade/Level</option>
                      <option value="primary">Primary School</option>
                      <option value="secondary">Secondary School</option>
                      <option value="high-school">High School</option>
                      <option value="university">University</option>
                    </select>
                    <span className="input-icon">🏫</span>
                  </div>

                  <div className="input-group">
                    <select
                      value={profile.country}
                      onChange={(e) =>
                        setProfile({ ...profile, country: e.target.value })
                      }
                      required={!isLogin}
                      className="luxury-select"
                    >
                      <option value="">Select Country</option>
                      {africaCountries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <span className="input-icon">🌍</span>
                  </div>
                </div>
              </div>
            )}

            <div className="form-section">
              <h3 className="section-title">Account Details</h3>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="luxury-input"
                />
                <span className="input-icon">📧</span>
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="luxury-input"
                />
                <span className="input-icon">🔒</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-btn"
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                  <span className="btn-icon">✨</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="google-auth-btn"
          >
            <span className="google-icon">🔍</span>
            <span>Google</span>
          </button>

          <div className="auth-switch">
            <p>
              {isLogin ? "New to EduAid?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="switch-btn"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </button>
            </p>
          </div>

          <div className="auth-footer">
            <p className="footer-text">
              🌍 Built for African students, by innovators who understand your
              journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
