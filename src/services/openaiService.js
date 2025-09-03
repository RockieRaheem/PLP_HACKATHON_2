/**
 * Professional OpenAI Service Integration
 * Following OpenAI API Best Practices and Documentation
 * Implements proper error handling, rate limiting, and fallback mechanisms
 */

// OpenAI API configuration following best practices
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// Debug logging for environment variables
console.log("🔍 Environment variable check:");
console.log(
  "process.env.REACT_APP_OPENAI_API_KEY exists:",
  !!process.env.REACT_APP_OPENAI_API_KEY
);
console.log("OPENAI_API_KEY length:", OPENAI_API_KEY?.length || 0);
console.log(
  "OPENAI_API_KEY starts with sk-:",
  OPENAI_API_KEY?.startsWith("sk-") || false
);

/**
 * Professional OpenAI Service Class
 * Implements OpenAI API v1 best practices with comprehensive error handling
 */
class OpenAIService {
  constructor() {
    this.isConnected = false;
    this.connectionStatus = "disconnected";
    this.lastError = null;
    this.fallbackMode = false;
    this.fallbackReason = null;
    this.requestCount = 0;
    this.lastRequestTime = 0;

    // Rate limiting configuration
    this.minRequestInterval = 1000; // 1 second between requests

    // API configuration following OpenAI documentation
    this.defaultConfig = {
      model: "gpt-3.5-turbo", // Most cost-effective model
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };
  }

  /**
   * Test OpenAI API connection with proper authentication
   */
  async testConnection() {
    console.log("🔍 Testing OpenAI API connection...");

    if (!OPENAI_API_KEY) {
      console.error("❌ No OpenAI API key provided");
      this.connectionStatus = "failed";
      this.fallbackReason = "no_api_key";
      this.fallbackMode = true;
      return { success: false, error: "No API key configured" };
    }

    if (!OPENAI_API_KEY.startsWith("sk-")) {
      console.error("❌ Invalid OpenAI API key format");
      this.connectionStatus = "failed";
      this.fallbackReason = "invalid_api_key";
      this.fallbackMode = true;
      return { success: false, error: "Invalid API key format" };
    }

    try {
      // Test with minimal request to validate API key and quota
      const testPayload = {
        model: this.defaultConfig.model,
        messages: [
          {
            role: "system",
            content: "You are a helpful educational assistant.",
          },
          {
            role: "user",
            content: "Hello",
          },
        ],
        max_tokens: 10,
        temperature: 0.1,
      };

      const response = await this.makeAPIRequest(testPayload);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ OpenAI API connection successful");
        console.log("📊 Model used:", data.model || this.defaultConfig.model);

        this.isConnected = true;
        this.connectionStatus = "connected";
        this.fallbackMode = false;
        this.fallbackReason = null;

        return {
          success: true,
          model: data.model,
          usage: data.usage,
        };
      } else {
        return this.handleAPIError(response);
      }
    } catch (error) {
      console.error("❌ OpenAI connection test failed:", error);
      this.connectionStatus = "failed";
      this.fallbackReason = "network_error";
      this.fallbackMode = true;

      return {
        success: false,
        error: "Network connection failed",
      };
    }
  }

  /**
   * Make authenticated API request with proper headers
   */
  async makeAPIRequest(payload) {
    // Implement basic rate limiting
    const now = Date.now();
    if (now - this.lastRequestTime < this.minRequestInterval) {
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          this.minRequestInterval - (now - this.lastRequestTime)
        )
      );
    }
    this.lastRequestTime = Date.now();
    this.requestCount++;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "User-Agent": "EduAid-Bot/1.0",
    };

    console.log("🚀 Making OpenAI API request:", {
      model: payload.model,
      messageCount: payload.messages?.length,
      maxTokens: payload.max_tokens,
    });

    return await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });
  }

  /**
   * Handle API errors with detailed categorization
   */
  async handleAPIError(response) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      console.warn("Failed to parse error response");
    }

    console.log("🔍 OpenAI API Error Details:", {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
    });

    this.connectionStatus = "failed";

    switch (response.status) {
      case 401:
        this.fallbackReason = "authentication_error";
        this.fallbackMode = true;
        return {
          success: false,
          error: "Invalid API key or authentication failed",
          code: "AUTHENTICATION_ERROR",
        };

      case 429:
        const isQuotaExceeded =
          errorData.error?.code === "insufficient_quota" ||
          errorData.error?.type === "insufficient_quota" ||
          (errorData.error?.message &&
            errorData.error.message.toLowerCase().includes("quota"));

        if (isQuotaExceeded) {
          console.log(
            "❌ OpenAI quota exceeded - enabling educational fallback"
          );
          this.fallbackReason = "quota_exceeded";
          this.fallbackMode = true;
          return {
            success: false,
            error: "OpenAI quota exceeded",
            code: "QUOTA_EXCEEDED",
          };
        } else {
          console.log("❌ OpenAI rate limit exceeded");
          this.fallbackReason = "rate_limit";
          this.fallbackMode = true;
          return {
            success: false,
            error: "Rate limit exceeded",
            code: "RATE_LIMITED",
          };
        }

      case 400:
        this.fallbackReason = "bad_request";
        this.fallbackMode = true;
        return {
          success: false,
          error: "Invalid request format",
          code: "BAD_REQUEST",
        };

      case 500:
      case 502:
      case 503:
        this.fallbackReason = "server_error";
        this.fallbackMode = true;
        return {
          success: false,
          error: "OpenAI server error",
          code: "SERVER_ERROR",
        };

      default:
        this.fallbackReason = "unknown_error";
        this.fallbackMode = true;
        return {
          success: false,
          error: `Unknown error: ${response.status}`,
          code: "UNKNOWN_ERROR",
        };
    }
  }

  /**
   * Professional chat completion with educational context
   */
  async chatCompletion(message, options = {}) {
    if (!OPENAI_API_KEY) {
      console.warn("❌ No API key available for chat completion");
      return {
        success: false,
        error: "No API key configured",
        fallback: true,
      };
    }

    // Check if we're in fallback mode
    if (this.fallbackMode) {
      console.log("📚 Using educational fallback for chat completion");
      return {
        success: false,
        error: "API unavailable - using fallback",
        fallback: true,
      };
    }

    try {
      const chatPayload = {
        model: options.model || this.defaultConfig.model,
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(options.mode || "tutor"),
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: options.maxTokens || this.defaultConfig.max_tokens,
        temperature: options.temperature || this.defaultConfig.temperature,
        top_p: this.defaultConfig.top_p,
        frequency_penalty: this.defaultConfig.frequency_penalty,
        presence_penalty: this.defaultConfig.presence_penalty,
      };

      const response = await this.makeAPIRequest(chatPayload);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Chat completion successful");

        return {
          success: true,
          message: data.choices[0]?.message?.content || "No response received",
          usage: data.usage,
          model: data.model,
        };
      } else {
        const errorResult = await this.handleAPIError(response);
        return {
          success: false,
          error: errorResult.error,
          code: errorResult.code,
          fallback: true,
        };
      }
    } catch (error) {
      console.error("❌ Chat completion error:", error);
      this.fallbackMode = true;
      this.fallbackReason = "network_error";

      return {
        success: false,
        error: error.message,
        fallback: true,
      };
    }
  }

  /**
   * Get appropriate system prompt based on chat mode
   */
  getSystemPrompt(mode) {
    const basePrompt =
      "You are an AI educational assistant specializing in African education. Provide helpful, accurate, and culturally relevant educational assistance.";

    switch (mode) {
      case "tutor":
        return `${basePrompt} Focus on explaining concepts clearly with step-by-step guidance. Use examples relevant to African contexts when possible.`;

      case "homework":
        return `${basePrompt} Help students understand their homework by breaking down problems and guiding them to solutions rather than giving direct answers.`;

      case "exam":
        return `${basePrompt} Provide exam preparation strategies, practice questions, and review materials. Focus on African educational curricula and examination formats.`;

      case "creative":
        return `${basePrompt} Assist with creative writing, essays, and literary analysis. Encourage African perspectives and storytelling traditions.`;

      default:
        return basePrompt;
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

    // Science-related keywords
    if (
      lowerMessage.match(
        /science|biology|chemistry|physics|experiment|molecule|atom|cell|evolution|ecosystem|photosynthesis/
      )
    ) {
      return `🔬 **Science Learning Assistant**

**⚠️ Service Notice:** We are currently unable to use OpenAI models because we have used up all the tokens from our free tier. We have exceeded our quota for the trial period and would need to purchase an OpenAI subscription for advanced science tutoring.

**Available Science Learning Support:**
I can still help you with science concepts using our educational knowledge base!

**Study Strategies for Science:**
• Make concept maps to connect ideas
• Practice drawing diagrams and labeling
• Relate scientific concepts to everyday African life
• Use mnemonics for memorizing facts

**Free Science Resources:**
• Khan Academy Science courses
• NASA educational materials
• African science museums and centers
• Local university science programs

**African Science Excellence:**
• Study indigenous knowledge systems
• Explore African contributions to science
• Connect global science to local environments
• Participate in science fairs and competitions

Thank you for understanding! What specific science topic would you like to explore? 🧪⚗️`;
    }

    // Programming-related keywords
    if (
      lowerMessage.match(
        /programming|code|coding|python|javascript|java|html|css|algorithm|function|variable/
      )
    ) {
      return `💻 **Programming Learning Assistant**

**⚠️ Service Notice:** We are currently unable to use OpenAI models because we have used up all the tokens from our free tier. We have exceeded our quota for the trial period and would need to purchase an OpenAI subscription for advanced programming tutoring.

**Available Programming Learning Support:**
I can still help you with programming concepts using our educational knowledge base!

**Programming Learning Resources:**
• FreeCodeCamp (free coding bootcamp)
• Codecademy (interactive coding lessons)
• GitHub (code sharing and collaboration)
• Stack Overflow (programming Q&A)

**African Tech Excellence:**
• Join African developer communities
• Participate in local coding bootcamps
• Contribute to open source projects
• Build solutions for African challenges

**Study Tips for Coding:**
• Practice coding daily
• Build real projects
• Join coding communities
• Read other people's code

Thank you for understanding! What programming concept would you like to explore? 👨‍💻🚀`;
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
      requestCount: this.requestCount,
    };
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
    this.requestCount = 0;
    this.lastRequestTime = 0;
  }

  /**
   * Get API usage statistics
   */
  getUsageStats() {
    return {
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime,
      apiKeyValid: OPENAI_API_KEY && OPENAI_API_KEY.startsWith("sk-"),
    };
  }
}

// Create and export singleton instance
const openaiService = new OpenAIService();
export default openaiService;
