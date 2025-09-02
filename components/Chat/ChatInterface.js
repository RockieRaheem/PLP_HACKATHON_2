import React, { useState, useRef, useEffect } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
import "../../src/PremiumChat.css";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = httpsCallable(functions, "sendChatMessage");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        text: "Hello! I'm your AI tutor, specially designed for African students. I'm here to help you excel in your studies. How can I assist you today?",
        sender: "bot",
        timestamp: new Date(),
        id: "welcome-message",
        type: "welcome"
      }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setIsTyping(true);
    const userMessage = {
      text: input,
      sender: "user",
      timestamp: new Date(),
      id: Date.now() + Math.random(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const result = await sendMessage({ message: input });
      
      setTimeout(() => {
        const botMessage = {
          text: result.data.response || "I understand your question. Let me help you with that...",
          sender: "bot",
          timestamp: new Date(),
          id: Date.now() + Math.random(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
        id: Date.now() + Math.random(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const quickSuggestions = [
    "Explain photosynthesis",
    "Help with algebra",
    "Study tips for exams",
    "African history facts",
  ];

  const handleQuickSuggestion = (suggestion) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="modern-chat-container">
      {/* Chat Header */}
      <div className="chat-header-modern">
        <div className="header-content">
          <div className="bot-avatar">
            <div className="avatar-inner">
              <span className="bot-icon">🤖</span>
              <div className="status-dot"></div>
            </div>
          </div>
          <div className="header-text">
            <h2>EduAid Assistant</h2>
            <p className="status-text">
              {isTyping ? "Typing..." : "Online • Ready to help"}
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button className="action-btn">🔍</button>
          <button className="action-btn">📋</button>
          <button className="action-btn">⚙️</button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-area-modern">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💭</div>
            <h3>Start Your Learning Journey</h3>
            <p>Ask me anything about your studies. I'm here to help!</p>
            <div className="suggestion-chips">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => handleQuickSuggestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message-bubble ${message.sender} ${message.type || ''}`}
            >
              {message.sender === "bot" && (
                <div className="message-avatar">
                  <div className="avatar-bg">
                    <span>🤖</span>
                  </div>
                </div>
              )}
              <div className="message-content">
                <div className="message-text">
                  {message.text}
                </div>
                <div className="message-meta">
                  <span className="timestamp">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.sender === "user" && (
                    <span className="status-check">✓✓</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="message-bubble bot typing">
            <div className="message-avatar">
              <div className="avatar-bg">
                <span>🤖</span>
              </div>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="typing-text">EduAid is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="quick-suggestions">
          <p>Try asking about:</p>
          <div className="suggestions-grid">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-button"
                onClick={() => handleQuickSuggestion(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="input-area-modern">
        <div className="input-wrapper">
          <button className="attachment-btn">📎</button>
          <div className="input-field-wrapper">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your studies..."
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSendMessage()
              }
              disabled={isLoading}
              className="message-input-modern"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className={`send-btn-modern ${input.trim() ? "active" : ""}`}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <span className="send-icon">➤</span>
              )}
            </button>
          </div>
          <button className="voice-btn">🎤</button>
        </div>
        <div className="input-footer">
          <p>
            EduAid can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
