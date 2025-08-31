import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Components
import AuthComponent from "./components/Auth/Login";
import ChatInterface from "./components/Chat/ChatInterface";
import PdfUploader from "./components/FileUpload/PdfUploader";
import StudyPlanner from "./components/StudyPlanner/StudyPlanner";
import ProgressDashboard from "./components/Progress/ProgressDashboard";
import PaymentGateway from "./components/Payment/PaymentGateway";

// Styles
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <h2>🤖 EduAid Bot</h2>
          <div className="spinner"></div>
          <p>Loading your study companion...</p>
        </div>
      </div>
    );
  }

  // Show login as default for unauthenticated users
  if (!user) {
    return <AuthComponent setUser={setUser} />;
  }

  const tabs = [
    { id: "chat", label: "💬 Chat", icon: "💬" },
    { id: "upload", label: "📄 Upload", icon: "📄" },
    { id: "planner", label: "📚 Planner", icon: "📚" },
    { id: "progress", label: "📊 Progress", icon: "📊" },
    { id: "premium", label: "💎 Premium", icon: "💎" },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "chat":
        return <ChatInterface />;
      case "upload":
        return <PdfUploader />;
      case "planner":
        return <StudyPlanner />;
      case "progress":
        return <ProgressDashboard userId={user.uid} />;
      case "premium":
        return <PaymentGateway />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="dashboard-bg">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <span role="img" aria-label="EduAid">
            🤖
          </span>
          <span className="sidebar-title">EduAid Bot</span>
        </div>
        <div className="sidebar-user">
          <img
            src={
              user.photoURL
                ? user.photoURL
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.displayName || user.email
                  )}`
            }
            alt="User avatar"
            className="sidebar-avatar"
          />
          <div className="sidebar-username">
            {user.displayName || user.email}
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              auth.signOut();
            }}
          >
            Logout
          </button>
        </div>
        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`sidebar-tab${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="sidebar-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span>Made for Africa 🌍</span>
        </div>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h2>Welcome, {user.displayName || user.email}!</h2>
          <p className="dashboard-subtext">
            Empowering your learning journey with AI, creativity, and vibes.
          </p>
        </div>
        <div className="dashboard-content">{renderActiveComponent()}</div>
      </main>
    </div>
  );
}

export default App;
