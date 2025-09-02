import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";

const ProgressDashboard = ({ userId }) => {
  const [progressData, setProgressData] = useState({
    studyHours: [],
    subjectPerformance: {},
    streakDays: 0,
    totalQuestions: 0,
    weeklyGoal: 20,
    currentWeekHours: 0,
  });

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "user_progress"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      processProgressData(data);
    });

    return () => unsubscribe();
  }, [userId]);

  const processProgressData = (data) => {
    // Process the data and update state
    // For demo purposes, we'll use mock data
    setProgressData({
      studyHours: [
        { date: "Mon", hours: 2 },
        { date: "Tue", hours: 3 },
        { date: "Wed", hours: 1 },
        { date: "Thu", hours: 4 },
        { date: "Fri", hours: 2 },
        { date: "Sat", hours: 1 },
        { date: "Sun", hours: 3 },
      ],
      subjectPerformance: {
        Mathematics: 85,
        Physics: 78,
        Chemistry: 92,
        Biology: 76,
        English: 88,
      },
      streakDays: 7,
      totalQuestions: 142,
      weeklyGoal: 20,
      currentWeekHours: 16,
    });
  };

  const progressPercentage = (progressData.currentWeekHours / progressData.weeklyGoal) * 100;

  return (
    <div className="progress-dashboard">
      <div className="dashboard-header">
        <h2>📊 Your Progress Dashboard</h2>
        <p>Track your learning journey and achievements</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>Study Streak</h3>
            <p className="stat-number">{progressData.streakDays} days</p>
            <small>Keep it up!</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">❓</div>
          <div className="stat-content">
            <h3>Questions Answered</h3>
            <p className="stat-number">{progressData.totalQuestions}</p>
            <small>This week</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>Study Hours</h3>
            <p className="stat-number">{progressData.currentWeekHours}h</p>
            <small>This week</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Weekly Goal</h3>
            <p className="stat-number">{Math.round(progressPercentage)}%</p>
            <small>Completed</small>
          </div>
        </div>
      </div>

      <div className="progress-section">
        <h3>Weekly Study Goal Progress</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        <p>{progressData.currentWeekHours} / {progressData.weeklyGoal} hours completed</p>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>📈 Daily Study Hours</h3>
          <div className="simple-chart">
            {progressData.studyHours.map((day, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar" 
                  style={{ height: `${day.hours * 20}px` }}
                ></div>
                <span className="bar-label">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart">
          <h3>📚 Subject Performance</h3>
          <div className="performance-list">
            {Object.entries(progressData.subjectPerformance).map(([subject, score]) => (
              <div key={subject} className="performance-item">
                <div className="subject-name">{subject}</div>
                <div className="performance-bar">
                  <div 
                    className="performance-fill" 
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
                <div className="score">{score}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <h3>🏆 Recent Achievements</h3>
        <div className="achievements-grid">
          <div className="achievement-badge">
            <span className="badge-icon">🔥</span>
            <div className="badge-text">
              <h4>Week Warrior</h4>
              <small>7-day study streak</small>
            </div>
          </div>
          <div className="achievement-badge">
            <span className="badge-icon">📚</span>
            <div className="badge-text">
              <h4>Question Master</h4>
              <small>100+ questions answered</small>
            </div>
          </div>
          <div className="achievement-badge">
            <span className="badge-icon">⭐</span>
            <div className="badge-text">
              <h4>High Performer</h4>
              <small>90% in Chemistry</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
