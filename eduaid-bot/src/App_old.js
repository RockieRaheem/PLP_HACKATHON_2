import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";
import "./AwardWinningUI.css";

// Components
import AuthComponent from "./components/Auth/Login";
import ChatInterface from "./components/Chat/ChatInterface";
import PdfUploader from "./components/FileUpload/PdfUploader";
import StudyPlanner from "./components/StudyPlanner/StudyPlanner";
import ProgressDashboard from "./components/Progress/ProgressDashboard";
import PaymentGateway from "./components/Payment/PaymentGateway";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="luxury-loading-screen">
        <div className="loading-animation">
          <div className="floating-orbs">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
          <div className="loading-content">
            <div className="brand-logo">
              <span className="logo-icon">🎓</span>
              <h1 className="brand-name">EduAid</h1>
            </div>
            <div className="loading-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <p className="loading-text">
                Initializing your learning companion...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthComponent setUser={setUser} />;
  }

  const navigationItems = [
    {
      id: "chat",
      label: "AI Tutor",
      icon: "💬",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      description: "Chat with your AI tutor",
    },
    {
      id: "upload",
      label: "Study Materials",
      icon: "�",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      description: "Upload and analyze documents",
    },
    {
      id: "planner",
      label: "Study Planner",
      icon: "🎯",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      description: "Plan your study schedule",
    },
    {
      id: "progress",
      label: "Analytics",
      icon: "📊",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      description: "Track your progress",
    },
    {
      id: "premium",
      label: "Premium",
      icon: "�",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      description: "Unlock premium features",
    },
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

  const currentTab = navigationItems.find((item) => item.id === activeTab);

  return (
    <div className="luxury-dashboard">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`luxury-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}
      >
        <div className="sidebar-header">
          <div className="brand-identity">
            <div className="brand-icon">
              <span className="icon-gradient">🎓</span>
            </div>
            {!sidebarCollapsed && (
              <div className="brand-text">
                <h1 className="brand-title">EduAid</h1>
                <p className="brand-subtitle">Smart Learning</p>
              </div>
            )}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <span className="toggle-icon">{sidebarCollapsed ? "→" : "←"}</span>
          </button>
        </div>

        <div className="user-profile">
          <div className="profile-avatar">
            <img
              src={
                user.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.displayName || user.email
                )}&background=667eea&color=fff&size=80`
              }
              alt="Profile"
              className="avatar-image"
            />
            <div className="status-indicator online"></div>
          </div>
          {!sidebarCollapsed && (
            <div className="profile-info">
              <h3 className="user-name">{user.displayName || "Student"}</h3>
              <p className="user-level">Learning Champion</p>
            </div>
          )}
        </div>

        <nav className="navigation">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
              style={activeTab === item.id ? { background: item.gradient } : {}}
            >
              <div className="nav-icon">
                <span>{item.icon}</span>
              </div>
              {!sidebarCollapsed && (
                <div className="nav-content">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
              )}
              {activeTab === item.id && (
                <div className="active-indicator"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!sidebarCollapsed && (
            <div className="africa-pride">
              <span className="flag">🌍</span>
              <span className="text">Made for Africa</span>
            </div>
          )}
          <button
            className="logout-button"
            onClick={() => auth.signOut()}
            title="Sign Out"
          >
            <span>🚪</span>
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="luxury-main">
        {activeTab !== "chat" && (
          <div className="page-header">
            <div className="header-content">
              <div className="page-title">
                <div
                  className="title-icon"
                  style={{ background: currentTab?.gradient }}
                >
                  <span>{currentTab?.icon}</span>
                </div>
                <div className="title-text">
                  <h1>{currentTab?.label}</h1>
                  <p>{currentTab?.description}</p>
                </div>
              </div>
              <div className="header-actions">
                <button className="action-btn">
                  <span>⚙️</span>
                </button>
                <button className="action-btn">
                  <span>🔔</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="content-area">{renderActiveComponent()}</div>
      </main>
    </div>
  );
}

export default App;
