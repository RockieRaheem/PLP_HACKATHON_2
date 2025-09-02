import React, { useState, useEffect } from "react";
import "./ModernStudyPlanner.css";

const ModernStudyPlanner = ({ userId }) => {
  const [studyPlan, setStudyPlan] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [viewMode, setViewMode] = useState("calendar"); // calendar, list, kanban
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [studyGoals, setStudyGoals] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState({});
  const [currentDate] = useState(new Date());
  const [dataLoaded, setDataLoaded] = useState(false); // Track if initial data load is complete

  // Make debug function available globally for testing
  React.useEffect(() => {
    const debugFn = () => {
      console.log("🔍 DEBUG: Current localStorage state for user:", userId);
      console.log("studyPlan:", localStorage.getItem(`studyPlan_${userId}`));
      console.log("studyGoals:", localStorage.getItem(`studyGoals_${userId}`));
      console.log(
        "weeklyProgress:",
        localStorage.getItem(`weeklyProgress_${userId}`)
      );
      console.log("Current studyPlan state:", studyPlan);
    };
    window.debugLocalStorage = debugFn;
    return () => {
      delete window.debugLocalStorage;
    };
  }, [studyPlan, userId]);

  // Load saved data from localStorage with error handling
  useEffect(() => {
    if (!userId) {
      console.log("⚠️ No userId provided, skipping localStorage load");
      return;
    }

    console.log(
      "🔄 ModernStudyPlanner component mounted, loading data from localStorage for user:",
      userId
    );

    // Migration: Check for old global localStorage data and migrate to user-specific
    const oldGlobalPlan = localStorage.getItem("studyPlan");
    const oldGlobalGoals = localStorage.getItem("studyGoals");
    const oldGlobalProgress = localStorage.getItem("weeklyProgress");

    if (oldGlobalPlan && !localStorage.getItem(`studyPlan_${userId}`)) {
      console.log(
        "🔄 Migrating old global studyPlan data to user-specific storage for user",
        userId
      );
      localStorage.setItem(`studyPlan_${userId}`, oldGlobalPlan);
      localStorage.removeItem("studyPlan");
    }

    if (oldGlobalGoals && !localStorage.getItem(`studyGoals_${userId}`)) {
      console.log(
        "🔄 Migrating old global studyGoals data to user-specific storage for user",
        userId
      );
      localStorage.setItem(`studyGoals_${userId}`, oldGlobalGoals);
      localStorage.removeItem("studyGoals");
    }

    if (
      oldGlobalProgress &&
      !localStorage.getItem(`weeklyProgress_${userId}`)
    ) {
      console.log(
        "🔄 Migrating old global weeklyProgress data to user-specific storage for user",
        userId
      );
      localStorage.setItem(`weeklyProgress_${userId}`, oldGlobalProgress);
      localStorage.removeItem("weeklyProgress");
    }

    try {
      const savedPlan = localStorage.getItem(`studyPlan_${userId}`);
      const savedGoals = localStorage.getItem(`studyGoals_${userId}`);
      const savedProgress = localStorage.getItem(`weeklyProgress_${userId}`);

      console.log("🔍 Raw localStorage data for user", userId, ":", {
        studyPlan: savedPlan,
        studyGoals: savedGoals,
        weeklyProgress: savedProgress,
      });

      if (savedPlan && savedPlan !== "[]" && savedPlan !== "null") {
        const parsedPlan = JSON.parse(savedPlan);
        console.log("✅ About to set studyPlan with parsed data:", parsedPlan);
        setStudyPlan(parsedPlan);
        console.log(
          "✅ Loaded",
          parsedPlan.length,
          "tasks from localStorage for user",
          userId,
          ":",
          parsedPlan
        );
      } else {
        console.log(
          "⚠️ No saved study plan found in localStorage for user",
          userId,
          "or it's empty. Raw value:",
          savedPlan
        );
        setStudyPlan([]);
      }

      if (savedGoals && savedGoals !== "[]") {
        const parsedGoals = JSON.parse(savedGoals);
        setStudyGoals(parsedGoals);
        console.log(
          "✅ Loaded",
          parsedGoals.length,
          "goals from localStorage for user",
          userId
        );
      } else {
        setStudyGoals([]);
      }

      if (savedProgress && savedProgress !== "{}") {
        const parsedProgress = JSON.parse(savedProgress);
        setWeeklyProgress(parsedProgress);
        console.log(
          "✅ Loaded weekly progress from localStorage for user",
          userId
        );
      } else {
        setWeeklyProgress({});
      }

      // Mark data as loaded to prevent race conditions
      setDataLoaded(true);
      console.log("🏁 Initial data loading complete for user", userId);
    } catch (error) {
      console.error(
        "❌ Failed to load data from localStorage for user",
        userId,
        ":",
        error
      );
      // Reset to default state if localStorage data is corrupted
      setStudyPlan([]);
      setStudyGoals([]);
      setWeeklyProgress({});
      setDataLoaded(true); // Still mark as loaded even if there was an error
    }
  }, [userId]);

  // Save data to localStorage with error handling and verification
  useEffect(() => {
    if (!userId || !dataLoaded) {
      console.log(
        "⚠️ No userId provided or data not loaded yet, skipping localStorage save"
      );
      return;
    }

    // Only save if studyPlan has been initialized (prevent saving empty array on first load)
    if (studyPlan.length > 0 || localStorage.getItem(`studyPlan_${userId}`)) {
      try {
        const dataToSave = JSON.stringify(studyPlan);
        localStorage.setItem(`studyPlan_${userId}`, dataToSave);
        console.log(
          "💾 Study plan saved to localStorage for user",
          userId,
          ":",
          studyPlan.length,
          "tasks:",
          studyPlan
        );

        // Verify the save operation worked
        setTimeout(() => {
          const verification = localStorage.getItem(`studyPlan_${userId}`);
          if (verification === dataToSave) {
            console.log("✅ localStorage save verified for user", userId);
          } else {
            console.error(
              "❌ localStorage save verification FAILED for user",
              userId
            );
            // Try to save again
            localStorage.setItem(`studyPlan_${userId}`, dataToSave);
          }
        }, 10);
      } catch (error) {
        console.error(
          "❌ Failed to save study plan to localStorage for user",
          userId,
          ":",
          error
        );
      }
    }
  }, [studyPlan, userId, dataLoaded]);

  useEffect(() => {
    if (!userId) return;

    try {
      localStorage.setItem(`studyGoals_${userId}`, JSON.stringify(studyGoals));
      console.log(
        "Study goals saved to localStorage for user",
        userId,
        ":",
        studyGoals.length,
        "goals"
      );
    } catch (error) {
      console.error(
        "Failed to save study goals to localStorage for user",
        userId,
        ":",
        error
      );
    }
  }, [studyGoals, userId]);

  useEffect(() => {
    if (!userId) return;

    try {
      localStorage.setItem(
        `weeklyProgress_${userId}`,
        JSON.stringify(weeklyProgress)
      );
      console.log("Weekly progress saved to localStorage for user", userId);
    } catch (error) {
      console.error(
        "Failed to save weekly progress to localStorage for user",
        userId,
        ":",
        error
      );
    }
  }, [weeklyProgress, userId]);

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
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);

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

    return studyPlan.filter((task) => {
      const taskDate = new Date(task.date);
      return taskDate >= startDate && taskDate <= endDate;
    });
  };

  const getTasksForDay = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return studyPlan.filter((task) => task.date === dateStr);
  };

  const addNewTask = (taskData) => {
    if (!userId) {
      console.error("❌ Cannot add task: No userId provided");
      return;
    }

    const newTask = {
      id: Date.now(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      timeSpent: 0,
      lastModified: new Date().toISOString(),
    };

    console.log("➕ Adding new task for user", userId, ":", newTask);

    // Update state and immediately save to localStorage
    setStudyPlan((prev) => {
      const updatedPlan = [...prev, newTask];
      console.log(
        "📝 Updated study plan with",
        updatedPlan.length,
        "tasks for user",
        userId,
        ":",
        updatedPlan
      );

      // Immediately save to localStorage to ensure persistence
      try {
        const dataToSave = JSON.stringify(updatedPlan);
        localStorage.setItem(`studyPlan_${userId}`, dataToSave);
        console.log(
          "💾 Immediately saved to localStorage after adding task for user",
          userId
        );

        // Double-check that the data was actually saved
        const verification = localStorage.getItem(`studyPlan_${userId}`);
        if (verification === dataToSave) {
          console.log("✅ Data persistence verified!");
        } else {
          console.error("❌ Data persistence verification FAILED!", {
            expected: dataToSave,
            actual: verification,
          });
        }
      } catch (error) {
        console.error(
          "❌ Failed to immediately save to localStorage for user",
          userId,
          ":",
          error
        );
      }

      return updatedPlan;
    });

    setShowAddTaskModal(false);

    // Show success message
    console.log(
      "✅ Task successfully created and saved to localStorage for user",
      userId
    );
  };

  const toggleTaskCompletion = (taskId) => {
    if (!userId) {
      console.error("❌ Cannot toggle task: No userId provided");
      return;
    }

    console.log(
      "🔄 Toggling task completion for task ID:",
      taskId,
      "for user",
      userId
    );
    setStudyPlan((prev) => {
      const updatedPlan = prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              lastModified: new Date().toISOString(),
              completedAt: !task.completed ? new Date().toISOString() : null,
            }
          : task
      );

      // Immediately save to localStorage
      try {
        localStorage.setItem(
          `studyPlan_${userId}`,
          JSON.stringify(updatedPlan)
        );
        console.log(
          "💾 Immediately saved task completion update to localStorage for user",
          userId
        );
      } catch (error) {
        console.error(
          "❌ Failed to save completion update to localStorage for user",
          userId,
          ":",
          error
        );
      }

      return updatedPlan;
    });
    console.log(
      "✅ Task completion status updated and saved to localStorage for user",
      userId
    );
  };

  const deleteTask = (taskId) => {
    if (!userId) {
      console.error("❌ Cannot delete task: No userId provided");
      return;
    }

    if (window.confirm("Are you sure you want to delete this task?")) {
      console.log("🗑️ Deleting task with ID:", taskId, "for user", userId);
      setStudyPlan((prev) => {
        const filteredTasks = prev.filter((task) => task.id !== taskId);
        console.log(
          "📝 Updated study plan after deletion:",
          filteredTasks.length,
          "tasks remaining for user",
          userId,
          ":",
          filteredTasks
        );

        // Immediately save to localStorage
        try {
          localStorage.setItem(
            `studyPlan_${userId}`,
            JSON.stringify(filteredTasks)
          );
          console.log(
            "💾 Immediately saved deletion to localStorage for user",
            userId
          );
        } catch (error) {
          console.error(
            "❌ Failed to save deletion to localStorage for user",
            userId,
            ":",
            error
          );
        }

        return filteredTasks;
      });
      console.log(
        "✅ Task deleted and changes saved to localStorage for user",
        userId
      );
    }
  };

  // Update existing task (for future extensibility)
  // const updateTask = (taskId, updateData) => {
  //   console.log("Updating task with ID:", taskId, "Data:", updateData);
  //   setStudyPlan((prev) =>
  //     prev.map((task) =>
  //       task.id === taskId
  //         ? {
  //             ...task,
  //             ...updateData,
  //             lastModified: new Date().toISOString()
  //           }
  //         : task
  //     )
  //   );
  //   console.log("✅ Task updated and changes will be saved to localStorage");
  // };

  // Clear all data (for debugging purposes)
  // const clearAllData = () => {
  //   if (window.confirm("Are you sure you want to clear all study data? This action cannot be undone.")) {
  //     localStorage.removeItem(`studyPlan_${userId}`);
  //     localStorage.removeItem(`studyGoals_${userId}`);
  //     localStorage.removeItem(`weeklyProgress_${userId}`);
  //     setStudyPlan([]);
  //     setStudyGoals([]);
  //     setWeeklyProgress({});
  //     console.log("✅ All study data cleared for user", userId);
  //   }
  // };

  const getSubjectIcon = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.icon : "📚";
  };

  const getSubjectColor = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.color : "#FF7A00";
  };

  const getTaskTypeIcon = (typeId) => {
    const type = taskTypes.find((t) => t.id === typeId);
    return type ? type.icon : "📝";
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorityLevels.find((p) => p.id === priority);
    return priorityObj ? priorityObj.color : "#f39c12";
  };

  const getUpcomingExams = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return studyPlan
      .filter(
        (task) =>
          task.type === "exam" &&
          new Date(task.date) >= today &&
          new Date(task.date) <= nextWeek
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const studyTips = [
    {
      icon: "💡",
      title: "Active Recall",
      tip: "Test yourself frequently instead of just re-reading notes",
    },
    {
      icon: "🔄",
      title: "Spaced Repetition",
      tip: "Review material at increasing intervals for better retention",
    },
    {
      icon: "🎯",
      title: "Focused Sessions",
      tip: "Use 25-minute focused study blocks with 5-minute breaks",
    },
    {
      icon: "📝",
      title: "Summary Writing",
      tip: "Write brief summaries after each study session",
    },
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
                <p>
                  Organize your learning journey and achieve your academic goals
                </p>
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
              {selectedWeek === 0
                ? "This Week"
                : selectedWeek > 0
                ? `${selectedWeek} Week${selectedWeek > 1 ? "s" : ""} Ahead`
                : `${Math.abs(selectedWeek)} Week${
                    Math.abs(selectedWeek) > 1 ? "s" : ""
                  } Ago`}
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
              {subjects.map((subject) => (
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
                  const isToday =
                    day.toDateString() === currentDate.toDateString();

                  return (
                    <div
                      key={index}
                      className={`calendar-day ${isToday ? "today" : ""}`}
                    >
                      <div className="day-header">
                        <div className="day-name">
                          {day.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                        <div className="day-number">{day.getDate()}</div>
                      </div>
                      <div className="day-tasks">
                        {dayTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`task-item ${
                              task.completed ? "completed" : ""
                            }`}
                            style={{
                              "--task-color": getSubjectColor(task.subject),
                            }}
                          >
                            <div className="task-header">
                              <span className="task-icon">
                                {getSubjectIcon(task.subject)}
                              </span>
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
                              <span className="task-type">
                                {getTaskTypeIcon(task.type)}
                              </span>
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

          {/* Study Tips Section */}
          <div className="study-tips-section">
            <h3>💡 Study Tips</h3>
            <div className="tips-grid">
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
                    .map((task) => (
                      <div
                        key={task.id}
                        className={`task-card ${
                          task.completed ? "completed" : ""
                        }`}
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
                                  style={{
                                    backgroundColor: getPriorityColor(
                                      task.priority
                                    ),
                                  }}
                                ></span>
                              </div>
                            </div>
                            <div className="task-meta-row">
                              <span className="task-subject">
                                {getSubjectIcon(task.subject)}{" "}
                                {
                                  subjects.find((s) => s.id === task.subject)
                                    ?.name
                                }
                              </span>
                              <span className="task-type">
                                {getTaskTypeIcon(task.type)}{" "}
                                {
                                  taskTypes.find((t) => t.id === task.type)
                                    ?.name
                                }
                              </span>
                              <span className="task-date">
                                📅 {new Date(task.date).toLocaleDateString()}
                              </span>
                              <span className="task-time">⏰ {task.time}</span>
                            </div>
                            {task.description && (
                              <p className="task-description">
                                {task.description}
                              </p>
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
                      {getCurrentWeekTasks().filter((t) => !t.completed).length}
                    </span>
                  </div>
                  <div className="column-tasks">
                    {getCurrentWeekTasks()
                      .filter((task) => !task.completed)
                      .map((task) => (
                        <div key={task.id} className="kanban-task">
                          <div className="task-header">
                            <span className="task-subject">
                              {getSubjectIcon(task.subject)}
                            </span>
                            <span
                              className="priority-dot"
                              style={{
                                backgroundColor: getPriorityColor(
                                  task.priority
                                ),
                              }}
                            ></span>
                          </div>
                          <h4 className="task-title">{task.title}</h4>
                          <div className="task-meta">
                            <span>
                              📅 {new Date(task.date).toLocaleDateString()}
                            </span>
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
                      {getCurrentWeekTasks().filter((t) => t.completed).length}
                    </span>
                  </div>
                  <div className="column-tasks">
                    {getCurrentWeekTasks()
                      .filter((task) => task.completed)
                      .map((task) => (
                        <div key={task.id} className="kanban-task completed">
                          <div className="task-header">
                            <span className="task-subject">
                              {getSubjectIcon(task.subject)}
                            </span>
                            <span className="completion-check">✓</span>
                          </div>
                          <h4 className="task-title">{task.title}</h4>
                          <div className="task-meta">
                            <span>
                              📅 {new Date(task.date).toLocaleDateString()}
                            </span>
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
                {getUpcomingExams().map((exam) => (
                  <div key={exam.id} className="exam-item">
                    <div className="exam-subject">
                      {getSubjectIcon(exam.subject)}{" "}
                      {subjects.find((s) => s.id === exam.subject)?.name}
                    </div>
                    <div className="exam-date">
                      {new Date(exam.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
const AddTaskModal = ({
  subjects,
  taskTypes,
  priorityLevels,
  onAddTask,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "mathematics",
    type: "homework",
    priority: "medium",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    duration: "60",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      console.log("Submitting new task:", formData);
      onAddTask(formData);
      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        subject: "mathematics",
        type: "homework",
        priority: "medium",
        date: new Date().toISOString().split("T")[0],
        time: "09:00",
        duration: "60",
      });
      console.log("✅ Task form submitted and reset");
    } else {
      console.warn("Task title is required");
      alert("Please enter a task title");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Study Task</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
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
                {subjects.map((subject) => (
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
                {taskTypes.map((type) => (
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
                {priorityLevels.map((priority) => (
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
