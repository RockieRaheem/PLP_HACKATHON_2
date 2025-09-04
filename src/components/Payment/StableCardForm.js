import React, { useState, useRef, useEffect } from "react";

const StableCardForm = ({
  cardDetails,
  onCardDetailsChange,
  onSubmit,
  onBack,
  amount,
}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);
  const cardNumberRef = useRef(null);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format expiry date with better deletion handling
  const formatExpiry = (value, previousValue = "") => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // If we're deleting (new value is shorter than previous)
    if (value.length < previousValue.length) {
      // If user deleted the slash, remove the digit before it too
      if (
        previousValue.includes("/") &&
        !value.includes("/") &&
        numericValue.length === 2
      ) {
        return numericValue.substring(0, 1);
      }
    }

    // Format with slash after 2 digits
    if (numericValue.length >= 2) {
      return numericValue.substring(0, 2) + "/" + numericValue.substring(2, 4);
    }

    return numericValue;
  };

  // Validate card number using Luhn algorithm
  const validateCardNumber = (number) => {
    const cleanNumber = number.replace(/\D/g, "");
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);

      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  // Validate expiry date
  const validateExpiry = (expiry) => {
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiry)) return false;

    const [month, year] = expiry.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expYear = parseInt(year, 10);
    const expMonth = parseInt(month, 10);

    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;

    return true;
  };

  // Validate CVV
  const validateCVV = (cvv) => {
    return /^[0-9]{3,4}$/.test(cvv);
  };

  // Handle input changes with validation
  const handleInputChange = (field, value) => {
    let formattedValue = value;

    if (field === "number") {
      formattedValue = formatCardNumber(value);
    } else if (field === "expiry") {
      formattedValue = formatExpiry(value, cardDetails.expiry || "");
    }

    const newCardDetails = { ...cardDetails, [field]: formattedValue };
    onCardDetailsChange(newCardDetails);

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate fields only if they have been touched
    const newErrors = { ...errors };

    if (field === "number") {
      if (formattedValue.length > 0 && !validateCardNumber(formattedValue)) {
        newErrors.number = "Invalid card number";
      } else {
        delete newErrors.number;
      }
    } else if (field === "expiry") {
      if (formattedValue.length > 0 && !validateExpiry(formattedValue)) {
        newErrors.expiry = "Invalid expiry date";
      } else {
        delete newErrors.expiry;
      }
    } else if (field === "cvv") {
      if (formattedValue.length > 0 && !validateCVV(formattedValue)) {
        newErrors.cvv = "Invalid CVV";
      } else {
        delete newErrors.cvv;
      }
    }

    setErrors(newErrors);

    // Check if form is valid
    const isFormValid =
      validateCardNumber(newCardDetails.number || "") &&
      validateExpiry(newCardDetails.expiry || "") &&
      validateCVV(newCardDetails.cvv || "");

    setIsValid(isFormValid);
  };

  // Handle key down for expiry field to improve backspace behavior
  const handleExpiryKeyDown = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;

    // If backspace is pressed and cursor is right after the slash
    if (e.key === "Backspace" && cursorPos === 3 && value.charAt(2) === "/") {
      // Prevent default and manually remove the digit before the slash
      e.preventDefault();
      const newValue = value.substring(0, 1);
      handleInputChange("expiry", newValue);

      // Set cursor position after the remaining digit
      setTimeout(() => {
        e.target.setSelectionRange(1, 1);
      }, 0);
    }
  };

  // Handle field blur to show validation errors
  const handleFieldBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const newErrors = { ...errors };
    const value = cardDetails[field] || "";

    if (field === "number") {
      if (value.length > 0 && !validateCardNumber(value)) {
        newErrors.number = "Invalid card number";
      } else {
        delete newErrors.number;
      }
    } else if (field === "expiry") {
      if (value.length > 0 && !validateExpiry(value)) {
        newErrors.expiry = "Invalid expiry date";
      } else {
        delete newErrors.expiry;
      }
    } else if (field === "cvv") {
      if (value.length > 0 && !validateCVV(value)) {
        newErrors.cvv = "Invalid CVV";
      } else {
        delete newErrors.cvv;
      }
    }

    setErrors(newErrors);
  };

  // Get card type from number
  const getCardType = (number) => {
    const cleanNumber = number.replace(/\D/g, "");
    if (/^4/.test(cleanNumber)) return "visa";
    if (/^5[1-5]/.test(cleanNumber)) return "mastercard";
    if (/^3[47]/.test(cleanNumber)) return "amex";
    return "unknown";
  };

  const cardType = getCardType(cardDetails.number || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onSubmit();
    }
  };

  useEffect(() => {
    if (cardNumberRef.current) {
      cardNumberRef.current.focus();
    }
  }, []);

  const inputStyle = {
    width: "100%",
    padding: "16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "16px",
    transition: "all 0.3s ease",
    backgroundColor: "#ffffff",
    color: "#2d3748",
    fontFamily:
      "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    outline: "none",
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
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#2d3748",
            margin: "0 0 8px 0",
          }}
        >
          💳 Card Payment
        </h3>
        <p
          style={{
            color: "#718096",
            fontSize: "16px",
            margin: "0",
          }}
        >
          Enter your card details securely
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Card Number */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#4a5568",
              marginBottom: "8px",
            }}
          >
            Card Number
          </label>
          <div style={{ position: "relative" }}>
            <input
              ref={cardNumberRef}
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.number || ""}
              onChange={(e) => handleInputChange("number", e.target.value)}
              onBlur={() => handleFieldBlur("number")}
              style={
                errors.number && touched.number ? inputErrorStyle : inputStyle
              }
              maxLength="19"
            />
            {cardType !== "unknown" && (
              <div
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "12px",
                  color: "#718096",
                  textTransform: "uppercase",
                  fontWeight: "600",
                }}
              >
                {cardType}
              </div>
            )}
          </div>
          {errors.number && touched.number && (
            <p
              style={{
                color: "#e53e3e",
                fontSize: "12px",
                marginTop: "4px",
                margin: "4px 0 0 0",
              }}
            >
              {errors.number}
            </p>
          )}
        </div>

        {/* Expiry and CVV */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#4a5568",
                marginBottom: "8px",
              }}
            >
              Expiry Date
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              value={cardDetails.expiry || ""}
              onChange={(e) => handleInputChange("expiry", e.target.value)}
              onKeyDown={handleExpiryKeyDown}
              onBlur={() => handleFieldBlur("expiry")}
              style={
                errors.expiry && touched.expiry ? inputErrorStyle : inputStyle
              }
              maxLength="5"
            />
            {errors.expiry && touched.expiry && (
              <p
                style={{
                  color: "#e53e3e",
                  fontSize: "12px",
                  marginTop: "4px",
                  margin: "4px 0 0 0",
                }}
              >
                {errors.expiry}
              </p>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#4a5568",
                marginBottom: "8px",
              }}
            >
              CVV
            </label>
            <input
              type="text"
              placeholder="123"
              value={cardDetails.cvv || ""}
              onChange={(e) => handleInputChange("cvv", e.target.value)}
              onBlur={() => handleFieldBlur("cvv")}
              style={errors.cvv && touched.cvv ? inputErrorStyle : inputStyle}
              maxLength="4"
            />
            {errors.cvv && touched.cvv && (
              <p
                style={{
                  color: "#e53e3e",
                  fontSize: "12px",
                  marginTop: "4px",
                  margin: "4px 0 0 0",
                }}
              >
                {errors.cvv}
              </p>
            )}
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
              Your payment is secured with 256-bit SSL encryption
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              flex: 1,
              padding: "16px 24px",
              backgroundColor: "#f7fafc",
              color: "#4a5568",
              border: "2px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontFamily:
                "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#edf2f7";
              e.target.style.borderColor = "#cbd5e0";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#f7fafc";
              e.target.style.borderColor = "#e2e8f0";
            }}
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={!isValid}
            style={{
              flex: 2,
              padding: "16px 24px",
              backgroundColor: isValid ? "#48bb78" : "#a0aec0",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isValid ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              fontFamily:
                "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
            onMouseOver={(e) => {
              if (isValid) {
                e.target.style.backgroundColor = "#38a169";
                e.target.style.transform = "translateY(-1px)";
              }
            }}
            onMouseOut={(e) => {
              if (isValid) {
                e.target.style.backgroundColor = "#48bb78";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            💳 Pay KES {amount?.toLocaleString() || "0"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StableCardForm;
