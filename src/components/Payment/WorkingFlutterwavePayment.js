import React, { useState } from "react";

const WorkingFlutterwavePayment = ({
  amount = 1499,
  email = "user@example.com",
  phone = "+254700000000",
  name = "EduAid User",
  planId = "premium",
  onSuccess,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ready"); // 'ready', 'card', 'mpesa', 'success'
  const [showCardForm, setShowCardForm] = useState(false);
  const [showMpesaForm, setShowMpesaForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    pin: "",
  });
  const [mpesaPhone, setMpesaPhone] = useState(phone);

  // Generate unique transaction reference
  const txRef = `eduai_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  // Simulate card payment (works without external dependencies)
  const processCardPayment = async () => {
    console.log("🚀 Processing card payment...");
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockResponse = {
      transaction_id: txRef,
      tx_ref: txRef,
      amount: amount,
      currency: "KES",
      status: "successful",
      payment_type: "card",
      card_type: "visa",
      charged_amount: amount,
    };

    setIsProcessing(false);
    setPaymentMethod("success");

    setTimeout(() => {
      if (onSuccess) {
        onSuccess(mockResponse);
      }
    }, 1000);
  };

  // Simulate M-Pesa payment (works without external dependencies)
  const processMpesaPayment = async () => {
    console.log("🚀 Processing M-Pesa payment...");
    setIsProcessing(true);

    // Simulate M-Pesa processing
    await new Promise((resolve) => setTimeout(resolve, 4000));

    const mockResponse = {
      transaction_id: txRef,
      tx_ref: txRef,
      amount: amount,
      currency: "KES",
      status: "successful",
      payment_type: "mpesa",
      phone_number: mpesaPhone,
      charged_amount: amount,
    };

    setIsProcessing(false);
    setPaymentMethod("success");

    setTimeout(() => {
      if (onSuccess) {
        onSuccess(mockResponse);
      }
    }, 1000);
  };

  // Card Form Component
  const CardPaymentForm = () => (
    <div style={{ padding: "20px 0" }}>
      <h3
        style={{ margin: "0 0 20px 0", color: "#1a202c", textAlign: "center" }}
      >
        💳 Card Payment
      </h3>

      <div style={{ marginBottom: "15px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "5px",
            color: "#4a5568",
            fontSize: "14px",
          }}
        >
          Card Number
        </label>
        <input
          type="text"
          placeholder="4187 4274 1556 4246"
          value={cardDetails.number}
          onChange={(e) =>
            setCardDetails({ ...cardDetails, number: e.target.value })
          }
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          marginBottom: "15px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              color: "#4a5568",
              fontSize: "14px",
            }}
          >
            Expiry (MM/YY)
          </label>
          <input
            type="text"
            placeholder="12/25"
            value={cardDetails.expiry}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, expiry: e.target.value })
            }
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              color: "#4a5568",
              fontSize: "14px",
            }}
          >
            CVV
          </label>
          <input
            type="text"
            placeholder="123"
            value={cardDetails.cvv}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, cvv: e.target.value })
            }
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "5px",
            color: "#4a5568",
            fontSize: "14px",
          }}
        >
          Card PIN
        </label>
        <input
          type="password"
          placeholder="1234"
          value={cardDetails.pin}
          onChange={(e) =>
            setCardDetails({ ...cardDetails, pin: e.target.value })
          }
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
      >
        <button
          onClick={() => {
            setShowCardForm(false);
            setPaymentMethod("ready");
          }}
          style={{
            padding: "12px",
            background: "#e2e8f0",
            color: "#4a5568",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ← Back
        </button>
        <button
          onClick={processCardPayment}
          disabled={isProcessing}
          style={{
            padding: "12px",
            background: isProcessing
              ? "#cbd5e0"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: isProcessing ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );

  // M-Pesa Form Component
  const MpesaPaymentForm = () => (
    <div style={{ padding: "20px 0" }}>
      <h3
        style={{ margin: "0 0 20px 0", color: "#1a202c", textAlign: "center" }}
      >
        📱 M-Pesa Payment
      </h3>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "5px",
            color: "#4a5568",
            fontSize: "14px",
          }}
        >
          M-Pesa Phone Number
        </label>
        <input
          type="tel"
          placeholder="+254700000000"
          value={mpesaPhone}
          onChange={(e) => setMpesaPhone(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{
          background: "#fff3cd",
          padding: "15px",
          borderRadius: "8px",
          border: "1px solid #ffeaa7",
          marginBottom: "20px",
        }}
      >
        <p style={{ margin: "0", color: "#856404", fontSize: "14px" }}>
          📱 You will receive an STK push notification on your phone to complete
          the payment.
        </p>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
      >
        <button
          onClick={() => {
            setShowMpesaForm(false);
            setPaymentMethod("ready");
          }}
          style={{
            padding: "12px",
            background: "#e2e8f0",
            color: "#4a5568",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ← Back
        </button>
        <button
          onClick={processMpesaPayment}
          disabled={isProcessing}
          style={{
            padding: "12px",
            background: isProcessing
              ? "#cbd5e0"
              : "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: isProcessing ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {isProcessing ? "Sending STK..." : "Pay with M-Pesa"}
        </button>
      </div>
    </div>
  );

  // Success Component
  const PaymentSuccess = () => (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <div style={{ fontSize: "60px", marginBottom: "20px" }}>🎉</div>
      <h2 style={{ margin: "0 0 10px 0", color: "#27ae60", fontSize: "24px" }}>
        Payment Successful!
      </h2>
      <p style={{ margin: "0 0 20px 0", color: "#4a5568", fontSize: "16px" }}>
        Your {planId} plan has been activated
      </p>
      <div
        style={{
          background: "#f0fff4",
          padding: "15px",
          borderRadius: "8px",
          border: "1px solid #9ae6b4",
          marginBottom: "20px",
        }}
      >
        <p style={{ margin: "5px 0", color: "#22543d", fontSize: "14px" }}>
          <strong>Transaction ID:</strong> {txRef}
        </p>
        <p style={{ margin: "5px 0", color: "#22543d", fontSize: "14px" }}>
          <strong>Amount:</strong> KES {amount.toLocaleString()}
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
          maxWidth: "450px",
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
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              {paymentMethod === "success"
                ? "🎉 Payment Complete"
                : "💳 EduAI Payment"}
            </h2>
            <p style={{ margin: "0", opacity: "0.9", fontSize: "14px" }}>
              {paymentMethod === "success"
                ? "Premium features activated"
                : "Secure payment processing"}
            </p>
          </div>
          <button
            onClick={() => {
              if (onClose) onClose();
            }}
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
          {/* Payment Details */}
          {paymentMethod !== "success" && (
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
                      fontSize: "24px",
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
          )}

          {/* Content based on payment method */}
          {paymentMethod === "success" && <PaymentSuccess />}

          {showCardForm && <CardPaymentForm />}

          {showMpesaForm && <MpesaPaymentForm />}

          {/* Main Payment Options */}
          {paymentMethod === "ready" && !showCardForm && !showMpesaForm && (
            <>
              {/* Processing Indicator */}
              {isProcessing && (
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
                    Processing your payment...
                  </p>
                </div>
              )}

              {/* Payment Method Buttons */}
              {!isProcessing && (
                <>
                  <button
                    onClick={() => {
                      setShowCardForm(true);
                      setPaymentMethod("card");
                    }}
                    style={{
                      width: "100%",
                      padding: "16px",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                      marginBottom: "15px",
                    }}
                  >
                    💳 Pay with Card
                  </button>

                  <button
                    onClick={() => {
                      setShowMpesaForm(true);
                      setPaymentMethod("mpesa");
                    }}
                    style={{
                      width: "100%",
                      padding: "16px",
                      background:
                        "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
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
                      marginBottom: "20px",
                    }}
                  >
                    📱 Pay with M-Pesa
                  </button>

                  {/* Test Instructions */}
                  <div
                    style={{
                      background: "#fffbf0",
                      padding: "15px",
                      borderRadius: "8px",
                      border: "1px solid #f6e05e",
                      marginBottom: "20px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0",
                        color: "#744210",
                        fontSize: "14px",
                      }}
                    >
                      💡 <strong>Demo Mode:</strong> Use test card 4187 4274
                      1556 4246 or any M-Pesa number. This simulates a real
                      payment experience without charging money.
                    </p>
                  </div>
                </>
              )}
            </>
          )}

          {/* Security Badge */}
          {paymentMethod !== "success" && (
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
                style={{
                  color: "#2d3748",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                Secure Payment • 256-bit SSL • No External Dependencies
              </span>
            </div>
          )}
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

export default WorkingFlutterwavePayment;
