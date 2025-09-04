import React, { useState, useRef, useEffect } from "react";
import "./NavigationChatbot.css";

const NavigationChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "👋 Hi! I'm your EduAid-Bot Navigation Assistant. I'm here to help you understand and navigate our educational platform. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Knowledge base for the chatbot
  const knowledgeBase = {
    // System Overview
    "about|system|eduaid|what is": {
      response: `🎓 **About EduAid-Bot**

EduAid-Bot is an innovative educational platform developed by Kamwanga Raheem, a PLP student from Uganda, during PLP Hackathon 2 in September 2025.

**Mission**: Solving UN SDG 4 - Quality Education through AI-powered learning assistance.

**Key Features**:
• 🤖 AI-powered tutoring and chat assistance
• 📊 Analytics dashboard for learning progress
• 📚 Study planner and goal tracking
• 💎 Premium features for enhanced learning
• 📱 Mobile-responsive design for African users
• 💳 Integrated payment system
• 📄 PDF document processing and learning

**Developer Contact**:
📞 Phone/WhatsApp: +256704057370
📧 Email: kamwangaraheem2050@gmail.com`,
      quickReplies: ["Features", "How to get started", "Premium benefits"],
    },

    // Getting Started
    "start|begin|how to|getting started|new user": {
      response: `🚀 **Getting Started with EduAid-Bot**

**Step 1: Authentication**
• Click "Login" or "Sign Up" in the top navigation
• Create your account with email and password
• Verify your account if required

**Step 2: Explore the Dashboard**
• Navigate using the sidebar menu
• Start with the AI Tutor for immediate help
• Check your Analytics to track progress

**Step 3: Begin Learning**
• Ask questions in the AI Tutor chat
• Upload PDFs for document-based learning
• Set up your study schedule in Study Planner

**Step 4: Track Progress**
• Monitor your learning analytics
• Set and achieve learning goals
• Upgrade to Premium for advanced features`,
      quickReplies: ["AI Tutor", "Study Planner", "Analytics", "Premium"],
    },

    // Navigation
    "navigation|menu|sidebar|navigate|move around": {
      response: `🧭 **Navigation Guide**

**Main Sidebar Menu**:
• 🏠 **Dashboard** - Overview of your learning progress
• 🤖 **AI Tutor** - Chat with our educational AI assistant
• 📊 **Analytics** - Detailed learning analytics and insights
• 📚 **Study Planner** - Schedule and organize your studies
• 💎 **Premium** - Upgrade for advanced features
• ⚙️ **Settings** - Customize your experience

**Top Navigation**:
• 🔍 Search functionality
• 🔔 Notifications
• 👤 Profile menu
• 🚪 Login/Logout

**Mobile Navigation**:
• Tap the hamburger menu (☰) to open sidebar
• Swipe gestures supported
• "New Chat" button opens AI Tutor and closes sidebar`,
      quickReplies: ["AI Tutor features", "Dashboard overview", "Settings"],
    },

    // AI Tutor
    "ai tutor|chat|assistant|ask questions|help with studies": {
      response: `🤖 **AI Tutor Features**

**What can the AI Tutor do?**:
• 📝 Answer academic questions across all subjects
• 💡 Provide step-by-step explanations
• 📖 Help with homework and assignments
• 🧮 Solve mathematical problems
• 🔬 Explain scientific concepts
• 📚 Assist with research and writing
• 🗣️ Support multiple languages

**How to use**:
1. Click "New Chat" to start fresh conversation
2. Type your question in the chat input
3. Get instant, intelligent responses
4. Ask follow-up questions for deeper understanding
5. Use voice input (if available)

**Pro Tips**:
• Be specific with your questions
• Ask for examples and explanations
• Request different difficulty levels
• Upload documents for context-based help`,
      quickReplies: ["Upload documents", "Study techniques", "Subject help"],
    },

    // Analytics
    "analytics|progress|tracking|stats|performance": {
      response: `📊 **Analytics Dashboard**

**Learning Insights**:
• 📈 **Progress Tracking** - Monitor your learning journey
• ⏱️ **Study Time** - Track hours spent studying
• 🎯 **Goal Achievement** - See your completed objectives
• 📊 **Subject Performance** - Performance across different topics
• 🔥 **Streak Counter** - Maintain daily learning habits
• 📅 **Weekly Summary** - Overview of weekly activities

**Visual Reports**:
• Interactive charts and graphs
• Progress over time visualization
• Subject-wise breakdown
• Goal completion rates
• Study session analytics

**How to improve**:
• Set daily study goals
• Maintain consistent study streaks
• Focus on weak subject areas
• Review progress regularly`,
      quickReplies: ["Set goals", "Study streaks", "Subject performance"],
    },

    // Study Planner
    "study planner|schedule|plan|organize|calendar": {
      response: `📚 **Study Planner Features**

**Planning Tools**:
• 📅 **Calendar View** - Visual study schedule
• 🎯 **Goal Setting** - Set and track learning objectives
• ⏰ **Time Management** - Allocate study time effectively
• 📋 **Task Lists** - Organize study tasks and assignments
• 🔔 **Reminders** - Never miss a study session
• 📊 **Progress Monitoring** - Track completion rates

**How to create a study plan**:
1. Access Study Planner from sidebar
2. Set your learning goals
3. Schedule study sessions
4. Add specific subjects/topics
5. Set reminder notifications
6. Monitor and adjust as needed

**Best Practices**:
• Schedule regular study breaks
• Balance different subjects
• Set realistic daily goals
• Review and update weekly`,
      quickReplies: ["Create schedule", "Set reminders", "Study techniques"],
    },

    // Premium Features
    "premium|upgrade|subscription|paid features|benefits": {
      response: `💎 **Premium Features**

**Exclusive Benefits**:
• 🚀 **Unlimited AI Conversations** - No daily limits
• 📊 **Advanced Analytics** - Detailed insights and predictions
• 📄 **Enhanced PDF Processing** - Upload larger documents
• 🎯 **Personalized Learning Paths** - AI-customized study plans
• 💾 **Priority Support** - Faster response times
• 🔒 **Advanced Security** - Enhanced data protection
• 📱 **Offline Access** - Download content for offline study

**Subscription Plans**:
• 📦 **Basic Premium** - Essential features
• 🏆 **Pro Premium** - All advanced features
• 👑 **Ultimate** - Complete access + priority support

**Payment Options**:
• Mobile Money (MTN, Airtel)
• Credit/Debit Cards
• Bank Transfer
• Cryptocurrency (Bitcoin, USDT)

**How to upgrade**:
1. Go to Premium section
2. Choose your plan
3. Select payment method
4. Complete secure checkout`,
      quickReplies: ["Payment methods", "Plan comparison", "Free trial"],
    },

    // Technical Support
    "help|support|problem|issue|error|bug|not working": {
      response: `🔧 **Technical Support**

**Common Issues & Solutions**:

**Login Problems**:
• Clear browser cache and cookies
• Check internet connection
• Reset password if needed
• Try different browser

**Chat Not Responding**:
• Refresh the page
• Check internet connection
• Clear browser cache
• Try again in a few minutes

**Mobile Issues**:
• Ensure latest browser version
• Close other browser tabs
• Restart browser app
• Check mobile data/WiFi

**Payment Issues**:
• Verify payment details
• Check account balance
• Try different payment method
• Contact support if persists

**Get Direct Help**:
📞 Call/WhatsApp: +256704057370
📧 Email: kamwangaraheem2050@gmail.com

**Response Times**:
• Premium users: Within 2 hours
• Free users: Within 24 hours`,
      quickReplies: ["Reset password", "Clear cache", "Contact developer"],
    },

    // Features and Capabilities
    "features|capabilities|what can|functions": {
      response: `⭐ **EduAid-Bot Capabilities**

**Learning Features**:
• 🤖 AI-powered tutoring across all subjects
• 📄 PDF document analysis and Q&A
• 🧮 Step-by-step problem solving
• 📝 Writing and research assistance
• 🗣️ Multi-language support
• 📱 Mobile-optimized interface

**Progress Tracking**:
• 📊 Real-time learning analytics
• 🎯 Goal setting and achievement
• 📈 Performance insights
• 🔥 Study streak tracking
• 📅 Study schedule management

**Educational Support**:
• 🎓 K-12 to University level content
• 🔬 STEM subjects specialization
• 📚 Humanities and social sciences
• 💼 Professional development
• 🌍 African curriculum focus

**Technical Features**:
• 🔒 Secure user authentication
• 💾 Cloud data synchronization
• 📱 Progressive Web App (PWA)
• 🌐 Offline functionality
• 💳 Multiple payment gateways`,
      quickReplies: ["Subject specialties", "Mobile features", "Security"],
    },
  };

  const quickReplies = [
    "Getting Started",
    "AI Tutor",
    "Study Planner",
    "Premium Features",
    "Analytics",
    "Technical Support",
    "About EduAid-Bot",
  ];

  const findResponse = (input) => {
    const lowerInput = input.toLowerCase();

    for (const [keywords, data] of Object.entries(knowledgeBase)) {
      const keywordList = keywords.split("|");
      if (keywordList.some((keyword) => lowerInput.includes(keyword))) {
        return data;
      }
    }

    // Default response
    return {
      response: `🤔 I understand you're asking about "${input}". Let me help you with that!

I can assist you with:
• 🚀 Getting started with EduAid-Bot
• 🤖 Using the AI Tutor features
• 📊 Understanding Analytics and progress tracking
• 📚 Setting up Study Planner
• 💎 Premium features and upgrades
• 🔧 Technical support and troubleshooting
• ℹ️ General information about our system

Please choose a topic or ask a more specific question!`,
      quickReplies: [
        "Getting Started",
        "AI Tutor",
        "Premium Features",
        "Technical Support",
      ],
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      type: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = findResponse(inputText);
      const botMessage = {
        type: "bot",
        content: response.response,
        quickReplies: response.quickReplies,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply) => {
    setInputText(reply);
    setTimeout(() => handleSendMessage(), 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div
        className={`nav-chatbot-toggle ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "🤖"}
        <div className="toggle-tooltip">
          {isOpen ? "Close Helper" : "Need Help? Ask me anything!"}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`nav-chatbot-window ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="nav-chatbot-header">
          <div className="header-info">
            <div className="bot-avatar">🤖</div>
            <div className="bot-details">
              <h3>Navigation Assistant</h3>
              <span className="status">● Online</span>
            </div>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        {/* Quick Start Options */}
        {messages.length === 1 && (
          <div className="quick-start-section">
            <h4>🚀 Quick Start</h4>
            <div className="quick-start-grid">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="quick-start-btn"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="nav-chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              <div className="message-content">
                <div
                  className="message-text"
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(/\n/g, "<br>")
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                  }}
                />
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {/* Quick Replies */}
              {message.quickReplies && (
                <div className="quick-replies">
                  {message.quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      className="quick-reply-btn"
                      onClick={() => handleQuickReply(reply)}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="nav-chatbot-input">
          <div className="input-container">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about EduAid-Bot..."
              rows="1"
              className="message-input"
            />
            <button
              onClick={handleSendMessage}
              className="send-btn"
              disabled={!inputText.trim()}
            >
              📤
            </button>
          </div>
          <div className="input-hint">
            💡 Try: "How do I get started?", "What are premium features?", "How
            to use AI tutor?"
          </div>
        </div>

        {/* Footer */}
        <div className="nav-chatbot-footer">
          <div className="developer-credit">
            <span>Developed by Kamwanga Raheem 🇺🇬</span>
            <span>PLP Hackathon 2 - September 2025</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationChatbot;
