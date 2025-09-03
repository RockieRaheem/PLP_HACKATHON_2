import React, { useState } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

const ProfessionalFlutterwavePayment = ({
  amount = 1499,
  email = "user@example.com",
  phone = "+254700000000",
  name = "EduAid User",
  planId = "premium",
  onSuccess,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("ready"); // 'ready', 'processing', 'success', 'error'

  // Flutterwave configuration - this bypasses Cloudflare issues
  const config = {
    public_key:
      process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY ||
      "FLWPUBK_TEST-4bb74228-6047-4422-96d8-6738d3d9fd2a",
    tx_ref: `eduai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
    },
  };

  // Initialize Flutterwave hook
  const handleFlutterPayment = useFlutterwave(config);

  // Handle successful payment
  const handlePaymentSuccess = (response) => {
    console.log("🎉 Payment Successful:", response);
    setPaymentStep("success");
    setIsProcessing(false);

    // Close the payment modal
    closePaymentModal();

    // Call success callback
    if (onSuccess) {
      onSuccess(response);
    }

    // Show success message
    alert(`Payment successful! Transaction ID: ${response.transaction_id}`);
  };

  // Handle payment closure/cancellation
  const handlePaymentClose = () => {
    console.log("❌ Payment Cancelled");
    setIsProcessing(false);
    setPaymentStep("ready");
    closePaymentModal();

    if (onClose) {
      onClose();
    }
  };

  // Start payment process
  const initiatePayment = () => {
    setIsProcessing(true);
    setPaymentStep("processing");

    handleFlutterPayment({
      callback: handlePaymentSuccess,
      onClose: handlePaymentClose,
    });
  };

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
          padding: "0",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          position: "relative",
          overflow: "hidden",
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
              🚀 EduAI Premium
            </h2>
            <p style={{ margin: "0", opacity: "0.9", fontSize: "14px" }}>
              Secure payment powered by Flutterwave
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

        {/* Payment Details */}
        <div style={{ padding: "30px" }}>
          {/* Plan Information */}
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

          {/* Features */}
          <div style={{ marginBottom: "25px" }}>
            <h4 style={{ margin: "0 0 15px 0", color: "#1a202c" }}>
              ✨ Premium Features:
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {[
                "🤖 Advanced AI Chat",
                "📚 Unlimited Study Plans",
                "⚡ Priority Support",
                "📊 Progress Analytics",
                "🎯 Personalized Learning",
                "🔄 Sync Across Devices",
              ].map((feature, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: "14px",
                    color: "#4a5568",
                    padding: "5px 0",
                  }}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={initiatePayment}
            disabled={isProcessing}
            style={{
              width: "100%",
              padding: "16px",
              background: isProcessing
                ? "#cbd5e0"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
              transition: "all 0.3s ease",
              marginBottom: "20px",
            }}
          >
            {isProcessing ? (
              <>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid #ffffff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                Processing Payment...
              </>
            ) : (
              <>🔒 Pay Securely with Flutterwave</>
            )}
          </button>

          {/* Payment Methods */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <p
              style={{ margin: "0 0 10px 0", color: "#666", fontSize: "14px" }}
            >
              💳 Accept payments via:
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "15px" }}
            >
              {[
                "💳 Card",
                "📱 M-Pesa",
                "📞 Airtel Money",
                "🏦 Bank Transfer",
                "📟 USSD",
              ].map((method, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: "12px",
                    color: "#667eea",
                    background: "#f0f4ff",
                    padding: "4px 8px",
                    borderRadius: "6px",
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
            <span style={{ color: "#38a169", fontSize: "16px" }}>🔒</span>
            <span
              style={{ color: "#2d3748", fontSize: "13px", fontWeight: "500" }}
            >
              256-bit SSL Encryption • PCI DSS Compliant • No Cloudflare Issues
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

export default ProfessionalFlutterwavePayment;
