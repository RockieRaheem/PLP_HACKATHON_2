import React, { useState, useEffect, useRef } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
import "./ModernChatInterface.css";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [chatMode, setChatMode] = useState("tutor"); // tutor, homework, exam, creative
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = httpsCallable(functions, "sendChatMessage");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatModes = [
    {
      id: "tutor",
      name: "AI Tutor",
      icon: "🎓",
      description: "Get personalized tutoring",
      color: "#FF7A00",
    },
    {
      id: "homework",
      name: "Homework Help",
      icon: "📝",
      description: "Step-by-step solutions",
      color: "#00A86B",
    },
    {
      id: "exam",
      name: "Exam Prep",
      icon: "📊",
      description: "Practice and review",
      color: "#0066CC",
    },
    {
      id: "creative",
      name: "Creative Writing",
      icon: "✍️",
      description: "Essays and stories",
      color: "#8E44AD",
    },
  ];

  const quickSuggestions = [
    {
      text: "Explain photosynthesis in simple terms",
      category: "Science",
      icon: "🌱",
    },
    {
      text: "Help me solve this quadratic equation",
      category: "Math",
      icon: "🧮",
    },
    {
      text: "Create a study plan for chemistry exam",
      category: "Study Planning",
      icon: "📅",
    },
  ];

  const handleSendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);

    const userMessage = {
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      mode: chatMode,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const result = await sendMessage({
        message: messageText,
        context: "african_curriculum",
        language: "english",
        mode: chatMode,
      });

      const botMessage = {
        text: result.data.response,
        sender: "bot",
        timestamp: new Date(),
        mode: chatMode,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput("");
    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentModeData = () => {
    return chatModes.find((mode) => mode.id === chatMode);
  };

  return (
    <div className="modern-chat-interface">
      {/* Chat Header */}
      <div className="chat-header-modern">
        <div className="header-content">
          <div className="mode-selector">
            {chatModes.map((mode) => (
              <button
                key={mode.id}
                className={`mode-btn ${chatMode === mode.id ? "active" : ""}`}
                onClick={() => setChatMode(mode.id)}
                style={{
                  "--mode-color": mode.color,
                }}
              >
                <span className="mode-icon">{mode.icon}</span>
                <span className="mode-name">{mode.name}</span>
              </button>
            ))}
          </div>
          <div className="current-mode-info">
            <span className="current-mode-icon">
              {getCurrentModeData()?.icon}
            </span>
            <div className="mode-details">
              <h3>{getCurrentModeData()?.name}</h3>
              <p>{getCurrentModeData()?.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container-modern">
        {messages.length === 0 && showSuggestions ? (
          <div className="welcome-section">
            <div className="welcome-hero">
              <div className="hero-icon">
                <span>{getCurrentModeData()?.icon}</span>
              </div>
              <h2>Welcome to {getCurrentModeData()?.name}</h2>
              <p>
                I'm your AI study companion, specially designed for African
                students. How can I help you today?
              </p>
            </div>

            <div className="suggestions-grid">
              <h4>Popular questions to get you started:</h4>
              <div className="suggestions-container">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-card"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="suggestion-header">
                      <span className="suggestion-icon">{suggestion.icon}</span>
                      <span className="suggestion-category">
                        {suggestion.category}
                      </span>
                    </div>
                    <p className="suggestion-text">{suggestion.text}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === "user" ? (
                    <div className="user-avatar">
                      <span>👤</span>
                    </div>
                  ) : (
                    <div className="bot-avatar">
                      <span>🤖</span>
                    </div>
                  )}
                </div>
                <div className="message-content-wrapper">
                  <div
                    className={`message-bubble ${msg.sender} ${
                      msg.isError ? "error" : ""
                    }`}
                  >
                    <div className="message-text">{msg.text}</div>
                  </div>
                  <div className="message-meta">
                    <span className="message-time">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {msg.sender === "bot" && !msg.isError && (
                      <div className="message-actions">
                        <button className="action-btn" title="Copy">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <rect
                              x="8"
                              y="2"
                              width="8"
                              height="4"
                              rx="1"
                              ry="1"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </button>
                        <button className="action-btn" title="Thumbs up">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7 10V20H21V10C21 9.44772 20.5523 9 20 9H17L15 7H9C7.89543 7 7 7.89543 7 9V10Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7 10L11.2 3.4C11.43 3 11.85 2.8 12.28 3L13 3.5C13.55 3.9 13.77 4.62 13.5 5.2L12 8H19.5C20.33 8 21 8.67 21 9.5V10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button className="action-btn" title="Thumbs down">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17 14V4H3V14C3 14.5523 3.44772 15 4 15H7L9 17H15C16.1046 17 17 16.1046 17 16V14Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M17 14L12.8 20.6C12.57 21 12.15 21.2 11.72 21L11 20.5C10.45 20.1 10.23 19.38 10.5 18.8L12 16H4.5C3.67 16 3 15.33 3 14.5V14"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message-wrapper bot">
                <div className="message-avatar">
                  <div className="bot-avatar">
                    <span>🤖</span>
                  </div>
                </div>
                <div className="message-content-wrapper">
                  <div className="message-bubble bot">
                    <div className="typing-indicator-modern">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Container */}
      <div className="input-container-modern">
        <div className="input-wrapper">
          <div className="input-box">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${getCurrentModeData()?.name.toLowerCase()} anything...`}
              disabled={isLoading}
              rows="1"
              className="message-input"
            />
            <div className="input-actions">
              <button className="attachment-btn" title="Attach file">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59722 21.9983 8.005 21.9983C6.41278 21.9983 4.88583 21.3658 3.76 20.24C2.63417 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63417 12.8758 3.76 11.75L12.33 3.18C13.1258 2.38417 14.2133 1.93417 15.345 1.93417C16.4767 1.93417 17.5642 2.38417 18.36 3.18C19.1558 3.97583 19.6058 5.06333 19.6058 6.195C19.6058 7.32667 19.1558 8.41417 18.36 9.21L10.07 17.5C9.67249 17.8975 9.14583 18.1208 8.595 18.1208C8.04417 18.1208 7.51751 17.8975 7.12 17.5C6.72249 17.1025 6.49916 16.5758 6.49916 16.025C6.49916 15.4742 6.72249 14.9475 7.12 14.55L15.07 6.6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className={`send-btn-modern ${input.trim() ? "active" : ""}`}
                title="Send message"
              >
                {isLoading ? (
                  <div className="loading-spinner-small"></div>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="input-footer">
            <span className="input-hint">
              Press Enter to send, Shift + Enter for new line
            </span>
            <div className="model-info">
              <span className="model-badge">EduAI v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
