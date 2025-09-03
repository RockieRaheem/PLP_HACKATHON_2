/**
 * Enhanced OpenAI Service with comprehensive error handling and fallback mechanisms
 * Handles rate limits, quota exceeded, authentication, and API errors
 * Includes offline educational responses for hackathon demo purposes
 */

// OpenAI API configuration
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

/**
 * Enhanced OpenAI Service Class
 * Provides intelligent error handling, fallback mechanisms, and educational responses
 */
class OpenAIService {
  constructor() {
    this.isConnected = false;
    this.connectionStatus = "disconnected";
    this.lastError = null;
    this.fallbackMode = false;
    this.fallbackReason = null;

    // Error message templates
    this.errorMessages = {
      quota_exceeded:
        "Hello, sorry we are unable to use OPENAI models because we have used up all the tokens free tier. Thanks for understanding",
      rate_limit:
        "Rate limit exceeded. Please wait a moment before trying again.",
      authentication_error: "Authentication failed. Please check your API key.",
      network_error:
        "Network connection failed. Please check your internet connection.",
      unknown_error: "An unexpected error occurred. Please try again later.",
    };
  }

  /**
   * Test OpenAI API connection
   */
  async testConnection() {
    console.log("🔍 Testing OpenAI connection...");

    if (!OPENAI_API_KEY) {
      console.warn("❌ No OpenAI API key provided");
      this.connectionStatus = "failed";
      this.fallbackReason = "no_api_key";
      this.fallbackMode = true;
      return { success: false, error: "No API key provided" };
    }

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "Test connection" }],
          max_tokens: 10,
        }),
      });

      if (response.ok) {
        console.log("✅ OpenAI connection successful");
        this.isConnected = true;
        this.connectionStatus = "connected";
        this.fallbackMode = false;
        this.fallbackReason = null;
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log("🔍 Parsing OpenAI error:", errorData);

        const isQuotaExceeded =
          response.status === 429 ||
          (errorData.error && errorData.error.code === "insufficient_quota");

        if (isQuotaExceeded) {
          console.log("❌ OpenAI service unavailable: quota_exceeded");
          this.connectionStatus = "failed";
          this.fallbackReason = "quota_exceeded";
          this.fallbackMode = true;
          console.log(
            "🔄 Enabling educational fallback mode for quota exceeded"
          );
        } else {
          console.warn("❌ OpenAI connection failed:", errorData);
          this.connectionStatus = "failed";
          this.fallbackMode = true;
          this.fallbackReason = "api_error";
        }

        return { success: false, error: errorData };
      }
    } catch (error) {
      console.warn("❌ OpenAI connection failed:", error);
      this.connectionStatus = "failed";
      this.fallbackMode = true;
      this.fallbackReason = "network_error";
      return { success: false, error: error.message };
    }
  }

  /**
   * Send chat completion request to OpenAI
   */
  async chatCompletion(message, options = {}) {
    if (!OPENAI_API_KEY) {
      return {
        success: false,
        error: "No API key provided",
        fallback: true,
      };
    }

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: options.model || "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an AI tutor specializing in African education. Provide helpful, accurate, and culturally relevant educational assistance.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const isQuotaExceeded =
          response.status === 429 ||
          (errorData.error && errorData.error.code === "insufficient_quota");

        if (isQuotaExceeded) {
          this.connectionStatus = "failed";
          this.fallbackReason = "quota_exceeded";
          this.fallbackMode = true;
        }

        return {
          success: false,
          error: errorData.error?.message || `HTTP ${response.status}`,
          fallback: true,
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: data.choices[0]?.message?.content || "No response received",
        usage: data.usage,
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      return {
        success: false,
        error: error.message,
        fallback: true,
      };
    }
  }

  /**
   * Get educational fallback response for when OpenAI is unavailable
   */
  getEducationalFallback(message) {
    const lowerMessage = message.toLowerCase();

    // Math-related keywords
    if (
      lowerMessage.match(
        /math|algebra|geometry|calculus|equation|formula|solve|calculate|fraction|decimal|percentage|statistics|probability/
      )
    ) {
      return `📊 **Math Learning Assistant**

**⚠️ Service Notice:** We are currently unable to use OpenAI models because we have used up all the tokens from our free tier. We have exceeded our quota for the trial period and would need to purchase an OpenAI subscription for advanced math tutoring features.

**Available Math Learning Support:**
I can still help you with mathematics using our educational knowledge base! Here are immediate learning strategies:

**For Problem Solving:**
• Break complex problems into smaller steps
• Identify what's given and what you need to find
• Draw diagrams when possible
• Check your work by substituting answers back

**Practice Resources:**
• Khan Academy (free math courses)
• Photomath app for step-by-step solutions
• IXL Math for practice problems
• African Mathematics Olympiad past papers

**Study Tips for African Students:**
• Connect math to real-world African contexts (market calculations, farming measurements)
• Practice with local currency conversions
• Form study groups with classmates

**With OpenAI Subscription, We Could Offer:**
• Step-by-step problem solving
• Personalized math tutoring
• Instant equation solutions
• Custom practice problems

Thank you for understanding! What specific math topic would you like help with? 🧮✨`;
    }

    // General/Default educational response
    return `🎓 **EduAid Learning Assistant**

**⚠️ Service Notice:**
Hello! We are currently unable to use OpenAI models because we have used up all the tokens from our free tier. We have exceeded our quota for the trial period and would need to purchase an OpenAI subscription to continue providing AI-powered educational assistance.

**Current Status:**
• Our free OpenAI trial has been exhausted
• To unlock full AI tutoring capabilities, we need a paid subscription
• In the meantime, we're providing educational guidance based on our knowledge base

**Study Success Strategies (Available Now):**
• **Active Learning**: Don't just read - summarize, question, and teach others
• **Spaced Repetition**: Review material at increasing intervals
• **Practice Testing**: Quiz yourself regularly
• **Connection Making**: Link new concepts to what you already know

**African Educational Excellence:**
• Leverage your multilingual abilities as a learning advantage
• Connect global concepts to local African contexts
• Participate in study groups and peer learning
• Seek mentorship from successful African professionals

**Recommended Learning Resources:**
• Khan Academy (free courses in many subjects)
• Coursera (university-level courses, often free)
• MIT OpenCourseWare (free university materials)
• Local library resources and study spaces

**Time Management for Students:**
• Use the Pomodoro Technique (25min study, 5min break)
• Prioritize difficult subjects when you're most alert
• Create a consistent daily study schedule
• Balance study time with rest and physical activity

**Future Enhancement:**
With an OpenAI subscription, we could provide:
• Personalized AI tutoring
• Instant homework help
• Custom study plans
• Interactive problem solving

Thank you for understanding! We're still here to help with study strategies and learning guidance. What specific subject or topic would you like to focus on? 🌟📖`;
  }

  /**
   * Get connection status information
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      status: this.connectionStatus,
      lastError: this.lastError,
      fallbackMode: this.fallbackMode,
      fallbackReason: this.fallbackReason,
    };
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(errorType) {
    return this.errorMessages[errorType] || this.errorMessages.unknown_error;
  }

  /**
   * Reset connection status
   */
  resetConnection() {
    this.isConnected = false;
    this.connectionStatus = "disconnected";
    this.lastError = null;
    this.fallbackMode = false;
    this.fallbackReason = null;
  }
}

// Create and export singleton instance
const openaiService = new OpenAIService();
export default openaiService;

// Export class for testing
export { OpenAIService };
