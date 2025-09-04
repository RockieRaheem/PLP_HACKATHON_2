import React, { useState, useRef, useEffect } from "react";
import "./NavigationChatbot.css";

const NavigationChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Enhanced knowledge base with comprehensive coverage
  const knowledgeBase = {
    gettingStarted: {
      keywords: [
        "start",
        "begin",
        "get started",
        "getting started",
        "first time",
        "new user",
        "how to start",
        "beginner",
        "setup",
        "initialize",
      ],
      response: `🚀 **Welcome to EduAid-Bot!** Here's how to get started:

📚 **Upload Study Materials**: Click the "Upload PDF" button to add your documents
🤖 **Chat with AI Tutor**: Ask questions about your materials and get instant help
📊 **Track Progress**: Monitor your study progress in the dashboard
📅 **Plan Studies**: Use the study planner to organize your learning
💎 **Premium Features**: Upgrade for advanced analytics and priority support

Ready to enhance your learning? Start by uploading your first PDF! 🎯`,
      quickReplies: [
        "Upload PDF",
        "AI Tutor Help",
        "View Dashboard",
        "Study Planner",
      ],
    },

    aiTutor: {
      keywords: [
        "ai tutor",
        "tutor",
        "chat",
        "ask questions",
        "help with studies",
        "learning assistant",
        "study help",
        "ai help",
        "artificial intelligence",
      ],
      response: `🤖 **AI Tutor - Your Personal Learning Assistant**

Our AI Tutor can help you with:
• **Answer Questions**: Ask about any topic from your uploaded materials
• **Explain Concepts**: Get detailed explanations in simple terms
• **Practice Problems**: Generate practice questions and solutions
• **Study Tips**: Receive personalized study recommendations
• **Quick Reviews**: Get summaries of complex topics

💡 **Pro Tip**: The more specific your questions, the better answers you'll get! Try asking "Explain photosynthesis" or "Help me with calculus derivatives"`,
      quickReplies: [
        "Ask AI Question",
        "Upload Materials",
        "Practice Problems",
        "Study Tips",
      ],
    },

    upload: {
      keywords: [
        "upload",
        "pdf",
        "file",
        "document",
        "materials",
        "add files",
        "study materials",
        "upload pdf",
      ],
      response: `📄 **Upload Your Study Materials**

**Supported Formats**: PDF files (up to 10MB per file)

**How to Upload**:
1. Click the "Upload PDF" button
2. Select your study materials from your device
3. Wait for processing (usually takes 30-60 seconds)
4. Start chatting with your AI tutor about the content!

**Best Practices**:
• Use clear, text-based PDFs for best results
• Break large documents into smaller sections
• Name your files descriptively

Your uploaded materials are processed securely and stored safely! 🔒`,
      quickReplies: [
        "Upload Now",
        "File Requirements",
        "Security Info",
        "AI Tutor Help",
      ],
    },

    dashboard: {
      keywords: [
        "dashboard",
        "progress",
        "analytics",
        "stats",
        "statistics",
        "performance",
        "tracking",
        "overview",
      ],
      response: `📊 **Progress Dashboard - Track Your Learning Journey**

**Key Features**:
• **Study Time**: Monitor total hours spent studying
• **Session Analytics**: See your most productive study times
• **Topic Progress**: Track understanding across different subjects
• **Achievement Badges**: Unlock rewards for reaching milestones
• **Weekly Goals**: Set and monitor learning objectives

**Premium Analytics**:
• Advanced performance insights
• Detailed learning patterns
• Comparative analysis
• Custom reporting

Check your dashboard regularly to stay motivated! 🎯`,
      quickReplies: [
        "View Dashboard",
        "Set Goals",
        "Premium Analytics",
        "Study Stats",
      ],
    },

    studyPlanner: {
      keywords: [
        "study planner",
        "planner",
        "schedule",
        "plan studies",
        "organize",
        "calendar",
        "study schedule",
        "planning",
      ],
      response: `📅 **Study Planner - Organize Your Learning**

**Smart Planning Features**:
• **Auto-Schedule**: AI creates optimal study schedules
• **Goal Setting**: Set daily, weekly, and monthly targets
• **Deadline Tracking**: Never miss an assignment or exam
• **Study Blocks**: Organize focused study sessions
• **Break Reminders**: Maintain healthy study habits

**Customization Options**:
• Choose your preferred study times
• Set study intensity levels
• Add breaks and leisure time
• Sync with external calendars

Let the planner guide your success! 📈`,
      quickReplies: [
        "Create Schedule",
        "Set Goals",
        "View Calendar",
        "Study Tips",
      ],
    },

    premium: {
      keywords: [
        "premium",
        "pro",
        "upgrade",
        "subscription",
        "paid",
        "pricing",
        "premium features",
        "pro version",
      ],
      response: `💎 **Premium Features - Unlock Your Full Potential**

**Premium Benefits**:
• **Unlimited AI Interactions**: No daily limits
• **Advanced Analytics**: Detailed learning insights
• **Priority Support**: 24/7 premium assistance
• **Custom Study Plans**: Personalized learning paths
• **Offline Access**: Study anywhere, anytime
• **Export Options**: Download your progress reports

**Flexible Pricing**:
• Monthly: $9.99/month
• Annual: $79.99/year (33% savings)
• Student: 50% discount with valid student ID

**30-Day Free Trial** - Cancel anytime! 🌟`,
      quickReplies: [
        "Start Free Trial",
        "View Pricing",
        "Student Discount",
        "Premium Benefits",
      ],
    },

    payment: {
      keywords: [
        "payment",
        "billing",
        "subscription",
        "cancel",
        "refund",
        "card",
        "paypal",
        "pricing",
        "cost",
      ],
      response: `💳 **Payment & Billing Information**

**Accepted Payments**:
• Credit/Debit Cards (Visa, MasterCard, Amex)
• PayPal
• Apple Pay
• Google Pay
• Bank Transfers (annual plans)

**Billing Cycle**:
• Monthly subscriptions: Billed on the same date each month
• Annual subscriptions: Billed yearly with 33% savings

**Cancellation**: Cancel anytime from your account settings
**Refunds**: 30-day money-back guarantee for new subscribers

All transactions are secured with industry-standard encryption! 🔒`,
      quickReplies: [
        "Payment Methods",
        "Cancel Subscription",
        "Billing Help",
        "Refund Request",
      ],
    },

    troubleshooting: {
      keywords: [
        "help",
        "problem",
        "issue",
        "error",
        "bug",
        "not working",
        "broken",
        "trouble",
        "support",
        "fix",
      ],
      response: `🔧 **Technical Support & Troubleshooting**

**Common Solutions**:
• **Refresh the page** if features aren't loading
• **Clear browser cache** for performance issues
• **Check internet connection** for sync problems
• **Update your browser** for compatibility

**Still Need Help?**
• Use the help chat in the bottom-right corner
• Email: support@eduaid-bot.com
• Response time: < 24 hours (< 2 hours for Premium)

**Bug Reports**: We appreciate detailed bug reports to improve the platform! 🐛`,
      quickReplies: [
        "Report Bug",
        "Contact Support",
        "Clear Cache",
        "Update Browser",
      ],
    },

    features: {
      keywords: [
        "features",
        "what can you do",
        "capabilities",
        "functions",
        "tools",
        "options",
        "what features",
      ],
      response: `⚡ **EduAid-Bot Core Features**

**🤖 AI-Powered Learning**:
• Intelligent tutoring system
• Personalized explanations
• Practice question generation

**📚 Document Processing**:
• PDF upload and analysis
• Text extraction and indexing
• Multi-format support

**📊 Analytics & Tracking**:
• Study time monitoring
• Progress visualization
• Performance insights

**📅 Smart Planning**:
• AI-powered scheduling
• Goal setting and tracking
• Deadline management

**🔄 Offline Capabilities**:
• Download materials for offline study
• Sync when reconnected

Explore each feature to maximize your learning potential! 🚀`,
      quickReplies: [
        "AI Tutor",
        "Upload PDF",
        "View Analytics",
        "Study Planner",
      ],
    },

    offline: {
      keywords: [
        "offline",
        "no internet",
        "connection",
        "sync",
        "download",
        "offline mode",
        "internet connection",
      ],
      response: `📱 **Offline Learning Capabilities**

**Available Offline**:
• Previously downloaded materials
• Cached AI responses
• Local progress tracking
• Basic study planner

**Sync When Online**:
• Progress automatically syncs
• New AI interactions
• Updated materials
• Cloud backup

**How to Prepare for Offline**:
1. Download materials while online
2. Cache important AI responses
3. Set up study schedule

**Pro Tip**: Premium users get enhanced offline features including extended storage! ⚡`,
      quickReplies: [
        "Download Materials",
        "Sync Now",
        "Offline Settings",
        "Premium Offline",
      ],
    },

    security: {
      keywords: [
        "security",
        "privacy",
        "data",
        "safe",
        "protection",
        "encryption",
        "private",
        "secure",
      ],
      response: `🔒 **Security & Privacy Protection**

**Data Security**:
• End-to-end encryption for all communications
• Secure cloud storage with military-grade encryption
• Regular security audits and penetration testing
• GDPR and CCPA compliant

**Privacy Measures**:
• Your documents are never shared with third parties
• AI training doesn't use your personal content
• Data retention policies clearly defined
• Easy data deletion upon request

**Your Control**:
• Download your data anytime
• Delete account and data permanently
• Granular privacy settings

Your learning materials and progress are completely secure! 🛡️`,
      quickReplies: [
        "Privacy Policy",
        "Data Download",
        "Security Settings",
        "Delete Data",
      ],
    },
  };

  // Enhanced stop words list for better keyword matching
  const stopWords = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "he",
    "in",
    "is",
    "it",
    "its",
    "of",
    "on",
    "that",
    "the",
    "to",
    "was",
    "will",
    "with",
    "how",
    "what",
    "where",
    "when",
    "why",
    "who",
    "which",
    "can",
    "could",
    "should",
    "would",
    "i",
    "you",
    "we",
    "they",
    "this",
    "that",
    "these",
    "those",
    "my",
    "your",
    "his",
    "her",
    "our",
    "their",
    "me",
    "him",
    "her",
    "us",
    "them",
    "do",
    "does",
    "did",
    "have",
    "had",
    "will",
    "would",
    "could",
    "should",
  ]);

  // Intelligent response matching with scoring
  const findBestResponse = (userInput) => {
    const inputLower = userInput.toLowerCase();
    const inputWords = inputLower
      .split(/\s+/)
      .filter((word) => !stopWords.has(word));

    let bestMatch = null;
    let highestScore = 0;

    // Score each knowledge base entry
    Object.entries(knowledgeBase).forEach(([category, data]) => {
      let score = 0;

      // Check for direct keyword matches
      data.keywords.forEach((keyword) => {
        if (inputLower.includes(keyword.toLowerCase())) {
          score += keyword.split(" ").length * 2; // Multi-word keywords get higher scores
        }
      });

      // Check for partial word matches
      inputWords.forEach((word) => {
        data.keywords.forEach((keyword) => {
          if (
            keyword.toLowerCase().includes(word) ||
            word.includes(keyword.toLowerCase())
          ) {
            score += 1;
          }
        });
      });

      if (score > highestScore) {
        highestScore = score;
        bestMatch = { category, ...data };
      }
    });

    return bestMatch;
  };

  // Handle closing chatbot and clearing chat
  const handleClose = () => {
    setIsOpen(false);
    // Clear messages when closing (WhatsApp-style behavior)
    setTimeout(() => {
      setMessages([]);
    }, 300); // Wait for animation to complete
  };

  // Enhanced default responses with contextual help
  const getDefaultResponse = (userInput) => {
    const responses = [
      {
        text: `🤔 I'd love to help you with that! Here's what I can assist you with:

**🚀 Getting Started** - Learn how to use EduAid-Bot
**📚 Upload Materials** - Add your study documents  
**🤖 AI Tutor** - Chat with your learning assistant
**📊 Progress Tracking** - Monitor your study journey
**📅 Study Planning** - Organize your learning schedule
**💎 Premium Features** - Unlock advanced capabilities

Try asking me something like "How do I get started?" or "Help me upload a PDF"`,
        quickReplies: [
          "Getting Started",
          "Upload PDF",
          "AI Tutor Help",
          "Premium Features",
        ],
      },
      {
        text: `💡 **I'm here to guide you through EduAid-Bot!**

You can ask me about:
• How to upload and use study materials
• AI tutor capabilities and features  
• Progress tracking and analytics
• Study planning and scheduling
• Premium subscription benefits
• Technical support and troubleshooting

**Example Questions**:
"How does the AI tutor work?"
"What are the premium features?"
"Help me with study planning"

What would you like to know more about? 🎯`,
        quickReplies: [
          "AI Tutor Info",
          "Premium Benefits",
          "Study Planning",
          "Upload Help",
        ],
      },
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        type: "bot",
        text: `👋 **Welcome to EduAid-Bot Navigation Assistant!**

I'm here to help you navigate and make the most of our educational platform. I can guide you through:

🚀 **Getting started** with uploads and AI tutoring
📊 **Understanding analytics** and progress tracking  
📅 **Using the study planner** effectively
💎 **Exploring premium features** and benefits
🔧 **Troubleshooting** any issues you encounter

**Quick Start**: Try clicking one of the buttons below or ask me anything! 😊`,
        quickReplies: [
          "Getting Started",
          "Upload PDF",
          "AI Tutor Help",
          "Premium Features",
        ],
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Handle quick reply clicks
  const handleQuickReply = (reply) => {
    setInput(reply);
    handleSend(reply);
  };

  // Add bot message with optional quick replies
  const addBotMessage = (text, quickReplies = []) => {
    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        text,
        quickReplies,
        timestamp: new Date(),
      },
    ]);
  };

  // Handle sending messages
  const handleSend = (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = {
      type: "user",
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate thinking time based on complexity
    const thinkingTime = messageText.length > 50 ? 2000 : 1500;

    setTimeout(() => {
      const bestMatch = findBestResponse(messageText);

      if (bestMatch) {
        addBotMessage(bestMatch.response, bestMatch.quickReplies || []);
      } else {
        const defaultResponse = getDefaultResponse(messageText);
        addBotMessage(defaultResponse.text, defaultResponse.quickReplies);
      }

      setIsTyping(false);
    }, thinkingTime);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* WhatsApp-Style Toggle Button */}
      <div
        className={`nav-chatbot-toggle ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="pulse-ring"></div>
        {isOpen ? "✕" : "💬"}
        <div className="toggle-tooltip">
          {isOpen ? "Close Navigation Helper" : "Open Navigation Helper"}
        </div>
      </div>

      {/* WhatsApp-Style Chat Window */}
      <div className={`nav-chatbot-window ${isOpen ? "open" : ""}`}>
        {/* WhatsApp-Style Header */}
        <div className="nav-chatbot-header">
          <div className="header-info">
            <div className="bot-avatar">
              🤖
              <div className="status-indicator"></div>
            </div>
            <div className="bot-details">
              <h3>EduAid Navigation Bot</h3>
              <div className="status">
                <span>Online & Ready to Help</span>
              </div>
            </div>
          </div>
          <button className="close-btn" onClick={() => handleClose()}>
            ✕
          </button>
        </div>

        {/* WhatsApp-Style Messages Area */}
        <div className="nav-chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              <div className="message-content">
                <div className="message-text">
                  {message.text.split("\n").map((line, i) => (
                    <div key={i}>
                      {line.startsWith("•") ? (
                        <div className="bullet-point">{line}</div>
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: line.replace(
                              /\*\*(.*?)\*\*/g,
                              "<strong>$1</strong>"
                            ),
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
                {message.quickReplies && message.quickReplies.length > 0 && (
                  <div className="quick-replies">
                    {message.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        className="quick-reply-btn"
                        onClick={() => handleQuickReply(reply)}
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* WhatsApp-Style Typing Indicator */}
          {isTyping && (
            <div className="typing-indicator">
              <div className="typing-dots">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
              <span>Navigation Assistant is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp-Style Input Area */}
        <div className="nav-chatbot-input">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={isTyping}
            />
          </div>
          <button
            className="send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
};

export default NavigationChatbot;
