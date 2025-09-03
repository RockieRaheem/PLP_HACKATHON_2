import React, { useState } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import bulletproofFlutterwaveService from "../../services/bulletproofFlutterwaveService";

const WinningFlutterwavePayment = ({
  amount = 1499,
  email = "user@example.com",
  phone = "+254700000000",
  name = "EduAid User",
  planId = "premium",
  onSuccess,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("auto"); // 'auto', 'library', 'inline', 'popup'
  const [errorMessage, setErrorMessage] = useState("");
  const [showManualInstructions, setShowManualInstructions] = useState(false);

  // Generate unique transaction reference
  const txRef = `eduai_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  // Configuration for React Flutterwave (PRIMARY METHOD - NO CLOUDFLARE ISSUES)
  const config = {
    public_key:
      process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY ||
      "FLWPUBK_TEST-4bb74228-6047-4422-96d8-6738d3d9fd2a",
    tx_ref: txRef,
    amount: amount,
    currency: "KES",
    payment_options: "card,mobilemoney,mpesa,airtel_money,ussd,bank_transfer",
    customer: {
      email: email,
      phone_number: phone,
      name: name,
    },
    customizations: {
      title: "EduAI Premium Subscription",
      description: `Upgrade to EduAI Premium - ${planId} plan`,
      logo: "https://your-logo-url.com/logo.png",
    },
    meta: {
      plan_id: planId,
      user_email: email,
      subscription_type: "premium",
      source: "eduai_app",
    },
  };

  // Initialize the official Flutterwave React hook
  const handleFlutterPayment = useFlutterwave(config);

  // SUCCESS: Payment completed successfully
  const handlePaymentSuccess = (response) => {
    console.log("🎉 PAYMENT SUCCESS:", response);
    setIsProcessing(false);
    closePaymentModal();

    // Store payment info
    localStorage.setItem(
      "eduai_last_payment",
      JSON.stringify({
        ...response,
        planId,
        timestamp: new Date().toISOString(),
      })
    );

    if (onSuccess) {
      onSuccess(response);
    }

    // Show success notification
    alert(
      `🎉 Payment Successful!\nTransaction ID: ${response.transaction_id}\nPlan: ${planId}\nAmount: KES ${amount}`
    );
  };

  // CLOSE: Payment cancelled or closed
  const handlePaymentClose = () => {
    console.log("❌ Payment closed/cancelled");
    setIsProcessing(false);
    closePaymentModal();
    setErrorMessage("");

    if (onClose) {
      onClose();
    }
  };

  // PRIMARY METHOD: Use React Flutterwave (bypasses Cloudflare)
  const startPrimaryPayment = () => {
    console.log("🚀 Starting PRIMARY payment method (React Flutterwave)...");
    setIsProcessing(true);
    setErrorMessage("");
    setPaymentMethod("library");

    try {
      handleFlutterPayment({
        callback: handlePaymentSuccess,
        onClose: handlePaymentClose,
      });
    } catch (error) {
      console.error("Primary payment failed:", error);
      setErrorMessage("Primary payment method failed");
      startFallbackPayment();
    }
  };

  // FALLBACK METHOD: Use bulletproof service
  const startFallbackPayment = async () => {
    console.log("🔄 Starting FALLBACK payment method...");
    setPaymentMethod("inline");

    try {
      const result = await bulletproofFlutterwaveService.processPayment({
        amount,
        email,
        phone,
        name,
        planId,
        tx_ref: txRef,
      });

      handlePaymentSuccess(result);
    } catch (error) {
      console.error("Fallback payment failed:", error);
      setErrorMessage("All automatic payment methods failed");
      setShowManualInstructions(true);
    }
  };

  // MANUAL PAYMENT: Last resort instructions
  const ManualPaymentInstructions = () => (
    <div
      style={{
        background: "#fff3cd",
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid #ffeaa7",
        margin: "20px 0",
      }}
    >
      <h3 style={{ color: "#856404", margin: "0 0 15px 0" }}>
        📱 Manual Payment Instructions
      </h3>
      <div style={{ color: "#856404", fontSize: "14px" }}>
        <p>
          <strong>M-Pesa Payment:</strong>
        </p>
        <ol>
          <li>Go to M-Pesa menu on your phone</li>
          <li>Select "Lipa na M-Pesa"</li>
          <li>Select "Pay Bill"</li>
          <li>
            Enter Business Number: <strong>174379</strong>
          </li>
          <li>
            Account Number: <strong>{email}</strong>
          </li>
          <li>
            Amount: <strong>KES {amount}</strong>
          </li>
          <li>Enter your M-Pesa PIN</li>
        </ol>
        <p style={{ marginTop: "15px" }}>
          <strong>Transaction Reference:</strong> {txRef}
        </p>
        <p style={{ fontSize: "12px", color: "#666" }}>
          After payment, you'll receive an SMS confirmation. Your premium
          features will be activated within 5 minutes.
        </p>
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 5px 0",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              🏆 EduAI Premium
            </h2>
            <p style={{ margin: "0", opacity: "0.9", fontSize: "14px" }}>
              Professional payment • No Cloudflare blocking
            </p>
          </div>
          <button
            onClick={handlePaymentClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "30px" }}>
          {/* Payment Status */}
          {paymentMethod === "auto" && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div
                style={{
                  background: "#e6fffa",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #81e6d9",
                  marginBottom: "20px",
                }}
              >
                <p
                  style={{ margin: "0", color: "#234e52", fontWeight: "bold" }}
                >
                  ✅ Ready for Secure Payment
                </p>
                <p
                  style={{
                    margin: "5px 0 0 0",
                    color: "#234e52",
                    fontSize: "14px",
                  }}
                >
                  Using professional Flutterwave integration
                </p>
              </div>
            </div>
          )}

          {/* Payment Details */}
          <div
            style={{
              background: "#f8f9ff",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "25px",
              border: "2px dashed #667eea",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: "0 0 5px 0",
                    color: "#667eea",
                    fontSize: "18px",
                  }}
                >
                  {planId.charAt(0).toUpperCase() + planId.slice(1)} Plan
                </h3>
                <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                  {email}
                </p>
                <p
                  style={{
                    margin: "5px 0 0 0",
                    color: "#666",
                    fontSize: "12px",
                  }}
                >
                  Ref: {txRef}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#1a202c",
                  }}
                >
                  KES {amount.toLocaleString()}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Monthly subscription
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              style={{
                background: "#fed7d7",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #f56565",
                marginBottom: "20px",
              }}
            >
              <p style={{ margin: "0", color: "#c53030", fontSize: "14px" }}>
                ⚠️ {errorMessage}
              </p>
            </div>
          )}

          {/* Manual Instructions */}
          {showManualInstructions && <ManualPaymentInstructions />}

          {/* Payment Buttons */}
          <div style={{ marginBottom: "20px" }}>
            {paymentMethod === "auto" && (
              <button
                onClick={startPrimaryPayment}
                disabled={isProcessing}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: isProcessing
                    ? "#cbd5e0"
                    : "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                🚀 Pay Now (Professional Method)
              </button>
            )}

            {paymentMethod === "auto" && (
              <button
                onClick={startFallbackPayment}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "white",
                  color: "#667eea",
                  border: "2px solid #667eea",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginBottom: "10px",
                }}
              >
                🔄 Try Alternative Method
              </button>
            )}

            {paymentMethod !== "auto" && !showManualInstructions && (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "4px solid #e5e7eb",
                    borderTop: "4px solid #667eea",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 15px",
                  }}
                ></div>
                <p style={{ color: "#666", fontSize: "14px" }}>
                  Processing payment... Please wait
                </p>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <p
              style={{ margin: "0 0 10px 0", color: "#666", fontSize: "14px" }}
            >
              💳 Supported payment methods:
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {[
                "💳 Visa/Mastercard",
                "📱 M-Pesa",
                "📞 Airtel Money",
                "🏦 Bank Transfer",
                "📟 USSD",
              ].map((method, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: "11px",
                    color: "#667eea",
                    background: "#f0f4ff",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    margin: "2px",
                  }}
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          {/* Security Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "15px",
              background: "#f0fff4",
              borderRadius: "8px",
              border: "1px solid #9ae6b4",
            }}
          >
            <span style={{ color: "#38a169", fontSize: "16px" }}>🛡️</span>
            <span
              style={{ color: "#2d3748", fontSize: "13px", fontWeight: "500" }}
            >
              PCI DSS Compliant • SSL Encrypted • Cloudflare-Free Payment
            </span>
          </div>
        </div>

        {/* CSS Animation */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default WinningFlutterwavePayment;
