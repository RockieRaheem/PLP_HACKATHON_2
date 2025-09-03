import React, { useState } from "react";
import FlutterwavePayment from "../Payment/FlutterwavePayment";

const QuickPaymentTest = () => {
  const [showPayment, setShowPayment] = useState(false);

  const testPaymentData = {
    amount: 1000,
    email: "test@example.com",
    phone: "+254700000000",
    name: "Test User",
    planId: "premium",
  };

  const handleSuccess = (response) => {
    console.log("✅ Payment Success:", response);
    alert("Payment completed successfully!");
    setShowPayment(false);
  };

  const handleClose = () => {
    console.log("❌ Payment Cancelled");
    setShowPayment(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ color: "#1e40af" }}>🧪 Payment Component Test</h2>

      <div
        style={{
          background: "#f3f4f6",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Test Data:</h3>
        <p>
          <strong>Plan:</strong> {testPaymentData.planId}
        </p>
        <p>
          <strong>Amount:</strong> KES {testPaymentData.amount.toLocaleString()}
        </p>
        <p>
          <strong>Email:</strong> {testPaymentData.email}
        </p>
        <p>
          <strong>Phone:</strong> {testPaymentData.phone}
        </p>
      </div>

      <button
        onClick={() => setShowPayment(true)}
        style={{
          background: "#3b82f6",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        🚀 Test Payment Flow
      </button>

      {showPayment && (
        <FlutterwavePayment
          {...testPaymentData}
          onSuccess={handleSuccess}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default QuickPaymentTest;
