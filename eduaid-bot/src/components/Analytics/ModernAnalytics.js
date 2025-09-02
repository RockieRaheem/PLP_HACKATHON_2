import React, { useState, useEffect } from "react";
import "./ModernAnalytics.css";

const ModernAnalytics = ({ userId }) => {
  const [analyticsData, setAnalyticsData] = useState({});
  const [timeRange, setTimeRange] = useState("week"); // week, month, year
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
        </div>
      </div>

      {/* Main Content */}
      <div className="analytics-content">
        <div className="content-main">
          {/* Weekly Performance Chart */}
          <div className="chart-section">
            <div className="section-header">
              <div className="header-title">
                <h3>📈 Weekly Performance Dashboard</h3>
                <p className="section-subtitle">
                  Track your study progress and accuracy trends
                </p>
              </div>
              <div className="chart-controls">
                <button className="chart-btn active" data-metric="hours">
                  <span className="btn-icon">⏰</span>
                  <span className="btn-text">Study Hours</span>
                </button>
                <button className="chart-btn" data-metric="accuracy">
                  <span className="btn-icon">🎯</span>
                  <span className="btn-text">Accuracy</span>
                </button>
                <button className="chart-btn" data-metric="sessions">
                  <span className="btn-icon">📚</span>
                  <span className="btn-text">Sessions</span>
                </button>
              </div>
            </div>

            {/* Weekly Summary Cards */}
            <div className="weekly-summary">
              <div className="summary-card highlight">
                <div className="summary-icon">⚡</div>
                <div className="summary-content">
                  <h4>19.6h</h4>
                  <p>Total Study Time</p>
                  <span className="trend-indicator positive">
                    +2.3h from last week
                  </span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">🎯</div>
                <div className="summary-content">
                  <h4>84.7%</h4>
                  <p>Average Accuracy</p>
                  <span className="trend-indicator positive">
                    +1.8% improvement
                  </span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">📊</div>
                <div className="summary-content">
                  <h4>23</h4>
                  <p>Study Sessions</p>
                  <span className="trend-indicator neutral">
                    Same as last week
                  </span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">🔥</div>
                <div className="summary-content">
                  <h4>5/7</h4>
                  <p>Active Days</p>
                  <span className="trend-indicator positive">
                    Consistent streak
                  </span>
                </div>
              </div>
            </div>

            <div className="performance-chart">
              <div className="chart-header">
                <h4>Daily Breakdown</h4>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color excellent"></div>
                    <span>Excellent (90-100%)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color good"></div>
                    <span>Good (80-89%)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color average"></div>
                    <span>Average (70-79%)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color below-average"></div>
                    <span>Needs Work (&lt;70%)</span>
                  </div>
                </div>
              </div>

              <div className="chart-grid-enhanced">
                {analyticsData.weeklyData.map((day, index) => (
                  <div key={index} className="chart-day-enhanced">
                    <div className="day-header">
                      <span className="day-name">{day.day}</span>
                      <span className="day-date">
                        {new Date(
                          Date.now() - (6 - index) * 24 * 60 * 60 * 1000
                        ).getDate()}
                      </span>
                    </div>

                    <div className="metrics-display">
                      <div className="primary-metric">
                        <span className="metric-value">{day.hours}h</span>
                        <span className="metric-sessions">
                          {day.sessions} sessions
                        </span>
                      </div>

                      <div className="chart-bar-container-enhanced">
                        <div
                          className="chart-bar-enhanced"
                          style={{
                            height: `${
                              day.accuracy >= 90
                                ? 85 + (day.accuracy - 90) * 1.5 // 85-100% height for excellent
                                : day.accuracy >= 80
                                ? 60 + (day.accuracy - 80) * 2.5 // 60-85% height for good
                                : day.accuracy >= 70
                                ? 35 + (day.accuracy - 70) * 2.5 // 35-60% height for average
                                : 20 + (day.accuracy / 70) * 15 // 20-35% height for below average
                            }%`,
                            background:
                              day.accuracy >= 90
                                ? "linear-gradient(135deg, #00A86B 0%, #27ae60 100%)"
                                : day.accuracy >= 80
                                ? "linear-gradient(135deg, #FF7A00 0%, #f39c12 100%)"
                                : day.accuracy >= 70
                                ? "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)"
                                : "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                          }}
                        >
                          <div className="bar-glow"></div>
                        </div>
                      </div>

                      <div className="accuracy-badge">
                        <span
                          className={`accuracy-score ${
                            day.accuracy >= 90
                              ? "excellent"
                              : day.accuracy >= 80
                              ? "good"
                              : day.accuracy >= 70
                              ? "average"
                              : "below-average"
                          }`}
                        >
                          {day.accuracy}%
                        </span>
                      </div>
                    </div>

                    <div className="day-insights">
                      {day.hours >= 4 && (
                        <div className="insight-tag productive">
                          🚀 Productive
                        </div>
                      )}
                      {day.accuracy >= 90 && (
                        <div className="insight-tag accurate">🎯 Accurate</div>
                      )}
                      {day.hours < 2 && (
                        <div className="insight-tag light">💡 Light study</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="chart-footer">
                <div className="performance-insights">
                  <div className="insight-item">
                    <span className="insight-icon">📈</span>
                    <span className="insight-text">
                      Best day: Thursday (4.1h, 76% accuracy)
                    </span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-icon">🎯</span>
                    <span className="insight-text">
                      Highest accuracy: Saturday (93%)
                    </span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-icon">💡</span>
                    <span className="insight-text">
                      Recommended: Focus on consistency during weekdays
                    </span>
                  </div>
                </div>
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
