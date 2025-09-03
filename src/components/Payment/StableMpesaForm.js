import React, { memo, useCallback, useState } from "react";

const StableMpesaForm = memo(
  ({ mpesaPhone, setMpesaPhone, onBack, onPayment, amount }) => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Phone number validation
    const validatePhoneNumber = (phone) => {
      if (!phone) return "Phone number is required";
      const cleaned = phone.replace(/\D/g, "");
      if (cleaned.length < 10) return "Phone number must be at least 10 digits";
      if (cleaned.length > 13) return "Phone number cannot exceed 13 digits";
      if (!/^(\+?254|0)?[17]\d{8}$/.test(phone))
        return "Please enter a valid Kenyan phone number";
      return "";
    };

    const handlePhoneChange = useCallback(
      (e) => {
        let value = e.target.value.replace(/[^\d+]/g, "");

        // Format phone number nicely
        if (value.startsWith("0")) {
          value = "254" + value.substring(1);
        }
        if (
          !value.startsWith("+") &&
          !value.startsWith("254") &&
          value.length > 0
        ) {
          value = "+254" + value;
        }
        if (value.startsWith("254")) {
          value = "+" + value;
        }

        setMpesaPhone(value);
        if (touched.phoneNumber) {
          setErrors((prev) => ({
            ...prev,
            phoneNumber: validatePhoneNumber(value),
          }));
        }
      },
      [setMpesaPhone, touched.phoneNumber]
    );

    const handlePhoneBlur = useCallback(() => {
      setTouched((prev) => ({ ...prev, phoneNumber: true }));
      setErrors((prev) => ({
        ...prev,
        phoneNumber: validatePhoneNumber(mpesaPhone || ""),
      }));
    }, [mpesaPhone]);

    const handleBackClick = useCallback(() => {
      onBack();
    }, [onBack]);

    const handlePaymentClick = useCallback(() => {
      onPayment();
    }, [onPayment]);

    const isFormValid = () => {
      return mpesaPhone && !validatePhoneNumber(mpesaPhone);
    };

    // Error message component
    const ErrorMessage = ({ error }) => {
      if (!error) return null;
      return (
        <div
          style={{
            color: "#dc2626",
            fontSize: "12px",
            marginTop: "4px",
            padding: "4px 8px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>⚠️</span>
          {error}
        </div>
      );
    };

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
            value={mpesaPhone || ""}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            autoComplete="off"
            style={{
              width: "100%",
              padding: "14px",
              border: `2px solid ${
                errors.phoneNumber && touched.phoneNumber
                  ? "#dc2626"
                  : "#e5e7eb"
              }`,
              borderRadius: "10px",
              fontSize: "16px",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
            }}
          />
          <ErrorMessage error={touched.phoneNumber ? errors.phoneNumber : ""} />
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
            disabled={!isFormValid()}
            style={{
              flex: 2,
              padding: "14px",
              background: !isFormValid()
                ? "#d1d5db"
                : "linear-gradient(135deg, #059669 0%, #047857 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: !isFormValid() ? "not-allowed" : "pointer",
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
