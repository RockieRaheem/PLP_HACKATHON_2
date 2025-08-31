import React from "react";
import "./LandingPage.css";

const LandingPage = ({ onStart }) => (
  <div className="landing-bg">
    <div className="landing-overlay">
      <nav className="landing-nav">
        <span className="logo">
          EduAid<span className="logo-dot">•</span>Bot
        </span>
        <ul>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#sdg">SDG Impact</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
      <main className="landing-main">
        <h1>
          <span className="gradient-text">Empowering African Students</span>
          <br />
          <span className="subhead">AI-Powered Study Companion</span>
        </h1>
        <p className="landing-desc">
          Unlock your academic potential with 24/7 AI tutoring, personalized
          study plans, and real progress tracking.
          <br />
          <span className="sdg-badge">SDG 1: Quality Education</span>
        </p>
        <button className="landing-btn" onClick={onStart}>
          Get Started
        </button>
        <div className="landing-hero-img" />
      </main>
      <section id="features" className="landing-features">
        <h2>Why EduAid Bot?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span role="img" aria-label="AI">
              🤖
            </span>
            <h3>AI Tutoring</h3>
            <p>
              Homework help, exam prep, and explanations in local languages.
            </p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="Progress">
              📈
            </span>
            <h3>Progress Dashboard</h3>
            <p>Track your learning journey and celebrate achievements.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="Planner">
              🗓️
            </span>
            <h3>Smart Study Planner</h3>
            <p>Personalized plans for every student, every goal.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="Payments">
              💳
            </span>
            <h3>Monetization</h3>
            <p>Freemium model with secure African payments (IntaSend).</p>
          </div>
        </div>
      </section>
      <section id="sdg" className="landing-sdg">
        <h2>SDG Impact</h2>
        <p>
          <strong>EduAid Bot</strong> is built for{" "}
          <span className="sdg-highlight">SDG 1: Quality Education</span>.<br />
          We empower students across Africa with accessible, affordable, and
          effective learning tools.
        </p>
      </section>
      <footer id="contact" className="landing-footer">
        <p>Made with ❤️ for Africa | Hackathon 2025</p>
        <p>
          Contact: <a href="mailto:info@eduaidbot.com">info@eduaidbot.com</a>
        </p>
      </footer>
    </div>
  </div>
);

export default LandingPage;
