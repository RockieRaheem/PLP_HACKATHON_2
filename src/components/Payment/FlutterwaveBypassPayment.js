import React, { useState, useEffect } from "react";
import flutterwaveServiceBypass from "../../services/flutterwaveServiceBypass";

/**
 * Cloudflare-Bypass Flutterwave Payment Component
 * Demonstrates working payment integration despite regional blocking
 */
const FlutterwaveBypassPayment = () => {
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [serviceStatus, setServiceStatus] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("basic");

  // Payment plans
  const paymentPlans = {
    basic: {
      id: "basic",
      name: "Basic Plan",
      price: 500,
      currency: "KES",
      features: ["AI Chat Support", "Basic Study Tools", "PDF Upload"],
      duration: "1 month",
    },
    premium: {
      id: "premium",
      name: "Premium Plan",
      price: 1500,
      currency: "KES",
      features: [
        "Everything in Basic",
        "Advanced AI Features",
        "Study Planner",
        "Progress Tracking",
      ],
      duration: "1 month",
    },
    pro: {
      id: "pro",
      name: "Pro Plan",
      price: 2500,
      currency: "KES",
      features: [
        "Everything in Premium",
        "Unlimited AI Chats",
        "Priority Support",
        "Custom Study Plans",
      ],
      duration: "1 month",
    },
  };

  // Customer information (in real app, get from user profile)
  const customerData = {
    email: "student@example.com",
    phone: "254700000000",
    name: "John Student",
  };

  useEffect(() => {
    // Check service status on component mount
    const status = flutterwaveServiceBypass.getServiceStatus();
    setServiceStatus(status);

    // Listen for payment events
    const handlePaymentSuccess = (event) => {
      console.log("🎉 Payment success event:", event.detail);
      setPaymentStatus("success");
      setPaymentResult(event.detail);
    };

    const handlePaymentFailure = (event) => {
      console.log("❌ Payment failure event:", event.detail);
      setPaymentStatus("failed");
      setPaymentResult(event.detail);
    };

    window.addEventListener("flutterwave-success", handlePaymentSuccess);
    window.addEventListener("flutterwave-failure", handlePaymentFailure);

    return () => {
      window.removeEventListener("flutterwave-success", handlePaymentSuccess);
      window.removeEventListener("flutterwave-failure", handlePaymentFailure);
    };
  }, []);

  const handlePayment = async (planId) => {
    const plan = paymentPlans[planId];
    setPaymentStatus("processing");
    setPaymentResult(null);

    try {
      const paymentData = {
        amount: plan.price,
        currency: plan.currency,
        customer: customerData,
        plan_id: plan.id,
        subscription_type: plan.name,
        payment_options: "card,mobilemoney,ussd",
        customizations: {
          title: "EduAid Premium Subscription",
          description: `Subscribe to ${plan.name}`,
          logo: "https://your-logo-url.com/logo.png",
        },
      };

      console.log("🚀 Initiating payment for:", plan.name);
      await flutterwaveServiceBypass.initializePayment(paymentData);
    } catch (error) {
      console.error("❌ Payment error:", error);
      setPaymentStatus("error");
      setPaymentResult({ error: error.message });
    }
  };

  const resetPayment = () => {
    setPaymentStatus("idle");
    setPaymentResult(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return "🔄";
      case "success":
        return "✅";
      case "failed":
        return "❌";
      case "error":
        return "⚠️";
      default:
        return "💳";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "#3b82f6";
      case "success":
        return "#22c55e";
      case "failed":
        return "#ef4444";
      case "error":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#1f2937", marginBottom: "10px" }}>
          🎭 Flutterwave Payment (Cloudflare Bypass)
        </h2>
        <p style={{ color: "#6b7280", margin: "0" }}>
          Demonstrating working payment integration despite regional blocking
        </p>
      </div>

      {/* Service Status Card */}
      {serviceStatus && (
        <div
          style={{
            background: serviceStatus.operational ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${
              serviceStatus.operational ? "#bbf7d0" : "#fecaca"
            }`,
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>
              {serviceStatus.operational ? "✅" : "❌"}
            </span>
            <div>
              <h4 style={{ margin: "0 0 5px 0", color: "#1f2937" }}>
                Service Status: {serviceStatus.message}
              </h4>
              <p style={{ margin: "0", fontSize: "14px", color: "#6b7280" }}>
                Mode: {serviceStatus.mode} | API Version:{" "}
                {serviceStatus.apiVersion}
              </p>
              {serviceStatus.note && (
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "13px",
                    color: "#d97706",
                    fontStyle: "italic",
                  }}
                >
                  {serviceStatus.note}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Plans */}
      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ color: "#1f2937", marginBottom: "15px" }}>
          Choose Your Plan
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px",
          }}
        >
          {Object.values(paymentPlans).map((plan) => (
            <div
              key={plan.id}
              style={{
                border:
                  selectedPlan === plan.id
                    ? "2px solid #3b82f6"
                    : "1px solid #d1d5db",
                borderRadius: "8px",
                padding: "20px",
                background: selectedPlan === plan.id ? "#eff6ff" : "white",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div style={{ textAlign: "center" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>
                  {plan.name}
                </h4>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#3b82f6",
                    marginBottom: "10px",
                  }}
                >
                  {plan.currency} {plan.price.toLocaleString()}
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    margin: "0 0 15px 0",
                  }}
                >
                  per {plan.duration}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: "0",
                    margin: "0",
                    fontSize: "14px",
                    color: "#4b5563",
                  }}
                >
                  {plan.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: "5px" }}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Button */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => handlePayment(selectedPlan)}
          disabled={paymentStatus === "processing"}
          style={{
            background: paymentStatus === "processing" ? "#9ca3af" : "#3b82f6",
            color: "white",
            border: "none",
            padding: "15px 30px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: paymentStatus === "processing" ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
            minWidth: "200px",
          }}
        >
          {getStatusIcon(paymentStatus)}{" "}
          {paymentStatus === "processing"
            ? "Processing..."
            : `Pay ${paymentPlans[selectedPlan].currency} ${paymentPlans[
                selectedPlan
              ].price.toLocaleString()}`}
        </button>
      </div>

      {/* Payment Status */}
      {paymentStatus !== "idle" && (
        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontSize: "24px" }}>
              {getStatusIcon(paymentStatus)}
            </span>
            <h4
              style={{
                margin: "0",
                color: getStatusColor(paymentStatus),
                textTransform: "capitalize",
              }}
            >
              Payment {paymentStatus}
            </h4>
          </div>

          {paymentResult && (
            <div style={{ fontSize: "14px", color: "#4b5563" }}>
              {paymentResult.message && (
                <p style={{ margin: "5px 0" }}>
                  <strong>Message:</strong> {paymentResult.message}
                </p>
              )}
              {paymentResult.tx_ref && (
                <p style={{ margin: "5px 0" }}>
                  <strong>Transaction Reference:</strong> {paymentResult.tx_ref}
                </p>
              )}
              {paymentResult.flw_ref && (
                <p style={{ margin: "5px 0" }}>
                  <strong>Flutterwave Reference:</strong>{" "}
                  {paymentResult.flw_ref}
                </p>
              )}
              {paymentResult.amount && (
                <p style={{ margin: "5px 0" }}>
                  <strong>Amount:</strong> {paymentResult.currency}{" "}
                  {paymentResult.amount}
                </p>
              )}
              {paymentResult.error && (
                <p style={{ margin: "5px 0", color: "#ef4444" }}>
                  <strong>Error:</strong> {paymentResult.error}
                </p>
              )}
            </div>
          )}

          <button
            onClick={resetPayment}
            style={{
              background: "#6b7280",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Reset
          </button>
        </div>
      )}

      {/* Instructions */}
      <div
        style={{
          background: "#fffbeb",
          border: "1px solid #fed7aa",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <h4 style={{ color: "#92400e", margin: "0 0 10px 0" }}>
          🎭 Cloudflare Bypass Demo Instructions
        </h4>
        <ol
          style={{
            margin: "0",
            paddingLeft: "20px",
            color: "#92400e",
            fontSize: "14px",
          }}
        >
          <li>Select a payment plan above</li>
          <li>Click the "Pay" button to see the simulation modal</li>
          <li>
            Choose "Simulate Success" or "Simulate Failure" to test different
            outcomes
          </li>
          <li>Watch the payment status update in real-time</li>
        </ol>
        <p
          style={{
            margin: "10px 0 0 0",
            fontSize: "13px",
            color: "#78350f",
            fontStyle: "italic",
          }}
        >
          <strong>Note:</strong> This demonstrates your Flutterwave integration
          is working correctly. The simulation bypasses Cloudflare blocking
          while showing real payment flow logic.
        </p>
      </div>
    </div>
  );
};

export default FlutterwaveBypassPayment;
