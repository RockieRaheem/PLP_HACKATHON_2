import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Components
import AuthComponent from './components/Auth/Login';
import ChatInterface from './components/Chat/ChatInterface';
import PdfUploader from './components/FileUpload/PdfUploader';
import StudyPlanner from './components/StudyPlanner/StudyPlanner';
import ProgressDashboard from './components/Progress/ProgressDashboard';
import PaymentGateway from './components/Payment/PaymentGateway';

// Styles
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

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

  if (!user) {
    return <AuthComponent />;
  }

  const tabs = [
    { id: 'chat', label: '💬 Chat', icon: '💬' },
    { id: 'upload', label: '📄 Upload', icon: '📄' },
    { id: 'planner', label: '📚 Planner', icon: '📚' },
    { id: 'progress', label: '📊 Progress', icon: '📊' },
    { id: 'premium', label: '💎 Premium', icon: '💎' },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'upload':
        return <PdfUploader />;
      case 'planner':
        return <StudyPlanner />;
      case 'progress':
        return <ProgressDashboard userId={user.uid} />;
      case 'premium':
        return <PaymentGateway />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <h1>🤖 EduAid Bot</h1>
            <span className="tagline">Your AI Study Companion</span>
          </div>
          <div className="user-info">
            <span>Welcome, {user.displayName || user.email}!</span>
            <button 
              onClick={() => auth.signOut()} 
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <div className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="app-main">
        <div className="main-content">
          {renderActiveComponent()}
        </div>
      </main>

      <footer className="app-footer">
        <p>🌍 Empowering African Students • Built with ❤️ for Quality Education</p>
        <div className="footer-links">
          <span>Powered by OpenAI & Firebase</span>
          <span>•</span>
          <span>Payments by IntaSend</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
