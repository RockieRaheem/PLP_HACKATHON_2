import React, { useState, useRef, useEffect } from "react";

const StableMpesaForm = ({
  mpesaPhone,
  setMpesaPhone,
  onBack,
  onPayment,
  amount,
}) => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const phoneInputRef = useRef(null);

  // Format phone number
  const formatPhoneNumber = (value) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, "");

    // Handle different input formats
    let formatted = cleaned;

    // If starts with 07, convert to 2547
    if (cleaned.startsWith("07")) {
      formatted = "254" + cleaned.substring(1);
    }
    // If starts with +254, remove the +
    else if (cleaned.startsWith("254")) {
      formatted = cleaned;
    }
    // If starts with 7 (without 0), add 254
    else if (cleaned.startsWith("7") && cleaned.length === 9) {
      formatted = "254" + cleaned;
    }

    return formatted;
  };

  // Validate Kenyan phone number
  const validatePhoneNumber = (phone) => {
    const cleanPhone = phone.replace(/\D/g, "");

    // Should be 254XXXXXXXXX format (12 digits total)
    if (cleanPhone.length !== 12) return false;

    // Should start with 254
    if (!cleanPhone.startsWith("254")) return false;

    // The next digit should be 7 (for mobile numbers)
    if (!cleanPhone.startsWith("2547")) return false;

    return true;
  };

  // Handle phone input change
  const handlePhoneChange = (value) => {
    const formattedPhone = formatPhoneNumber(value);
    setMpesaPhone(formattedPhone);

    // Validate
    const newErrors = { ...errors };
    if (!validatePhoneNumber(formattedPhone)) {
      newErrors.phone = "Please enter a valid Kenyan phone number";
    } else {
      delete newErrors.phone;
    }

    setErrors(newErrors);
    setIsValid(validatePhoneNumber(formattedPhone));
  };

  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    try {
      await onPayment();
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Display formatted phone number for user
  const displayPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("254") && cleaned.length >= 12) {
      return `+${cleaned.substring(0, 3)} ${cleaned.substring(
        3,
        6
      )} ${cleaned.substring(6, 9)} ${cleaned.substring(9)}`;
    }
    return phone;
  };

  // Get network provider
  const getNetworkProvider = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("2547")) {
      const prefix = cleaned.substring(4, 6);
      if (["01", "02", "10", "11", "12", "13", "14", "15"].includes(prefix))
        return "Safaricom";
      if (
        ["20", "21", "22", "23", "24", "25", "26", "27", "28", "29"].includes(
          prefix
        )
      )
        return "Airtel";
      if (
        ["30", "31", "32", "33", "34", "35", "36", "37", "38", "39"].includes(
          prefix
        )
      )
        return "Telkom";
    }
    return "Unknown";
  };

  const networkProvider = getNetworkProvider(mpesaPhone);

  useEffect(() => {
    if (phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, []);

  const inputStyle = {
    width: "100%",
    padding: "18px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "18px",
    transition: "all 0.3s ease",
    backgroundColor: "#ffffff",
    color: "#2d3748",
    fontFamily:
      "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    outline: "none",
    fontWeight: "500",
  };

  const inputErrorStyle = {
    ...inputStyle,
    borderColor: "#e53e3e",
    backgroundColor: "#fed7d7",
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "32px",
        borderRadius: "20px",
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        border: "1px solid #e2e8f0",
        maxWidth: "500px",
        margin: "0 auto",
        fontFamily:
          "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div
          style={{
            fontSize: "48px",
            marginBottom: "12px",
          }}
        >
          📱
        </div>
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#2d3748",
            margin: "0 0 8px 0",
          }}
        >
          M-Pesa Payment
        </h3>
        <p
          style={{
            color: "#718096",
            fontSize: "16px",
            margin: "0",
          }}
        >
          Pay securely with M-Pesa
        </p>
      </div>

      <form onSubmit={handlePayment}>
        {/* Phone Number Input */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#4a5568",
              marginBottom: "8px",
            }}
          >
            M-Pesa Phone Number
          </label>
          <div style={{ position: "relative" }}>
            <input
              ref={phoneInputRef}
              type="tel"
              placeholder="254700123456"
              value={mpesaPhone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              style={errors.phone ? inputErrorStyle : inputStyle}
              maxLength="15"
            />
            {networkProvider !== "Unknown" && isValid && (
              <div
                style={{
                  position: "absolute",
                  right: "18px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "12px",
                  color: "#48bb78",
                  fontWeight: "600",
                  backgroundColor: "#f0fff4",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "1px solid #c6f6d5",
                }}
              >
                {networkProvider}
              </div>
            )}
          </div>
          {errors.phone && (
            <p
              style={{
                color: "#e53e3e",
                fontSize: "12px",
                marginTop: "4px",
                margin: "4px 0 0 0",
              }}
            >
              {errors.phone}
            </p>
          )}
          {isValid && (
            <p
              style={{
                color: "#48bb78",
                fontSize: "12px",
                marginTop: "4px",
                margin: "4px 0 0 0",
              }}
            >
              ✓ {displayPhoneNumber(mpesaPhone)}
            </p>
          )}
        </div>

        {/* Amount Display */}
        <div
          style={{
            backgroundColor: "#f7fafc",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "24px",
            border: "2px solid #e2e8f0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#718096",
              marginBottom: "4px",
              fontWeight: "500",
            }}
          >
            Amount to Pay
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#2d3748",
            }}
          >
            KES {amount?.toLocaleString() || "0"}
          </div>
        </div>

        {/* Instructions */}
        <div
          style={{
            backgroundColor: "#e6fffa",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "24px",
            border: "1px solid #81e6d9",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
          >
            <span style={{ fontSize: "20px" }}>💡</span>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#234e52",
                  marginBottom: "8px",
                }}
              >
                How M-Pesa Payment Works:
              </div>
              <ol
                style={{
                  fontSize: "13px",
                  color: "#2c7a7b",
                  margin: "0",
                  paddingLeft: "16px",
                  lineHeight: "1.6",
                }}
              >
                <li>Click "Pay with M-Pesa" below</li>
                <li>You'll receive an STK push notification</li>
                <li>Enter your M-Pesa PIN to complete payment</li>
                <li>You'll receive a confirmation SMS</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div
          style={{
            backgroundColor: "#f7fafc",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "24px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🔒</span>
            <span
              style={{
                fontSize: "14px",
                color: "#4a5568",
                fontWeight: "500",
              }}
            >
              Secured by Safaricom M-Pesa & Flutterwave
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "16px 24px",
              backgroundColor: "#f7fafc",
              color: "#4a5568",
              border: "2px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              fontFamily:
                "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = "#edf2f7";
                e.target.style.borderColor = "#cbd5e0";
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = "#f7fafc";
                e.target.style.borderColor = "#e2e8f0";
              }
            }}
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={!isValid || isLoading}
            style={{
              flex: 2,
              padding: "16px 24px",
              backgroundColor: isValid && !isLoading ? "#00a86b" : "#a0aec0",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isValid && !isLoading ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              fontFamily:
                "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              position: "relative",
            }}
            onMouseOver={(e) => {
              if (isValid && !isLoading) {
                e.target.style.backgroundColor = "#007f54";
                e.target.style.transform = "translateY(-1px)";
              }
            }}
            onMouseOut={(e) => {
              if (isValid && !isLoading) {
                e.target.style.backgroundColor = "#00a86b";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            {isLoading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #ffffff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Processing...
              </span>
            ) : (
              `📱 Pay KES ${amount?.toLocaleString() || "0"} with M-Pesa`
            )}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default StableMpesaForm;
