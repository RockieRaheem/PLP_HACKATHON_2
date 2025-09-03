import React, { useState, useEffect } from "react";
import flutterwaveService from "../../services/flutterwaveService";

const FlutterwavePayment = ({
  amount,
  email,
  phone,
  name,
  planId,
  onSuccess,
  onClose,
}) => {
  const [paymentStep, setPaymentStep] = useState("select"); // 'select', 'card', 'mobile', 'processing'
  const [isProcessing, setIsProcessing] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    cvv: "",
    expiry_month: "",
    expiry_year: "",
    fullname: name || "",
    pin: "",
  });
  const [mobileDetails, setMobileDetails] = useState({
    phone_number: phone || "",
    type: "mpesa", // mpesa, airtelmoney
  });

  // Check Flutterwave service status on component mount
  useEffect(() => {
    const status = flutterwaveService.getServiceStatus();
    setServiceStatus(status);
    console.log("🔧 Flutterwave Service Status:", status);
  }, []);

  // Professional Card Payment using Flutterwave v4 API
  const initiateCardPayment = async () => {
    setIsProcessing(true);
    setPaymentStep("processing");

    try {
      // Validate inputs
      if (
        !cardDetails.number ||
        !cardDetails.cvv ||
        !cardDetails.expiry_month ||
        !cardDetails.expiry_year
      ) {
        throw new Error("Please fill in all card details");
      }

      const paymentData = {
        amount: amount,
        currency: "KES",
        customer: {
          email: email,
          phone: phone,
          name: cardDetails.fullname || name,
        },
        plan_id: planId,
        subscription_type: "monthly",
        title: "EduAI Premium Subscription",
        description: `Upgrade to EduAI Premium - ${planId} plan`,
      };

      // Validate payment data
      flutterwaveService.validatePaymentData(paymentData);

      console.log("🚀 Processing card payment with Flutterwave...");

      // Use Flutterwave Standard (hosted payment page) for better security
      const initResponse = await flutterwaveService.initializePayment({
        ...paymentData,
        payment_options: "card",
      });

      if (initResponse.success) {
        // Redirect to Flutterwave payment page
        window.open(initResponse.payment_link, "_blank");

        // For demo purposes, simulate success after a delay
        setTimeout(() => {
          const successResponse = {
            status: "successful",
            tx_ref: initResponse.tx_ref,
            flw_ref: `FLW_${Date.now()}`,
            transaction_id: `TXN_${Date.now()}`,
            amount: amount,
            currency: "KES",
            payment_method: "card",
            customer: {
              email,
              phone_number: phone,
              name: cardDetails.fullname,
            },
          };

          console.log("✅ Card Payment Success:", successResponse);
          if (onSuccess) onSuccess(successResponse);
        }, 3000);
      }
    } catch (error) {
      console.error("❌ Card Payment Error:", error);
      alert(`Card payment failed: ${error.message}`);
      setPaymentStep("card");
    } finally {
      setIsProcessing(false);
    }
  };

  // Professional Mobile Money Payment using Flutterwave v4 API
  const initiateMobilePayment = async () => {
    setIsProcessing(true);
    setPaymentStep("processing");

    try {
      // Validate inputs
      if (!mobileDetails.phone_number) {
        throw new Error("Please enter your phone number");
      }

      const paymentData = {
        amount: amount,
        currency: "KES",
        customer: {
          email: email,
          phone: mobileDetails.phone_number,
          name: name,
        },
        plan_id: planId,
        subscription_type: "monthly",
        title: "EduAI Premium Subscription",
        description: `Upgrade to EduAI Premium - ${planId} plan`,
      };

      // Validate payment data
      flutterwaveService.validatePaymentData(paymentData);

      console.log("🚀 Processing mobile money payment with Flutterwave...");

      // Use Flutterwave Standard for mobile money
      const initResponse = await flutterwaveService.initializePayment({
        ...paymentData,
        payment_options: "mobilemoney",
      });

      if (initResponse.success) {
        // Redirect to Flutterwave payment page
        window.open(initResponse.payment_link, "_blank");

        // For demo purposes, simulate success after a delay
        setTimeout(() => {
          const successResponse = {
            status: "successful",
            tx_ref: initResponse.tx_ref,
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

          console.log("✅ Mobile Money Success:", successResponse);
          if (onSuccess) onSuccess(successResponse);
        }, 3000);
      }
    } catch (error) {
      console.error("❌ Mobile Payment Error:", error);
      alert(`Mobile payment failed: ${error.message}`);
      setPaymentStep("mobile");
    } finally {
      setIsProcessing(false);
    }
  };

  // Payment Method Selection with Service Status
  if (paymentStep === "select") {
    return (
      <div className="payment-methods" style={{ marginTop: "16px" }}>
        {/* Service Status Indicator */}
        {serviceStatus && (
          <div
            style={{
              marginBottom: "16px",
              padding: "8px 12px",
              backgroundColor: serviceStatus.operational
                ? "#f0f9ff"
                : "#fef2f2",
              border: `1px solid ${
                serviceStatus.operational ? "#3b82f6" : "#ef4444"
              }`,
              borderRadius: "8px",
              fontSize: "14px",
              color: serviceStatus.operational ? "#1e40af" : "#dc2626",
            }}
          >
            🔧{" "}
            {serviceStatus.operational
              ? "Payment service ready"
              : `Service issue: ${serviceStatus.message}`}
          </div>
        )}

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
          🔧 Demo Mode: Payments will be simulated for testing purposes
        </div>
      </div>
    );
  }

  // Card Payment Form
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

          {/* Cardholder Name */}
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={cardDetails.fullname}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, fullname: e.target.value })
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

          {/* PIN for Kenyan cards */}
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Card PIN (for Kenyan cards)
            </label>
            <input
              type="password"
              placeholder="****"
              maxLength="4"
              value={cardDetails.pin}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, pin: e.target.value })
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
            <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
              Required for local Kenyan debit cards
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

  // Mobile Money Form
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
              value={mobileDetails.type}
              onChange={(e) =>
                setMobileDetails({ ...mobileDetails, type: e.target.value })
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
              <option value="airtelmoney">Airtel Money</option>
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

  // Processing Status Page
  if (paymentStep === "processing") {
    return (
      <div
        className="payment-processing"
        style={{
          marginTop: "16px",
          textAlign: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            marginBottom: "16px",
            animation: "spin 2s linear infinite",
          }}
        >
          🔄
        </div>
        <h4
          style={{
            color: "#333",
            marginBottom: "8px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Processing Payment...
        </h4>
        <p
          style={{
            color: "#666",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          Please wait while we securely process your payment
        </p>
        <div
          style={{
            backgroundColor: "#f0f9ff",
            border: "1px solid #3b82f6",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "13px",
            color: "#1e40af",
          }}
        >
          💡 A new tab will open for secure payment with Flutterwave
        </div>
      </div>
    );
  }

  return null;
};

export default FlutterwavePayment;
