import React, { useState } from "react";

const FlutterwavePayment = ({
  amount,
  email,
  phone,
  name,
  planId,
  onSuccess,
  onClose,
}) => {
  const [paymentStep, setPaymentStep] = useState("select"); // 'select', 'card', 'mobile'
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    cvv: "",
    expiry_month: "",
    expiry_year: "",
    fullname: name || "",
  });
  const [mobileDetails, setMobileDetails] = useState({
    phone_number: phone || "",
    network: "mpesa", // Default network
  });

  const generateReference = () =>
    `eduaid_${planId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Professional Card Payment using Flutterwave Standard
  const initiateCardPayment = async () => {
    setIsProcessing(true);

    try {
      // For demo purposes, simulate a successful payment after 2 seconds
      console.log("🔧 Demo Mode: Simulating card payment...");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const successResponse = {
        status: "successful",
        tx_ref: generateReference(),
        flw_ref: `FLW_${Date.now()}`,
        transaction_id: `TXN_${Date.now()}`,
        amount: amount,
        currency: "KES",
        payment_method: "card",
        customer: { email, phone_number: phone, name },
      };

      console.log("✅ Demo Card Payment Success:", successResponse);
      alert("💳 Demo Card payment successful! Welcome to EduAid Premium!");
      if (onSuccess) onSuccess(successResponse);
    } catch (error) {
      console.error("Card Payment Error:", error);
      alert(`Card payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Professional Mobile Money Payment
  const initiateMobilePayment = async () => {
    setIsProcessing(true);

    try {
      // For demo purposes, simulate a successful payment after 2 seconds
      console.log("🔧 Demo Mode: Simulating mobile money payment...");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const successResponse = {
        status: "successful",
        tx_ref: generateReference(),
        flw_ref: `FLW_${Date.now()}`,
        transaction_id: `TXN_${Date.now()}`,
        amount: amount,
        currency: "KES",
        payment_method: "mobile_money",
        customer: {
          email,
          phone_number: mobileDetails.phone_number,
          name,
        },
      };

      console.log("✅ Demo Mobile Money Success:", successResponse);
      alert(
        "📱 Demo Mobile money payment successful! Welcome to EduAid Premium!"
      );
      if (onSuccess) onSuccess(successResponse);
    } catch (error) {
      console.error("Mobile Payment Error:", error);
      alert(`Mobile payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Payment Method Selection (Spotify-like)
  if (paymentStep === "select") {
    return (
      <div className="payment-methods" style={{ marginTop: "16px" }}>
        <h4
          style={{
            margin: "0 0 16px 0",
            color: "#333",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Choose how to pay KES {amount}
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Card Payment Option */}
          <div
            onClick={() => setPaymentStep("card")}
            style={{
              padding: "16px",
              border: "2px solid #e0e0e0",
              borderRadius: "12px",
              cursor: "pointer",
              backgroundColor: "#fff",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#1DB954";
              e.currentTarget.style.backgroundColor = "#f8fff9";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#e0e0e0";
              e.currentTarget.style.backgroundColor = "#fff";
            }}
          >
            <div style={{ fontSize: "24px" }}>💳</div>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                Credit or Debit Card
              </div>
              <div style={{ color: "#666", fontSize: "14px" }}>
                Visa, Mastercard, Verve
              </div>
            </div>
          </div>

          {/* Mobile Money Option */}
          <div
            onClick={() => setPaymentStep("mobile")}
            style={{
              padding: "16px",
              border: "2px solid #e0e0e0",
              borderRadius: "12px",
              cursor: "pointer",
              backgroundColor: "#fff",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#1DB954";
              e.currentTarget.style.backgroundColor = "#f8fff9";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#e0e0e0";
              e.currentTarget.style.backgroundColor = "#fff";
            }}
          >
            <div style={{ fontSize: "24px" }}>📱</div>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                Mobile Money
              </div>
              <div style={{ color: "#666", fontSize: "14px" }}>
                M-Pesa, Airtel Money, MTN
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#fff3cd",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#856404",
            textAlign: "center",
            border: "1px solid #ffeaa7",
          }}
        >
          � Demo Mode: Payments will be simulated for testing purposes
        </div>
      </div>
    );
  }

  // Card Payment Form (Spotify-like)
  if (paymentStep === "card") {
    return (
      <div className="card-payment" style={{ marginTop: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => setPaymentStep("select")}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              marginRight: "12px",
            }}
          >
            ←
          </button>
          <h4
            style={{
              margin: 0,
              color: "#333",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            💳 Pay with Card
          </h4>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.number}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, number: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Expiry Month
              </label>
              <input
                type="text"
                placeholder="12"
                value={cardDetails.expiry_month}
                onChange={(e) =>
                  setCardDetails({
                    ...cardDetails,
                    expiry_month: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Expiry Year
              </label>
              <input
                type="text"
                placeholder="25"
                value={cardDetails.expiry_year}
                onChange={(e) =>
                  setCardDetails({
                    ...cardDetails,
                    expiry_year: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontWeight: "bold",
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
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={initiateCardPayment}
          disabled={isProcessing}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: "#1DB954",
            color: "white",
            border: "none",
            borderRadius: "50px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: isProcessing ? "not-allowed" : "pointer",
            opacity: isProcessing ? 0.6 : 1,
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            !isProcessing && (e.target.style.backgroundColor = "#1ed760")
          }
          onMouseOut={(e) =>
            !isProcessing && (e.target.style.backgroundColor = "#1DB954")
          }
        >
          {isProcessing ? "🔄 Processing..." : `Pay KES ${amount}`}
        </button>
      </div>
    );
  }

  // Mobile Money Form (Spotify-like)
  if (paymentStep === "mobile") {
    return (
      <div className="mobile-payment" style={{ marginTop: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => setPaymentStep("select")}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              marginRight: "12px",
            }}
          >
            ←
          </button>
          <h4
            style={{
              margin: 0,
              color: "#333",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            📱 Pay with Mobile Money
          </h4>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="254700000000"
              value={mobileDetails.phone_number}
              onChange={(e) =>
                setMobileDetails({
                  ...mobileDetails,
                  phone_number: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Network Provider
            </label>
            <select
              value={mobileDetails.network}
              onChange={(e) =>
                setMobileDetails({ ...mobileDetails, network: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            >
              <option value="mpesa">M-Pesa (Safaricom)</option>
              <option value="airtel">Airtel Money</option>
              <option value="mtn">MTN Mobile Money</option>
            </select>
          </div>
        </div>

        <button
          onClick={initiateMobilePayment}
          disabled={isProcessing}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: "#1DB954",
            color: "white",
            border: "none",
            borderRadius: "50px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: isProcessing ? "not-allowed" : "pointer",
            opacity: isProcessing ? 0.6 : 1,
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            !isProcessing && (e.target.style.backgroundColor = "#1ed760")
          }
          onMouseOut={(e) =>
            !isProcessing && (e.target.style.backgroundColor = "#1DB954")
          }
        >
          {isProcessing ? "🔄 Processing..." : `Pay KES ${amount}`}
        </button>
      </div>
    );
  }

  return null;
};

export default FlutterwavePayment;
