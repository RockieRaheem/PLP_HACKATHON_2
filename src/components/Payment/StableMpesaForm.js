import React, { memo, useCallback } from "react";

const StableMpesaForm = memo(
  ({ mpesaPhone, setMpesaPhone, onBack, onPayment, amount }) => {
    const handlePhoneChange = useCallback(
      (e) => {
        setMpesaPhone(e.target.value);
      },
      [setMpesaPhone]
    );

    const handleBackClick = useCallback(() => {
      onBack();
    }, [onBack]);

    const handlePaymentClick = useCallback(() => {
      onPayment();
    }, [onPayment]);

    return (
      <div
        style={{
          padding: "20px 0",
          animation: "slideInUp 0.4s ease-out",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
            padding: "20px",
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            borderRadius: "15px",
            color: "white",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>📱</div>
          <h3 style={{ margin: "0 0 5px 0", fontSize: "20px" }}>
            M-Pesa Payment
          </h3>
          <p style={{ margin: "0", opacity: "0.9", fontSize: "14px" }}>
            Pay securely with your M-Pesa account
          </p>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#374151",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            📱 M-Pesa Phone Number
          </label>
          <input
            type="tel"
            placeholder="+254700000000"
            value={mpesaPhone}
            onChange={handlePhoneChange}
            autoComplete="off"
            style={{
              width: "100%",
              padding: "14px",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              fontSize: "16px",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
            }}
          />
          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              margin: "8px 0 0 0",
            }}
          >
            💡 You'll receive an SMS prompt to complete the payment
          </p>
        </div>

        <div
          style={{
            background: "#fef3c7",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #f59e0b",
            marginBottom: "25px",
          }}
        >
          <h4
            style={{ margin: "0 0 8px 0", color: "#92400e", fontSize: "14px" }}
          >
            📋 Payment Instructions:
          </h4>
          <ol
            style={{
              margin: "0",
              paddingLeft: "18px",
              color: "#92400e",
              fontSize: "13px",
            }}
          >
            <li>Click "Pay with M-Pesa" below</li>
            <li>Check your phone for M-Pesa SMS</li>
            <li>Enter your M-Pesa PIN when prompted</li>
            <li>Your payment will be processed instantly</li>
          </ol>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleBackClick}
            style={{
              flex: 1,
              padding: "14px",
              background: "#f3f4f6",
              color: "#374151",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            ← Back
          </button>
          <button
            onClick={handlePaymentClick}
            disabled={!mpesaPhone}
            style={{
              flex: 2,
              padding: "14px",
              background: !mpesaPhone
                ? "#d1d5db"
                : "linear-gradient(135deg, #059669 0%, #047857 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: !mpesaPhone ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
            }}
          >
            📱 Pay KES {amount.toLocaleString()}
          </button>
        </div>
      </div>
    );
  }
);

export default StableMpesaForm;
