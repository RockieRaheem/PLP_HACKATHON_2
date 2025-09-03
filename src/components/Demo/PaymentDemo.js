import React, { useState } from "react";
import WorkingFlutterwavePayment from "../Payment/WorkingFlutterwavePayment";

const PaymentDemo = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const testScenarios = [
    {
      id: "premium",
      name: "Premium Plan",
      amount: 1499,
      email: "premium@example.com",
      phone: "+254700000001",
      description: "Monthly premium subscription",
    },
    {
      id: "basic",
      name: "Basic Plan",
      amount: 999,
      email: "basic@example.com",
      phone: "+254700000002",
      description: "Monthly basic subscription",
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      amount: 2999,
      email: "enterprise@example.com",
      phone: "+254700000003",
      description: "Monthly enterprise subscription",
    },
  ];

  const [selectedScenario, setSelectedScenario] = useState(testScenarios[0]);

  const handlePaymentSuccess = (response) => {
    console.log("✅ Payment Demo Success:", response);

    const result = {
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
      transactionId: response.transaction_id,
      amount: response.amount,
      plan: selectedScenario.name,
      method: "Flutterwave React Library",
    };

    setTestResults((prev) => [result, ...prev.slice(0, 9)]);
    setShowPayment(false);

    alert(
      `🎉 PAYMENT SUCCESS!\n\nTransaction ID: ${response.transaction_id}\nPlan: ${selectedScenario.name}\nAmount: KES ${response.amount}\n\nThis proves the integration works without Cloudflare errors!`
    );
  };

  const handlePaymentClose = () => {
    console.log("❌ Payment Demo Cancelled");

    const result = {
      timestamp: new Date().toISOString(),
      status: "CANCELLED",
      plan: selectedScenario.name,
      method: "User Cancelled",
    };

    setTestResults((prev) => [result, ...prev.slice(0, 9)]);
    setShowPayment(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        background: "#f7fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "30px",
          marginBottom: "30px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#1a202c",
            margin: "0 0 10px 0",
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          🏆 WINNING FLUTTERWAVE INTEGRATION
        </h1>
        <p
          style={{
            color: "#718096",
            fontSize: "18px",
            margin: "0 0 20px 0",
          }}
        >
          Professional payment solution with zero Cloudflare blocking issues
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {[
            "✅ Official React Flutterwave Library",
            "🛡️ Multiple Fallback Strategies",
            "🚀 Zero Cloudflare Blocking",
            "💳 All Payment Methods Supported",
            "📱 Mobile Money (M-Pesa, Airtel)",
            "🏆 Production-Ready Solution",
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                background: "#e6fffa",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #81e6d9",
                fontSize: "14px",
                color: "#234e52",
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}
      >
        {/* Test Controls */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#1a202c", margin: "0 0 20px 0" }}>
            🧪 Payment Testing
          </h2>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                color: "#4a5568",
                fontWeight: "bold",
              }}
            >
              Select Test Scenario:
            </label>
            <select
              value={selectedScenario.id}
              onChange={(e) =>
                setSelectedScenario(
                  testScenarios.find((s) => s.id === e.target.value)
                )
              }
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #e2e8f0",
                fontSize: "16px",
                background: "white",
              }}
            >
              {testScenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.name} - KES {scenario.amount}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              background: "#f7fafc",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#2d3748" }}>
              Test Details:
            </h3>
            <p>
              <strong>Plan:</strong> {selectedScenario.name}
            </p>
            <p>
              <strong>Amount:</strong> KES{" "}
              {selectedScenario.amount.toLocaleString()}
            </p>
            <p>
              <strong>Email:</strong> {selectedScenario.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedScenario.phone}
            </p>
            <p>
              <strong>Description:</strong> {selectedScenario.description}
            </p>
          </div>

          <button
            onClick={() => setShowPayment(true)}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            🚀 Start Payment Test
          </button>

          <div
            style={{
              background: "#fffbf0",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #f6e05e",
              marginTop: "20px",
            }}
          >
            <p style={{ margin: "0", color: "#744210", fontSize: "14px" }}>
              💡 <strong>Test safely:</strong> This uses Flutterwave test keys.
              No real money will be charged. Use test card: 4187427415564246
            </p>
          </div>
        </div>

        {/* Test Results */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#1a202c", margin: "0 0 20px 0" }}>
            📊 Test Results
          </h2>

          {testResults.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#a0aec0",
              }}
            >
              <p>No test results yet</p>
              <p style={{ fontSize: "14px" }}>
                Run a payment test to see results here
              </p>
            </div>
          ) : (
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {testResults.map((result, index) => (
                <div
                  key={index}
                  style={{
                    background:
                      result.status === "SUCCESS" ? "#f0fff4" : "#fed7d7",
                    border: `1px solid ${
                      result.status === "SUCCESS" ? "#9ae6b4" : "#f56565"
                    }`,
                    borderRadius: "8px",
                    padding: "15px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        color:
                          result.status === "SUCCESS" ? "#22543d" : "#c53030",
                        fontWeight: "bold",
                      }}
                    >
                      {result.status === "SUCCESS" ? "✅" : "❌"}{" "}
                      {result.status}
                    </span>
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ fontSize: "14px", color: "#4a5568" }}>
                    <p style={{ margin: "2px 0" }}>Plan: {result.plan}</p>
                    {result.amount && (
                      <p style={{ margin: "2px 0" }}>
                        Amount: KES {result.amount}
                      </p>
                    )}
                    {result.transactionId && (
                      <p style={{ margin: "2px 0" }}>
                        ID: {result.transactionId}
                      </p>
                    )}
                    <p style={{ margin: "2px 0" }}>Method: {result.method}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Technical Details */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "30px",
          marginTop: "30px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#1a202c", margin: "0 0 20px 0" }}>
          🔧 Technical Implementation
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <h3 style={{ color: "#667eea", margin: "0 0 10px 0" }}>
              ✅ Primary Method
            </h3>
            <ul style={{ color: "#4a5568", paddingLeft: "20px" }}>
              <li>Official React Flutterwave Library</li>
              <li>Direct integration with useFlutterwave hook</li>
              <li>Zero external redirects</li>
              <li>Bypasses all Cloudflare issues</li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: "#f6ad55", margin: "0 0 10px 0" }}>
              🔄 Fallback Strategy
            </h3>
            <ul style={{ color: "#4a5568", paddingLeft: "20px" }}>
              <li>Inline payment script loading</li>
              <li>Popup window method</li>
              <li>Multiple API endpoints</li>
              <li>Manual payment instructions</li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: "#48bb78", margin: "0 0 10px 0" }}>
              🛡️ Security Features
            </h3>
            <ul style={{ color: "#4a5568", paddingLeft: "20px" }}>
              <li>PCI DSS compliant</li>
              <li>SSL encryption</li>
              <li>Transaction verification</li>
              <li>Secure callback handling</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <WorkingFlutterwavePayment
          amount={selectedScenario.amount}
          email={selectedScenario.email}
          phone={selectedScenario.phone}
          name="EduAI Demo User"
          planId={selectedScenario.id}
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}
    </div>
  );
};

export default PaymentDemo;
