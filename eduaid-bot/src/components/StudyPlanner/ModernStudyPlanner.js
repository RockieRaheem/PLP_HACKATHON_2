import React, { useState, useEffect } from "react";
import "./ModernStudyPlanner.css";

const ModernStudyPlanner = () => {
  const [studyPlan, setStudyPlan] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [viewMode, setViewMode] = useState("calendar"); // calendar, list, kanban
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [studyGoals, setStudyGoals] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState({});
  const [currentDate] = useState(new Date());

  // Load saved data from localStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem("studyPlan");
    const savedGoals = localStorage.getItem("studyGoals");
    const savedProgress = localStorage.getItem("weeklyProgress");
    
    if (savedPlan) setStudyPlan(JSON.parse(savedPlan));
    if (savedGoals) setStudyGoals(JSON.parse(savedGoals));
    if (savedProgress) setWeeklyProgress(JSON.parse(savedProgress));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("studyPlan", JSON.stringify(studyPlan));
  }, [studyPlan]);

  useEffect(() => {
    localStorage.setItem("studyGoals", JSON.stringify(studyGoals));
  }, [studyGoals]);

  useEffect(() => {
    localStorage.setItem("weeklyProgress", JSON.stringify(weeklyProgress));
  }, [weeklyProgress]);

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

  const taskTypes = [
    { id: "homework", name: "Homework", icon: "📝", color: "#FF7A00" },
    { id: "revision", name: "Revision", icon: "📖", color: "#00A86B" },
    { id: "practice", name: "Practice", icon: "✍️", color: "#0066CC" },
    { id: "exam", name: "Exam", icon: "📊", color: "#8e44ad" },
    { id: "research", name: "Research", icon: "🔍", color: "#e74c3c" },
    { id: "project", name: "Project", icon: "🎯", color: "#f39c12" },
  ];

  const priorityLevels = [
    { id: "high", name: "High Priority", color: "#e74c3c", icon: "🔴" },
    { id: "medium", name: "Medium Priority", color: "#f39c12", icon: "🟡" },
    { id: "low", name: "Low Priority", color: "#27ae60", icon: "🟢" },
  ];

  const getDaysOfWeek = (weekOffset = 0) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getCurrentWeekTasks = () => {
    const weekDays = getDaysOfWeek(selectedWeek);
    const startDate = weekDays[0];
    const endDate = weekDays[6];
    
    return studyPlan.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate >= startDate && taskDate <= endDate;
    });
  };

  const getTasksForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return studyPlan.filter(task => task.date === dateStr);
  };

  const addNewTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      timeSpent: 0,
    };
    setStudyPlan(prev => [...prev, newTask]);
    setShowAddTaskModal(false);
  };

  const toggleTaskCompletion = (taskId) => {
    setStudyPlan(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setStudyPlan(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const getSubjectIcon = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.icon : "📚";
  };

  const getSubjectColor = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.color : "#FF7A00";
  };

  const getTaskTypeIcon = (typeId) => {
    const type = taskTypes.find(t => t.id === typeId);
    return type ? type.icon : "📝";
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorityLevels.find(p => p.id === priority);
    return priorityObj ? priorityObj.color : "#f39c12";
  };

  const calculateWeekProgress = () => {
    const weekTasks = getCurrentWeekTasks();
    if (weekTasks.length === 0) return 0;
    const completedTasks = weekTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / weekTasks.length) * 100);
  };

  const getUpcomingExams = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return studyPlan
      .filter(task => 
        task.type === "exam" && 
        new Date(task.date) >= today && 
        new Date(task.date) <= nextWeek
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const quickActions = [
    {
      icon: "➕",
      title: "Add Study Task",
      description: "Create a new study session",
      action: () => setShowAddTaskModal(true),
      color: "#FF7A00"
    },
    {
      icon: "🎯",
      title: "Set Goals",
      description: "Define your study objectives",
      action: () => {},
      color: "#00A86B"
    },
    {
      icon: "📊",
      title: "View Analytics",
      description: "Track your progress",
      action: () => {},
      color: "#0066CC"
    },
    {
      icon: "⏰",
      title: "Study Timer",
      description: "Focus with Pomodoro technique",
      action: () => {},
      color: "#8e44ad"
    }
  ];

  const studyTips = [
    {
      icon: "💡",
      title: "Active Recall",
      tip: "Test yourself frequently instead of just re-reading notes"
    },
    {
      icon: "🔄",
      title: "Spaced Repetition",
      tip: "Review material at increasing intervals for better retention"
    },
    {
      icon: "🎯",
      title: "Focused Sessions",
      tip: "Use 25-minute focused study blocks with 5-minute breaks"
    },
    {
      icon: "📝",
      title: "Summary Writing",
      tip: "Write brief summaries after each study session"
    }
  ];

  return (
    <div className="modern-study-planner">
      {/* Header */}
      <div className="planner-header">
        <div className="header-content">
          <div className="header-main">
            <div className="page-title">
              <div className="title-icon">📅</div>
              <div>
                <h1>Study Planner</h1>
                <p>Organize your learning journey and achieve your academic goals</p>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="add-task-btn primary"
                onClick={() => setShowAddTaskModal(true)}
              >
                <span className="btn-icon">➕</span>
                Add Task
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>{calculateWeekProgress()}%</h3>
                <p>Week Progress</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <h3>{getCurrentWeekTasks().length}</h3>
                <p>This Week's Tasks</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3>{getUpcomingExams().length}</h3>
                <p>Upcoming Exams</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <h3>25m</h3>
                <p>Focus Session</p>
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

      {/* Controls */}
      <div className="planner-controls">
        <div className="controls-left">
          <div className="week-navigation">
            <button 
              className="nav-btn"
              onClick={() => setSelectedWeek(selectedWeek - 1)}
            >
              ‹ Previous Week
            </button>
            <div className="current-week">
              {selectedWeek === 0 ? "This Week" : 
               selectedWeek > 0 ? `${selectedWeek} Week${selectedWeek > 1 ? 's' : ''} Ahead` :
               `${Math.abs(selectedWeek)} Week${Math.abs(selectedWeek) > 1 ? 's' : ''} Ago`}
            </div>
            <button 
              className="nav-btn"
              onClick={() => setSelectedWeek(selectedWeek + 1)}
            >
              Next Week ›
            </button>
          </div>

          <div className="subject-filter">
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="subject-select"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.icon} {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="controls-right">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === "calendar" ? "active" : ""}`}
              onClick={() => setViewMode("calendar")}
            >
              📅
            </button>
            <button 
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              📋
            </button>
            <button 
              className={`view-btn ${viewMode === "kanban" ? "active" : ""}`}
              onClick={() => setViewMode("kanban")}
            >
              📊
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="planner-content">
        <div className="content-main">
          {/* Calendar View */}
          {viewMode === "calendar" && (
            <div className="calendar-view">
              <div className="calendar-grid">
                {getDaysOfWeek(selectedWeek).map((day, index) => {
                  const dayTasks = getTasksForDay(day);
                  const isToday = day.toDateString() === currentDate.toDateString();
                  
                  return (
                    <div key={index} className={`calendar-day ${isToday ? "today" : ""}`}>
                      <div className="day-header">
                        <div className="day-name">
                          {day.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="day-number">
                          {day.getDate()}
                        </div>
                      </div>
                      <div className="day-tasks">
                        {dayTasks.map(task => (
                          <div 
                            key={task.id} 
                            className={`task-item ${task.completed ? "completed" : ""}`}
                            style={{ "--task-color": getSubjectColor(task.subject) }}
                          >
                            <div className="task-header">
                              <span className="task-icon">{getSubjectIcon(task.subject)}</span>
                              <span className="task-title">{task.title}</span>
                              <button 
                                className="task-complete-btn"
                                onClick={() => toggleTaskCompletion(task.id)}
                              >
                                {task.completed ? "✓" : "○"}
                              </button>
                            </div>
                            <div className="task-meta">
                              <span className="task-time">{task.time}</span>
                              <span className="task-type">{getTaskTypeIcon(task.type)}</span>
                            </div>
                          </div>
                        ))}
                        {dayTasks.length === 0 && (
                          <div className="no-tasks">No tasks scheduled</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="list-view">
              {getCurrentWeekTasks().length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No tasks scheduled</h3>
                  <p>Add your first study task to get started</p>
                  <button 
                    className="add-task-btn primary"
                    onClick={() => setShowAddTaskModal(true)}
                  >
                    <span className="btn-icon">➕</span>
                    Add Your First Task
                  </button>
                </div>
              ) : (
                <div className="tasks-list">
                  {getCurrentWeekTasks()
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(task => (
                    <div 
                      key={task.id} 
                      className={`task-card ${task.completed ? "completed" : ""}`}
                    >
                      <div className="task-main">
                        <div className="task-checkbox">
                          <button 
                            className="checkbox-btn"
                            onClick={() => toggleTaskCompletion(task.id)}
                          >
                            {task.completed ? "✓" : "○"}
                          </button>
                        </div>
                        <div className="task-details">
                          <div className="task-header-row">
                            <h4 className="task-title">{task.title}</h4>
                            <div className="task-priority">
                              <span 
                                className="priority-indicator"
                                style={{ backgroundColor: getPriorityColor(task.priority) }}
                              ></span>
                            </div>
                          </div>
                          <div className="task-meta-row">
                            <span className="task-subject">
                              {getSubjectIcon(task.subject)} {subjects.find(s => s.id === task.subject)?.name}
                            </span>
                            <span className="task-type">
                              {getTaskTypeIcon(task.type)} {taskTypes.find(t => t.id === task.type)?.name}
                            </span>
                            <span className="task-date">
                              📅 {new Date(task.date).toLocaleDateString()}
                            </span>
                            <span className="task-time">⏰ {task.time}</span>
                          </div>
                          {task.description && (
                            <p className="task-description">{task.description}</p>
                          )}
                        </div>
                        <div className="task-actions">
                          <button 
                            className="action-btn"
                            onClick={() => deleteTask(task.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Kanban View */}
          {viewMode === "kanban" && (
            <div className="kanban-view">
              <div className="kanban-columns">
                <div className="kanban-column">
                  <div className="column-header">
                    <h3>📋 To Do</h3>
                    <span className="task-count">
                      {getCurrentWeekTasks().filter(t => !t.completed).length}
                    </span>
                  </div>
                  <div className="column-tasks">
                    {getCurrentWeekTasks()
                      .filter(task => !task.completed)
                      .map(task => (
                        <div key={task.id} className="kanban-task">
                          <div className="task-header">
                            <span className="task-subject">
                              {getSubjectIcon(task.subject)}
                            </span>
                            <span 
                              className="priority-dot"
                              style={{ backgroundColor: getPriorityColor(task.priority) }}
                            ></span>
                          </div>
                          <h4 className="task-title">{task.title}</h4>
                          <div className="task-meta">
                            <span>📅 {new Date(task.date).toLocaleDateString()}</span>
                            <span>⏰ {task.time}</span>
                          </div>
                          <button 
                            className="complete-btn"
                            onClick={() => toggleTaskCompletion(task.id)}
                          >
                            Mark Complete
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="kanban-column">
                  <div className="column-header">
                    <h3>✅ Completed</h3>
                    <span className="task-count">
                      {getCurrentWeekTasks().filter(t => t.completed).length}
                    </span>
                  </div>
                  <div className="column-tasks">
                    {getCurrentWeekTasks()
                      .filter(task => task.completed)
                      .map(task => (
                        <div key={task.id} className="kanban-task completed">
                          <div className="task-header">
                            <span className="task-subject">
                              {getSubjectIcon(task.subject)}
                            </span>
                            <span className="completion-check">✓</span>
                          </div>
                          <h4 className="task-title">{task.title}</h4>
                          <div className="task-meta">
                            <span>📅 {new Date(task.date).toLocaleDateString()}</span>
                            <span>⏰ {task.time}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="content-sidebar">
          {/* Upcoming Exams */}
          <div className="sidebar-section">
            <h3>🎯 Upcoming Exams</h3>
            {getUpcomingExams().length === 0 ? (
              <p className="no-data">No upcoming exams</p>
            ) : (
              <div className="exam-list">
                {getUpcomingExams().map(exam => (
                  <div key={exam.id} className="exam-item">
                    <div className="exam-subject">
                      {getSubjectIcon(exam.subject)} {subjects.find(s => s.id === exam.subject)?.name}
                    </div>
                    <div className="exam-date">
                      {new Date(exam.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Study Tips */}
          <div className="sidebar-section">
            <h3>💡 Study Tips</h3>
            <div className="tips-list">
              {studyTips.map((tip, index) => (
                <div key={index} className="tip-item">
                  <div className="tip-icon">{tip.icon}</div>
                  <div className="tip-content">
                    <h5>{tip.title}</h5>
                    <p>{tip.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <AddTaskModal
          subjects={subjects}
          taskTypes={taskTypes}
          priorityLevels={priorityLevels}
          onAddTask={addNewTask}
          onClose={() => setShowAddTaskModal(false)}
        />
      )}
    </div>
  );
};

// Add Task Modal Component
const AddTaskModal = ({ subjects, taskTypes, priorityLevels, onAddTask, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "mathematics",
    type: "homework",
    priority: "medium",
    date: new Date().toISOString().split('T')[0],
    time: "09:00",
    duration: "60",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onAddTask(formData);
      setFormData({
        title: "",
        description: "",
        subject: "mathematics",
        type: "homework",
        priority: "medium",
        date: new Date().toISOString().split('T')[0],
        time: "09:00",
        duration: "60",
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Study Task</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Review Calculus Chapter 5"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Optional details about the task..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
              >
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.icon} {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Task Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                {taskTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                {priorityLevels.map(priority => (
                  <option key={priority.id} value={priority.id}>
                    {priority.icon} {priority.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                min="15"
                max="480"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              <span className="btn-icon">➕</span>
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModernStudyPlanner;
