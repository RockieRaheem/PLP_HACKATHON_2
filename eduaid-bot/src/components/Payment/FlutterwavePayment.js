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
  const [showMethods, setShowMethods] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Flutterwave configuration
  const FLUTTERWAVE_SECRET_KEY =
    "FLWSECK_TEST-Q3d6O6dYUJX1vseBPRPWgfHrzDAl9ACs-X";
  const FLUTTERWAVE_BASE_URL = "https://api.flutterwave.com/v3";

  const generateReference = () => `eduaid_${planId}_${Date.now()}`;

  const initiateBankTransfer = async () => {
    setIsProcessing(true);
    const reference = generateReference();

    try {
      const transferData = {
        action: "instant",
        reference: reference,
        narration: `EduAid ${planId} subscription payment`,
        payment_instruction: {
          source_currency: "KES",
          amount: {
            value: amount,
            currency: "KES",
          },
        },
        type: "bank",
        recipient: {
          email: email,
          phone_number: phone,
          name: name,
          bank: {
            country: "KE",
          },
        },
        meta: {
          plan_id: planId,
          user_email: email,
        },
      };

      console.log("🏦 Initiating Bank Transfer:", transferData);

      const response = await fetch(`${FLUTTERWAVE_BASE_URL}/transfers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      });

      const result = await response.json();
      console.log("Bank Transfer Response:", result);

      if (result.status === "success") {
        const successResponse = {
          status: "successful",
          tx_ref: reference,
          flw_ref: result.data.id,
          transaction_id: result.data.id,
          amount: amount,
          currency: "KES",
          payment_method: "bank_transfer",
          customer: { email, phone_number: phone, name },
          transfer_details: result.data,
        };

        alert(
          "🏦 Bank transfer initiated successfully! Complete the transfer using your banking app."
        );
        if (onSuccess) onSuccess(successResponse);
      } else {
        throw new Error(result.message || "Bank transfer failed");
      }
    } catch (error) {
      console.error("Bank Transfer Error:", error);
      alert(`Bank transfer failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const initiateMobileMoneyTransfer = async () => {
    setIsProcessing(true);
    const reference = generateReference();

    try {
      const transferData = {
        action: "instant",
        reference: reference,
        narration: `EduAid ${planId} subscription - Mobile Money`,
        payment_instruction: {
          source_currency: "KES",
          amount: {
            value: amount,
            currency: "KES",
          },
        },
        type: "mobile_money",
        recipient: {
          email: email,
          phone_number: phone,
          name: name,
          mobile_money: {
            provider: "mpesa",
            country: "KE",
          },
        },
        meta: {
          plan_id: planId,
          user_email: email,
          payment_type: "subscription",
        },
      };

      console.log("📱 Initiating Mobile Money Transfer:", transferData);

      const response = await fetch(`${FLUTTERWAVE_BASE_URL}/transfers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      });

      const result = await response.json();
      console.log("Mobile Money Response:", result);

      if (result.status === "success") {
        const successResponse = {
          status: "successful",
          tx_ref: reference,
          flw_ref: result.data.id,
          transaction_id: result.data.id,
          amount: amount,
          currency: "KES",
          payment_method: "mobile_money",
          customer: { email, phone_number: phone, name },
          transfer_details: result.data,
        };

        alert(
          "📱 M-Pesa payment initiated! Check your phone for the payment prompt."
        );
        if (onSuccess) onSuccess(successResponse);
      } else {
        throw new Error(result.message || "Mobile money transfer failed");
      }
    } catch (error) {
      console.error("Mobile Money Error:", error);
      alert(`Mobile money payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentMethodSelect = () => {
    setShowMethods(true);
  };

  if (!showMethods) {
    return (
      <button
        onClick={handlePaymentMethodSelect}
        className="flutterwave-payment-btn"
        style={{
          backgroundColor: "#f5a623",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          width: "100%",
          marginTop: "16px",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#e89611")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#f5a623")}
      >
        💳 Pay KES {amount} with Flutterwave
      </button>
    );
  }

  return (
    <div className="payment-methods" style={{ marginTop: "16px" }}>
      <h4 style={{ margin: "0 0 12px 0", color: "#333" }}>
        Choose Payment Method:
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button
          onClick={initiateBankTransfer}
          disabled={isProcessing}
          style={{
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            padding: "12px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: isProcessing ? "not-allowed" : "pointer",
            opacity: isProcessing ? 0.6 : 1,
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            !isProcessing && (e.target.style.backgroundColor = "#1976D2")
          }
          onMouseOut={(e) =>
            !isProcessing && (e.target.style.backgroundColor = "#2196F3")
          }
        >
          {isProcessing ? "🔄 Processing..." : "🏦 Bank Transfer"}
        </button>

        <button
          onClick={initiateMobileMoneyTransfer}
          disabled={isProcessing}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "12px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: isProcessing ? "not-allowed" : "pointer",
            opacity: isProcessing ? 0.6 : 1,
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            !isProcessing && (e.target.style.backgroundColor = "#45a049")
          }
          onMouseOut={(e) =>
            !isProcessing && (e.target.style.backgroundColor = "#4CAF50")
          }
        >
          {isProcessing ? "🔄 Processing..." : "📱 M-Pesa Mobile Money"}
        </button>

        <button
          onClick={() => setShowMethods(false)}
          style={{
            backgroundColor: "#f0f0f0",
            color: "#666",
            border: "1px solid #ddd",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#e0e0e0")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
        >
          ← Back
        </button>
      </div>

      <div
        style={{
          marginTop: "12px",
          padding: "8px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        💡 <strong>Sandbox Mode:</strong> Use test credentials for payments.
        Real money will not be charged.
      </div>
    </div>
  );
};

export default FlutterwavePayment;
