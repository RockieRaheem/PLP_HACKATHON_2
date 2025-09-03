/**
 * Enhanced Flutterwave Service with Cloudflare Handling
 * This service tries real Flutterwave first, with graceful fallback
 */

import flutterwaveService from "./flutterwaveService";

/**
 * Enhanced Flutterwave Service Class with Smart Fallback
 */
class EnhancedFlutterwaveService {
  constructor() {
    this.originalService = flutterwaveService;
    this.isCloudflareBlocked = false;
  }

  /**
   * Initialize payment with smart Cloudflare detection
   */
  async initializePayment(paymentData) {
    try {
      console.log("🚀 Attempting real Flutterwave payment...");

      // Try the real Flutterwave service first
      const result = await this.originalService.initializePayment(paymentData);

      // If successful, reset any previous blocking flag
      this.isCloudflareBlocked = false;

      return result;
    } catch (error) {
      console.warn("⚠️ Flutterwave payment failed:", error.message);

      // Check if this looks like a Cloudflare block
      if (this.isLikelyCloudflareBlock(error)) {
        console.log("🛡️ Cloudflare blocking detected");
        this.isCloudflareBlocked = true;

        // Show user-friendly message about alternative payment methods
        this.showCloudflareMessage(paymentData);

        // Return a structured response indicating the issue
        return {
          success: false,
          blocked: true,
          message: "Regional access restrictions detected",
          alternativeOptions: this.getAlternativePaymentOptions(paymentData),
        };
      } else {
        // Re-throw other errors (validation, configuration, etc.)
        throw error;
      }
    }
  }

  /**
   * Detect if error is likely from Cloudflare blocking
   */
  isLikelyCloudflareBlock(error) {
    const cloudflareIndicators = [
      "blocked",
      "cloudflare",
      "security service",
      "ray id",
      "network error",
      "cors",
      "refused to connect",
    ];

    const errorText = error.message.toLowerCase();
    return cloudflareIndicators.some((indicator) =>
      errorText.includes(indicator)
    );
  }

  /**
   * Show user-friendly message about Cloudflare blocking
   */
  showCloudflareMessage(paymentData) {
    // Create modal elements
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      font-family: Arial, sans-serif;
    `;

    const content = document.createElement("div");
    content.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;

    content.innerHTML = `
      <div style="margin-bottom: 20px;">
        <div style="font-size: 48px; margin-bottom: 10px;">🛡️</div>
        <h3 style="color: #333; margin: 0 0 10px 0;">Payment Access Restricted</h3>
        <p style="color: #666; margin: 0; font-size: 14px;">
          Regional security restrictions are preventing direct payment access
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #dc3545; margin: 0 0 15px 0;">🚫 Access Issue Detected</h4>
        <div style="text-align: left; font-size: 14px;">
          <p><strong>Amount:</strong> ${paymentData.currency || "KES"} ${
      paymentData.amount
    }</p>
          <p><strong>Plan:</strong> ${
            paymentData.subscription_type || "Premium"
          }</p>
          <p><strong>Issue:</strong> Cloudflare security blocking payment gateway</p>
        </div>
      </div>

      <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
        <h4 style="margin: 0 0 10px 0; color: #1976d2;">💡 Alternative Payment Options:</h4>
        <ul style="margin: 0; padding-left: 20px; color: #1976d2; font-size: 13px; text-align: left;">
          <li>Contact support for manual payment processing</li>
          <li>Try using a VPN to access payment gateway</li>
          <li>Use mobile data instead of current internet connection</li>
          <li>Payment can be processed through backend server</li>
        </ul>
      </div>

      <div style="display: flex; gap: 10px; justify-content: center;">
        <button id="contactSupport" style="
          background: #2196f3;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">📧 Contact Support</button>
        
        <button id="tryAgain" style="
          background: #4caf50;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">🔄 Try Again</button>
        
        <button id="closeModal" style="
          background: #6c757d;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">Close</button>
      </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Add event listeners
    const supportBtn = content.querySelector("#contactSupport");
    const tryAgainBtn = content.querySelector("#tryAgain");
    const closeBtn = content.querySelector("#closeModal");

    supportBtn.onclick = () => {
      window.open(
        "mailto:support@eduaid.com?subject=Payment Access Issue&body=I am unable to access payment gateway due to regional restrictions. Plan: " +
          paymentData.subscription_type +
          ", Amount: " +
          paymentData.amount,
        "_blank"
      );
    };

    tryAgainBtn.onclick = () => {
      document.body.removeChild(modal);
      // Try again after a short delay
      setTimeout(() => {
        this.initializePayment(paymentData);
      }, 1000);
    };

    closeBtn.onclick = () => {
      document.body.removeChild(modal);
    };

    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };
  }

  /**
   * Get alternative payment options for the user
   */
  getAlternativePaymentOptions(paymentData) {
    return {
      contactSupport: {
        email: "support@eduaid.com",
        subject: `Payment Access Issue - ${paymentData.subscription_type}`,
        body: `I am unable to access payment gateway due to regional restrictions.\n\nPlan: ${
          paymentData.subscription_type
        }\nAmount: ${paymentData.currency || "KES"} ${
          paymentData.amount
        }\nCustomer: ${paymentData.customer?.name || "Unknown"}\nEmail: ${
          paymentData.customer?.email || "Unknown"
        }`,
      },
      manualPayment: {
        instructions: "Contact support for manual payment processing",
        methods: ["Bank Transfer", "Mobile Money", "Manual Card Processing"],
      },
      technicalSolutions: [
        "Try using a VPN service",
        "Switch to mobile data connection",
        "Contact IT support for network configuration",
        "Payment processing through backend server",
      ],
    };
  }

  /**
   * Get service status
   */
  getServiceStatus() {
    const baseStatus = this.originalService.getServiceStatus();

    return {
      ...baseStatus,
      cloudflareBlocked: this.isCloudflareBlocked,
      mode: this.isCloudflareBlocked ? "fallback-mode" : "direct-mode",
      message: this.isCloudflareBlocked
        ? "Service operational with regional restrictions"
        : baseStatus.message,
    };
  }

  /**
   * Validate payment data (delegate to original service)
   */
  validatePaymentData(paymentData) {
    return this.originalService.validatePaymentData(paymentData);
  }

  /**
   * Get supported payment methods (delegate to original service)
   */
  getSupportedMethods(country) {
    return this.originalService.getSupportedMethods(country);
  }

  /**
   * Format amount (delegate to original service)
   */
  formatAmount(amount, currency) {
    return this.originalService.formatAmount(amount, currency);
  }
}

// Create and export singleton instance
const enhancedFlutterwaveService = new EnhancedFlutterwaveService();
export default enhancedFlutterwaveService;
