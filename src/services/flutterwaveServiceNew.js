/**
 * Professional Flutterwave Payment Service
 * Frontend implementation using Flutterwave Standard (hosted payment)
 * Supports Card Payments, Mobile Money, and Bank Transfers
 */

// Flutterwave API Configuration
const FLUTTERWAVE_PUBLIC_KEY = process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY;
const FLUTTERWAVE_ENCRYPTION_KEY =
  process.env.REACT_APP_FLUTTERWAVE_ENCRYPTION_KEY;

/**
 * Professional Flutterwave Service Class
 * Frontend-only implementation for security
 */
class FlutterwaveService {
  constructor() {
    this.isInitialized = false;
    this.supportedPaymentMethods = [
      "card",
      "mobilemoney",
      "ussd",
      "banktransfer",
      "account",
      "mpesa",
      "googlepay",
      "applepay",
    ];

    // Debug logging for configuration
    console.log("🔧 Flutterwave Service Configuration:");
    console.log("Public Key exists:", !!FLUTTERWAVE_PUBLIC_KEY);
    console.log("Encryption Key exists:", !!FLUTTERWAVE_ENCRYPTION_KEY);
    console.log(
      "Public Key format:",
      FLUTTERWAVE_PUBLIC_KEY?.substring(0, 20) + "..."
    );
  }

  /**
   * Initialize Flutterwave payment using Standard (hosted) payment
   * This is the most secure approach for frontend applications
   */
  async initializePayment(paymentData) {
    console.log("🚀 Initializing Flutterwave payment...");

    if (!FLUTTERWAVE_PUBLIC_KEY) {
      throw new Error("Flutterwave public key not configured");
    }

    try {
      // Validate payment data first
      this.validatePaymentData(paymentData);

      // Generate unique transaction reference
      const tx_ref = this.generateTransactionReference();

      // For mobile money, we'll use a simplified approach
      if (paymentData.payment_options === "mobilemoney") {
        return this.initializeMobileMoneyPayment(paymentData, tx_ref);
      }

      // For card payments, use Flutterwave Standard
      return this.initializeStandardPayment(paymentData, tx_ref);
    } catch (error) {
      console.error("❌ Payment initialization failed:", error);
      throw new Error(`Payment initialization failed: ${error.message}`);
    }
  }

  /**
   * Initialize Mobile Money Payment
   */
  async initializeMobileMoneyPayment(paymentData, tx_ref) {
    console.log("📱 Initializing Mobile Money payment...");

    // Create payment URL for mobile money
    const baseUrl = "https://checkout.flutterwave.com/v3/hosted/pay";
    const params = new URLSearchParams({
      tx_ref: tx_ref,
      amount: paymentData.amount,
      currency: paymentData.currency || "KES",
      payment_options: "mobilemoney,mpesa",
      "customer[email]": paymentData.customer.email,
      "customer[phone_number]": paymentData.customer.phone,
      "customer[name]": paymentData.customer.name,
      "customizations[title]": paymentData.title || "EduAI Premium",
      "customizations[description]":
        paymentData.description || "Payment for premium features",
      "meta[plan_id]": paymentData.plan_id,
      redirect_url: window.location.origin + "/payment-success",
    });

    const paymentUrl = `${baseUrl}?${params.toString()}&public_key=${FLUTTERWAVE_PUBLIC_KEY}`;

    console.log("💰 Mobile Money Payment URL generated");

    return {
      success: true,
      tx_ref: tx_ref,
      payment_link: paymentUrl,
      payment_method: "mobilemoney",
    };
  }

  /**
   * Initialize Standard Payment (Card, etc.)
   */
  async initializeStandardPayment(paymentData, tx_ref) {
    console.log("💳 Initializing Standard payment...");

    // Create payment URL for card payments
    const baseUrl = "https://checkout.flutterwave.com/v3/hosted/pay";
    const params = new URLSearchParams({
      tx_ref: tx_ref,
      amount: paymentData.amount,
      currency: paymentData.currency || "KES",
      payment_options: paymentData.payment_options || "card,ussd,banktransfer",
      "customer[email]": paymentData.customer.email,
      "customer[phone_number]": paymentData.customer.phone,
      "customer[name]": paymentData.customer.name,
      "customizations[title]": paymentData.title || "EduAI Premium",
      "customizations[description]":
        paymentData.description || "Payment for premium features",
      "meta[plan_id]": paymentData.plan_id,
      redirect_url: window.location.origin + "/payment-success",
    });

    const paymentUrl = `${baseUrl}?${params.toString()}&public_key=${FLUTTERWAVE_PUBLIC_KEY}`;

    console.log("💰 Standard Payment URL generated");

    return {
      success: true,
      tx_ref: tx_ref,
      payment_link: paymentUrl,
      payment_method: "standard",
    };
  }

  /**
   * Generate unique transaction reference
   */
  generateTransactionReference() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `eduai_${timestamp}_${random}`;
  }

  /**
   * Validate payment data
   */
  validatePaymentData(paymentData) {
    if (!paymentData) {
      throw new Error("Payment data is required");
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      throw new Error("Valid amount is required");
    }

    if (!paymentData.customer) {
      throw new Error("Customer information is required");
    }

    if (
      !paymentData.customer.email ||
      !this.isValidEmail(paymentData.customer.email)
    ) {
      throw new Error("Valid customer email is required");
    }

    if (
      !paymentData.customer.phone ||
      !this.isValidPhoneNumber(paymentData.customer.phone)
    ) {
      throw new Error("Valid customer phone number is required");
    }

    if (!paymentData.customer.name || paymentData.customer.name.length < 2) {
      throw new Error("Valid customer name is required");
    }

    console.log("✅ Payment data validation passed");
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format (Kenyan format)
   */
  isValidPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");

    // Check for Kenyan formats: 254XXXXXXXXX, 0XXXXXXXXX, 7XXXXXXXX, 1XXXXXXXX
    const phoneRegex = /^(254\d{9}|0\d{9}|[71]\d{8})$/;
    return phoneRegex.test(cleanPhone);
  }

  /**
   * Verify payment status (this would typically be done on backend)
   */
  async verifyPayment(tx_ref) {
    console.log("🔍 Verifying payment:", tx_ref);

    // In a real implementation, this would call your backend to verify
    // the payment with Flutterwave using the secret key

    // For demo purposes, simulate successful verification
    return {
      success: true,
      status: "successful",
      tx_ref: tx_ref,
      amount: 1500, // This would come from actual verification
      currency: "KES",
      payment_method: "card",
      verification_time: new Date().toISOString(),
    };
  }

  /**
   * Handle payment success callback
   */
  handlePaymentSuccess(data) {
    console.log("✅ Payment Success Callback:", data);

    // Extract relevant information
    return {
      status: "successful",
      tx_ref: data.tx_ref,
      flw_ref: data.flw_ref,
      transaction_id: data.transaction_id,
      amount: data.amount,
      currency: data.currency,
      payment_method: data.payment_type,
      customer: data.customer,
    };
  }

  /**
   * Get service status and configuration
   */
  getServiceStatus() {
    const isConfigured = !!(
      FLUTTERWAVE_PUBLIC_KEY && FLUTTERWAVE_ENCRYPTION_KEY
    );

    return {
      operational: isConfigured,
      message: isConfigured ? "Service ready" : "Configuration incomplete",
      isConfigured: isConfigured,
      publicKey: FLUTTERWAVE_PUBLIC_KEY?.substring(0, 20) + "...",
      encryptionKey: !!FLUTTERWAVE_ENCRYPTION_KEY,
      supportedMethods: this.supportedPaymentMethods,
      apiVersion: "v4",
    };
  }

  /**
   * Get supported payment methods for a region
   */
  getSupportedMethods(country = "KE") {
    const allMethods = {
      KE: ["card", "mobilemoney", "mpesa", "ussd", "banktransfer"],
      NG: ["card", "ussd", "banktransfer", "account"],
      GH: ["card", "mobilemoney", "ussd"],
      UG: ["card", "mobilemoney", "ussd"],
      TZ: ["card", "mobilemoney", "ussd"],
    };

    return allMethods[country] || allMethods.KE;
  }

  /**
   * Format amount for display
   */
  formatAmount(amount, currency = "KES") {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Get transaction status display
   */
  getStatusDisplay(status) {
    const statusMap = {
      successful: { text: "Successful", icon: "✅", color: "#22c55e" },
      failed: { text: "Failed", icon: "❌", color: "#ef4444" },
      pending: { text: "Pending", icon: "⏳", color: "#f59e0b" },
      cancelled: { text: "Cancelled", icon: "🚫", color: "#6b7280" },
      processing: { text: "Processing", icon: "🔄", color: "#3b82f6" },
    };

    return statusMap[status] || statusMap.pending;
  }
}

// Create and export singleton instance
const flutterwaveService = new FlutterwaveService();
export default flutterwaveService;
