import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, isDemoMode } from "../../firebase";

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    grade: "",
    subjects: [],
    country: "",
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isDemoMode) {
        setError("🎭 Demo Mode: Authentication simulated successfully!");
        setTimeout(() => setError(""), 1500);
        setLoading(false);
        return;
      }
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!profile.name) throw new Error("Please enter your name");
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName: profile.name });
        await setDoc(doc(db, "users", userCredential.user.uid), {
          ...profile,
          email,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      if (isDemoMode) {
        setError("🎭 Demo Mode: Google sign-in simulated successfully!");
        setTimeout(() => setError(""), 1500);
        setLoading(false);
        return;
      }
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString(),
          grade: "",
          country: "",
          subjects: [],
        },
        { merge: true }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-container creative-auth"
      style={{ position: "relative", overflow: "hidden", minHeight: 540 }}
    >
      {/* Galactical background for the whole page */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          borderRadius: "20px",
          background:
            'radial-gradient(ellipse at 60% 40%, #23264a 0%, #2575fc 60%, #23264a 100%), url("https://www.transparenttextures.com/patterns/stardust.png") repeat',
          opacity: 0.22,
        }}
      />
      <div
        className="auth-card"
        style={{
          background: "rgba(255,255,255,0.92)",
          borderRadius: "20px",
          boxShadow: "0 12px 40px rgba(37,117,252,0.13)",
          padding: "40px 36px",
          maxWidth: "420px",
          margin: "48px auto",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: "2rem",
            color: "#2575fc",
            marginBottom: 18,
            letterSpacing: "1px",
          }}
        >
          {isLogin ? "Welcome Back!" : "Create Your EduAid Account"}
        </h2>
        {error && (
          <div
            className="error-message"
            style={{
              color: "#d32f2f",
              marginBottom: 12,
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}
        <form
          onSubmit={handleAuth}
          className="auth-form"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div className="form-group">
            <label
              htmlFor="email"
              style={{ fontWeight: 700, color: "#23264a", marginBottom: 6 }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                marginTop: 4,
                padding: "14px 16px",
                fontSize: "1.08rem",
                borderRadius: "10px",
                border: "1.5px solid #e3e6ee",
                background: "#f6f7fb",
                color: "#23264a",
                boxShadow: "0 1px 4px rgba(37,117,252,0.04)",
              }}
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="password"
              style={{ fontWeight: 700, color: "#23264a", marginBottom: 6 }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              style={{
                marginTop: 4,
                padding: "14px 16px",
                fontSize: "1.08rem",
                borderRadius: "10px",
                border: "1.5px solid #e3e6ee",
                background: "#f6f7fb",
                color: "#23264a",
                boxShadow: "0 1px 4px rgba(37,117,252,0.04)",
              }}
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label
                htmlFor="name"
                style={{ fontWeight: 700, color: "#23264a", marginBottom: 6 }}
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="auth-input"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                required
                disabled={loading}
                style={{
                  marginTop: 4,
                  padding: "14px 16px",
                  fontSize: "1.08rem",
                  borderRadius: "10px",
                  border: "1.5px solid #e3e6ee",
                  background: "#f6f7fb",
                  color: "#23264a",
                  boxShadow: "0 1px 4px rgba(37,117,252,0.04)",
                }}
              />
            </div>
          )}
          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
            style={{
              marginTop: 8,
              background: "linear-gradient(90deg, #2575fc 0%, #764ba2 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.1rem",
              borderRadius: "10px",
              padding: "14px 0",
              boxShadow: "0 2px 8px rgba(37,117,252,0.08)",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s, transform 0.2s",
            }}
          >
            {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
        <div
          className="auth-divider"
          style={{
            margin: "28px 0 16px 0",
            position: "relative",
            textAlign: "center",
          }}
        >
          <span
            style={{
              background: "#fff",
              color: "#888",
              padding: "0 14px",
              fontSize: "1.08rem",
              position: "relative",
              zIndex: 1,
              fontWeight: 600,
            }}
          >
            or
          </span>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              height: 1,
              background: "#e3e6ee",
              zIndex: 0,
            }}
          />
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="google-btn"
          disabled={loading}
          type="button"
          style={{
            width: "100%",
            background: "#fff",
            color: "#23264a",
            border: "1.5px solid #e3e6ee",
            borderRadius: "10px",
            padding: "14px 0",
            fontSize: "1.12rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(28,32,48,0.07)",
            transition: "background 0.2s, color 0.2s, border 0.2s",
            marginBottom: 8,
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google"
            className="google-icon"
            style={{
              width: "26px",
              height: "26px",
              marginRight: "10px",
              verticalAlign: "middle",
              display: "inline-block",
            }}
          />
          <span style={{ verticalAlign: "middle", display: "inline-block" }}>
            {loading
              ? "Loading..."
              : isLogin
              ? "Sign in with Google"
              : "Sign up with Google"}
          </span>
        </button>
        <div
          className="auth-switch"
          style={{
            marginTop: 22,
            color: "#23264a",
            fontSize: "1.08rem",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {isLogin ? "Don't have an account?" : "Already have an account? "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="switch-link"
            style={{
              color: "#2575fc",
              fontWeight: 700,
              cursor: "pointer",
              marginLeft: 6,
              transition: "color 0.2s",
            }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
