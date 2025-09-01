import React, { useState, useEffect } from "react";
import "./ModernAnalytics.css";

const ModernAnalytics = ({ userId }) => {
  const [analyticsData, setAnalyticsData] = useState({});
  const [timeRange, setTimeRange] = useState("week"); // week, month, year
  const [selectedMetric, setSelectedMetric] = useState("overview");
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  // Load saved analytics data from localStorage
  useEffect(() => {
    const savedAnalytics = localStorage.getItem("analyticsData");
    if (savedAnalytics) {
      setAnalyticsData(JSON.parse(savedAnalytics));
    } else {
      // Initialize with sample data
      initializeSampleData();
    }
  }, []);

  const initializeSampleData = () => {
    const sampleData = {
      studyMetrics: {
        totalStudyTime: 127, // hours this month
        sessionsCompleted: 34,
        averageSessionTime: 45, // minutes
        streakDays: 12,
        questionsAnswered: 892,
        correctAnswers: 734,
        accuracy: 82.3,
      },
      weeklyData: [
        { day: "Mon", hours: 2.5, sessions: 3, accuracy: 85 },
        { day: "Tue", hours: 3.2, sessions: 4, accuracy: 78 },
        { day: "Wed", hours: 1.8, sessions: 2, accuracy: 91 },
        { day: "Thu", hours: 4.1, sessions: 5, accuracy: 76 },
        { day: "Fri", hours: 2.7, sessions: 3, accuracy: 89 },
        { day: "Sat", hours: 1.5, sessions: 2, accuracy: 93 },
        { day: "Sun", hours: 3.8, sessions: 4, accuracy: 81 },
      ],
      subjectPerformance: {
        mathematics: { score: 87, timeSpent: 32, improvement: 12, trend: "up" },
        physics: { score: 79, timeSpent: 28, improvement: -3, trend: "down" },
        chemistry: { score: 93, timeSpent: 35, improvement: 8, trend: "up" },
        biology: { score: 81, timeSpent: 24, improvement: 15, trend: "up" },
        english: { score: 88, timeSpent: 18, improvement: 5, trend: "up" },
        history: { score: 75, timeSpent: 15, improvement: -1, trend: "down" },
        geography: { score: 82, timeSpent: 12, improvement: 7, trend: "up" },
        kiswahili: { score: 85, timeSpent: 16, improvement: 3, trend: "up" },
      },
      monthlyProgress: [
        { month: "May", hours: 89, accuracy: 78 },
        { month: "Jun", hours: 102, accuracy: 82 },
        { month: "Jul", hours: 118, accuracy: 85 },
        { month: "Aug", hours: 127, accuracy: 83 },
      ],
      goals: [
        {
          id: 1,
          title: "Study 25 hours this week",
          target: 25,
          current: 19.6,
          type: "time",
        },
        {
          id: 2,
          title: "Achieve 90% accuracy in Math",
          target: 90,
          current: 87,
          type: "accuracy",
        },
        {
          id: 3,
          title: "Complete 15 study sessions",
          target: 15,
          current: 12,
          type: "sessions",
        },
      ],
      achievements: [
        {
          id: 1,
          title: "Study Streak Master",
          description: "12 consecutive study days",
          icon: "🔥",
          unlocked: true,
          date: "2025-08-28",
        },
        {
          id: 2,
          title: "Chemistry Champion",
          description: "93% average in Chemistry",
          icon: "🧪",
          unlocked: true,
          date: "2025-08-25",
        },
        {
          id: 3,
          title: "Question Conqueror",
          description: "500+ questions answered",
          icon: "❓",
          unlocked: true,
          date: "2025-08-20",
        },
        {
          id: 4,
          title: "Time Master",
          description: "100+ hours studied",
          icon: "⏰",
          unlocked: true,
          date: "2025-08-15",
        },
        {
          id: 5,
          title: "Perfectionist",
          description: "Perfect score in any subject",
          icon: "⭐",
          unlocked: false,
          progress: 93,
        },
        {
          id: 6,
          title: "Marathon Learner",
          description: "Study for 6+ hours in a day",
          icon: "🏃",
          unlocked: false,
          progress: 4.1,
        },
      ],
      studyPatterns: {
        bestStudyTime: "16:00-18:00",
        mostProductiveDay: "Thursday",
        averageBreakTime: 12, // minutes
        focusScore: 87,
        consistencyScore: 92,
      },
      insights: [
        {
          type: "positive",
          message: "Your Chemistry performance has improved by 8% this month!",
          icon: "📈",
        },
        {
          type: "warning",
          message:
            "Physics scores have dropped slightly. Consider more practice.",
          icon: "⚠️",
        },
        {
          type: "suggestion",
          message:
            "You study best in the evening. Schedule important topics then.",
          icon: "💡",
        },
        {
          type: "milestone",
          message: "You're only 3% away from your Math accuracy goal!",
          icon: "🎯",
        },
      ],
    };

    setAnalyticsData(sampleData);
    localStorage.setItem("analyticsData", JSON.stringify(sampleData));
  };

  const subjects = [
    { id: "mathematics", name: "Mathematics", icon: "🧮", color: "#FF7A00" },
    { id: "physics", name: "Physics", icon: "⚛️", color: "#0066CC" },
    { id: "chemistry", name: "Chemistry", icon: "🧪", color: "#00A86B" },
    { id: "biology", name: "Biology", icon: "🧬", color: "#8e44ad" },
    { id: "english", name: "English", icon: "📚", color: "#e74c3c" },
    { id: "history", name: "History", icon: "🏛️", color: "#f39c12" },
    { id: "geography", name: "Geography", icon: "🌍", color: "#27ae60" },
    { id: "kiswahili", name: "Kiswahili", icon: "🗣️", color: "#9b59b6" },
  ];

  const getSubjectData = (subjectId) => {
    return subjects.find((s) => s.id === subjectId);
  };

  const formatTime = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${hours.toFixed(1)}h`;
  };

  const getTrendIcon = (trend) => {
    return trend === "up" ? "📈" : trend === "down" ? "📉" : "➡️";
  };

  const getInsightColor = (type) => {
    switch (type) {
      case "positive":
        return "#00A86B";
      case "warning":
        return "#f39c12";
      case "suggestion":
        return "#0066CC";
      case "milestone":
        return "#8e44ad";
      default:
        return "#FF7A00";
    }
  };

  const quickActions = [
    {
      icon: "📊",
      title: "Export Report",
      description: "Download detailed analytics",
      action: () => {},
      color: "#FF7A00",
    },
    {
      icon: "🎯",
      title: "Set Goals",
      description: "Define new study targets",
      action: () => setShowGoalsModal(true),
      color: "#00A86B",
    },
    {
      icon: "🔄",
      title: "Compare Periods",
      description: "Analyze performance trends",
      action: () => {},
      color: "#0066CC",
    },
    {
      icon: "📱",
      title: "Mobile Summary",
      description: "Get insights on the go",
      action: () => {},
      color: "#8e44ad",
    },
  ];

  if (!analyticsData.studyMetrics) {
    return (
      <div className="loading-analytics">
        <div className="loading-spinner"></div>
        <p>Loading your analytics...</p>
      </div>
    );
  }

  return (
    <div className="modern-analytics">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <div className="header-main">
            <div className="page-title">
              <div className="title-icon">📊</div>
              <div>
                <h1>Analytics Dashboard</h1>
                <p>Track your learning progress and discover insights</p>
              </div>
            </div>
            <div className="header-actions">
              <div className="time-range-selector">
                <button
                  className={`range-btn ${
                    timeRange === "week" ? "active" : ""
                  }`}
                  onClick={() => setTimeRange("week")}
                >
                  Week
                </button>
                <button
                  className={`range-btn ${
                    timeRange === "month" ? "active" : ""
                  }`}
                  onClick={() => setTimeRange("month")}
                >
                  Month
                </button>
                <button
                  className={`range-btn ${
                    timeRange === "year" ? "active" : ""
                  }`}
                  onClick={() => setTimeRange("year")}
                >
                  Year
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="key-metrics">
            <div className="metric-card highlight">
              <div className="metric-icon">⏰</div>
              <div className="metric-content">
                <h3>{analyticsData.studyMetrics.totalStudyTime}h</h3>
                <p>Total Study Time</p>
                <span className="metric-change positive">
                  +12% from last month
                </span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🎯</div>
              <div className="metric-content">
                <h3>{analyticsData.studyMetrics.accuracy}%</h3>
                <p>Overall Accuracy</p>
                <span className="metric-change positive">+3.2% this month</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🔥</div>
              <div className="metric-content">
                <h3>{analyticsData.studyMetrics.streakDays}</h3>
                <p>Study Streak (Days)</p>
                <span className="metric-change neutral">Current streak</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">📚</div>
              <div className="metric-content">
                <h3>{analyticsData.studyMetrics.sessionsCompleted}</h3>
                <p>Sessions Completed</p>
                <span className="metric-change positive">+8 this week</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="quick-action-card"
                onClick={action.action}
                style={{ "--action-color": action.color }}
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-content">
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="analytics-content">
        <div className="content-main">
          {/* Weekly Performance Chart */}
          <div className="chart-section">
            <div className="section-header">
              <h3>📈 Weekly Performance</h3>
              <div className="chart-controls">
                <button className="chart-btn active">Study Hours</button>
                <button className="chart-btn">Accuracy</button>
                <button className="chart-btn">Sessions</button>
              </div>
            </div>
            <div className="performance-chart">
              <div className="chart-grid">
                {analyticsData.weeklyData.map((day, index) => (
                  <div key={index} className="chart-day">
                    <div className="day-stats">
                      <div className="stat-value">{day.hours}h</div>
                      <div className="stat-label">{day.accuracy}%</div>
                    </div>
                    <div className="chart-bar-container">
                      <div
                        className="chart-bar"
                        style={{
                          height: `${(day.hours / 5) * 100}%`,
                          backgroundColor:
                            day.hours > 3
                              ? "#00A86B"
                              : day.hours > 2
                              ? "#FF7A00"
                              : "#f39c12",
                        }}
                      ></div>
                    </div>
                    <div className="day-label">{day.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="subjects-section">
            <div className="section-header">
              <h3>📚 Subject Performance</h3>
              <button className="view-all-btn">View Details</button>
            </div>
            <div className="subjects-grid">
              {Object.entries(analyticsData.subjectPerformance).map(
                ([subjectId, data]) => {
                  const subject = getSubjectData(subjectId);
                  return (
                    <div key={subjectId} className="subject-card">
                      <div className="subject-header">
                        <div className="subject-info">
                          <span className="subject-icon">{subject?.icon}</span>
                          <span className="subject-name">{subject?.name}</span>
                        </div>
                        <div className="subject-trend">
                          <span className="trend-icon">
                            {getTrendIcon(data.trend)}
                          </span>
                          <span
                            className={`trend-value ${
                              data.improvement >= 0 ? "positive" : "negative"
                            }`}
                          >
                            {data.improvement > 0 ? "+" : ""}
                            {data.improvement}%
                          </span>
                        </div>
                      </div>
                      <div className="subject-score">
                        <div className="score-circle">
                          <svg viewBox="0 0 36 36" className="circular-chart">
                            <path
                              className="circle-bg"
                              d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="circle"
                              strokeDasharray={`${data.score}, 100`}
                              d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                              style={{ stroke: subject?.color }}
                            />
                          </svg>
                          <div className="score-text">
                            <span className="score-number">{data.score}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="subject-stats">
                        <div className="stat-item">
                          <span className="stat-icon">⏰</span>
                          <span className="stat-value">{data.timeSpent}h</span>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Study Goals */}
          <div className="goals-section">
            <div className="section-header">
              <h3>🎯 Study Goals</h3>
              <button
                className="add-goal-btn"
                onClick={() => setShowGoalsModal(true)}
              >
                + Add Goal
              </button>
            </div>
            <div className="goals-grid">
              {analyticsData.goals.map((goal) => (
                <div key={goal.id} className="goal-card">
                  <div className="goal-header">
                    <h4>{goal.title}</h4>
                    <span className="goal-type">{goal.type}</span>
                  </div>
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(
                            (goal.current / goal.target) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      <span className="current">{goal.current}</span>
                      <span className="separator">/</span>
                      <span className="target">{goal.target}</span>
                    </div>
                  </div>
                  <div className="goal-status">
                    {goal.current >= goal.target ? (
                      <span className="status completed">✅ Completed</span>
                    ) : (
                      <span className="status in-progress">
                        {Math.round((goal.current / goal.target) * 100)}%
                        Complete
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="content-sidebar">
          {/* Insights */}
          <div className="sidebar-section">
            <h3>💡 Smart Insights</h3>
            <div className="insights-list">
              {analyticsData.insights.map((insight, index) => (
                <div
                  key={index}
                  className="insight-item"
                  style={{ "--insight-color": getInsightColor(insight.type) }}
                >
                  <div className="insight-icon">{insight.icon}</div>
                  <div className="insight-content">
                    <p>{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="sidebar-section">
            <h3>🏆 Achievements</h3>
            <div className="achievements-list">
              {analyticsData.achievements
                .filter((a) => a.unlocked)
                .slice(0, 4)
                .map((achievement) => (
                  <div
                    key={achievement.id}
                    className="achievement-item unlocked"
                  >
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-content">
                      <h5>{achievement.title}</h5>
                      <p>{achievement.description}</p>
                      <small>
                        {new Date(achievement.date).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                ))}
            </div>
            <button className="view-all-achievements">
              View All Achievements
            </button>
          </div>

          {/* Study Patterns */}
          <div className="sidebar-section">
            <h3>🔍 Study Patterns</h3>
            <div className="patterns-list">
              <div className="pattern-item">
                <div className="pattern-label">Best Study Time</div>
                <div className="pattern-value">
                  {analyticsData.studyPatterns.bestStudyTime}
                </div>
              </div>
              <div className="pattern-item">
                <div className="pattern-label">Most Productive Day</div>
                <div className="pattern-value">
                  {analyticsData.studyPatterns.mostProductiveDay}
                </div>
              </div>
              <div className="pattern-item">
                <div className="pattern-label">Focus Score</div>
                <div className="pattern-value">
                  {analyticsData.studyPatterns.focusScore}%
                </div>
              </div>
              <div className="pattern-item">
                <div className="pattern-label">Consistency Score</div>
                <div className="pattern-value">
                  {analyticsData.studyPatterns.consistencyScore}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="modal-overlay" onClick={() => setShowGoalsModal(false)}>
          <div className="goals-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Set New Study Goal</h3>
              <button
                className="close-btn"
                onClick={() => setShowGoalsModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="goal-templates">
                <h4>Quick Goal Templates</h4>
                <div className="template-grid">
                  <div className="template-card">
                    <div className="template-icon">⏰</div>
                    <h5>Study Time Goal</h5>
                    <p>Set weekly or daily study hour targets</p>
                  </div>
                  <div className="template-card">
                    <div className="template-icon">🎯</div>
                    <h5>Accuracy Goal</h5>
                    <p>Improve performance in specific subjects</p>
                  </div>
                  <div className="template-card">
                    <div className="template-icon">📚</div>
                    <h5>Session Goal</h5>
                    <p>Complete a target number of study sessions</p>
                  </div>
                  <div className="template-card">
                    <div className="template-icon">🔥</div>
                    <h5>Streak Goal</h5>
                    <p>Maintain consistent daily study habits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernAnalytics;
