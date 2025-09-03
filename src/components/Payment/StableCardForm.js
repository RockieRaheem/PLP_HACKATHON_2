import React, { useCallback, memo, useState } from "react";

const StableCardForm = memo(
  ({ cardDetails, onCardDetailsChange, onSubmit, onBack, amount }) => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Validation functions
    const validateCardNumber = (number) => {
      const cleaned = number.replace(/\D/g, "");
      if (!cleaned) return "Card number is required";
      if (cleaned.length < 13) return "Card number must be at least 13 digits";
      if (cleaned.length > 19) return "Card number cannot exceed 19 digits";
      if (!/^\d+$/.test(cleaned))
        return "Card number must contain only numbers";
      return "";
    };

    const validateExpiryYear = (year) => {
      if (!year) return "Year is required";
      if (!/^\d+$/.test(year)) return "Year must contain only numbers";
      if (year.length !== 2) return "Year must be 2 digits";
      const currentYear = new Date().getFullYear() % 100;
      const yearNum = parseInt(year);
      if (yearNum < currentYear) return "Card has expired";
      return "";
    };

    // Simple month validation - same approach as year
    const validateExpiryMonth = (month) => {
      if (!month) return "Month is required";
      if (!/^\d+$/.test(month)) return "Month must contain only numbers";
      if (month.length !== 2) return "Month must be 2 digits";
      const monthNum = parseInt(month);
      if (monthNum < 1 || monthNum > 12) return "Month must be between 01-12";
      return "";
    };

    const validateCvv = (cvv) => {
      if (!cvv) return "CVV is required";
      if (!/^\d+$/.test(cvv)) return "CVV must contain only numbers";
      if (cvv.length !== 3) return "CVV must be exactly 3 digits";
      return "";
    };

    const validatePin = (pin) => {
      if (!pin) return "PIN is required";
      if (!/^\d+$/.test(pin)) return "PIN must contain only numbers";
      if (pin.length !== 4) return "PIN must be exactly 4 digits";
      return "";
    };

    // Enhanced handlers with validation
    const handleNumberChange = useCallback(
      (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 19);
        onCardDetailsChange("number", value);
        if (touched.number) {
          setErrors((prev) => ({ ...prev, number: validateCardNumber(value) }));
        }
      },
      [onCardDetailsChange, touched.number]
    );

    // Simple month handler - same logic as year
    const handleExpiryMonthChange = useCallback(
      (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 2);
        const currentExpiry = cardDetails.expiry || "/";
        const [, year] = currentExpiry.split("/");
        const newExpiry = `${value}/${year || ""}`;
        onCardDetailsChange("expiry", newExpiry);
      },
      [onCardDetailsChange, cardDetails.expiry]
    );

    // Simple year handler - same logic as month
    const handleExpiryYearChange = useCallback(
      (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 2);
        const currentExpiry = cardDetails.expiry || "/";
        const [month] = currentExpiry.split("/");
        const newExpiry = `${month || ""}/${value}`;
        onCardDetailsChange("expiry", newExpiry);
      },
      [onCardDetailsChange, cardDetails.expiry]
    );

    const handleCvvChange = useCallback(
      (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 3);
        onCardDetailsChange("cvv", value);
        if (touched.cvv) {
          setErrors((prev) => ({ ...prev, cvv: validateCvv(value) }));
        }
      },
      [onCardDetailsChange, touched.cvv]
    );

    const handlePinChange = useCallback(
      (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 4);
        onCardDetailsChange("pin", value);
        if (touched.pin) {
          setErrors((prev) => ({ ...prev, pin: validatePin(value) }));
        }
      },
      [onCardDetailsChange, touched.pin]
    );

    // Field blur handlers to trigger validation
    const handleFieldBlur = useCallback(
      (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));

        switch (field) {
          case "number":
            setErrors((prev) => ({
              ...prev,
              number: validateCardNumber(cardDetails.number || ""),
            }));
            break;
          case "expiryMonth":
            const [month] = (cardDetails.expiry || "/").split("/");
            setErrors((prev) => ({
              ...prev,
              expiryMonth: validateExpiryMonth(month || ""),
            }));
            break;
          case "expiryYear":
            const [, year] = (cardDetails.expiry || "/").split("/");
            setErrors((prev) => ({
              ...prev,
              expiryYear: validateExpiryYear(year || ""),
            }));
            break;
          case "cvv":
            setErrors((prev) => ({
              ...prev,
              cvv: validateCvv(cardDetails.cvv || ""),
            }));
            break;
          case "pin":
            setErrors((prev) => ({
              ...prev,
              pin: validatePin(cardDetails.pin || ""),
            }));
            break;
          default:
            break;
        }
      },
      [cardDetails]
    );

    // Check if form is valid
    const isFormValid = () => {
      const [month, year] = (cardDetails.expiry || "/").split("/");
      return (
        cardDetails.number &&
        !validateCardNumber(cardDetails.number) &&
        month &&
        !validateExpiryMonth(month) &&
        year &&
        !validateExpiryYear(year) &&
        cardDetails.cvv &&
        !validateCvv(cardDetails.cvv) &&
        cardDetails.pin &&
        !validatePin(cardDetails.pin)
      );
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

    // Get expiry month and year
    const [expiryMonth = "", expiryYear = ""] = (
      cardDetails.expiry || "/"
    ).split("/");

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
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            borderRadius: "15px",
            color: "white",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>💳</div>
          <h3 style={{ margin: "0 0 5px 0", fontSize: "20px" }}>
            Card Payment
          </h3>
          <p style={{ margin: "0", opacity: "0.9", fontSize: "14px" }}>
            Enter your card details securely
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#374151",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            💳 Card Number
          </label>
          <input
            type="text"
            name={`card-number-${Date.now()}`}
            id={`card-number-${Date.now()}`}
            placeholder="1234 5678 9012 3456"
            value={cardDetails.number || ""}
            onChange={handleNumberChange}
            onBlur={() => handleFieldBlur("number")}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            style={{
              width: "100%",
              padding: "14px",
              border: `2px solid ${
                errors.number && touched.number ? "#dc2626" : "#e5e7eb"
              }`,
              borderRadius: "10px",
              fontSize: "16px",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
            }}
          />
          <ErrorMessage error={touched.number ? errors.number : ""} />
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              📅 Month
            </label>
            <input
              type="text"
              name={`card-month-${Date.now()}`}
              id={`card-month-${Date.now()}`}
              placeholder="MM"
              value={expiryMonth}
              onChange={handleExpiryMonthChange}
              onBlur={() => handleFieldBlur("expiryMonth")}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              maxLength={2}
              style={{
                width: "100%",
                padding: "14px",
                border: `2px solid ${
                  errors.expiryMonth && touched.expiryMonth
                    ? "#dc2626"
                    : "#e5e7eb"
                }`,
                borderRadius: "10px",
                fontSize: "16px",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
              }}
            />
            <ErrorMessage
              error={touched.expiryMonth ? errors.expiryMonth : ""}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              📅 Year
            </label>
            <input
              type="text"
              name={`card-year-${Date.now()}`}
              id={`card-year-${Date.now()}`}
              placeholder="YY"
              value={expiryYear}
              onChange={handleExpiryYearChange}
              onBlur={() => handleFieldBlur("expiryYear")}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              maxLength={2}
              style={{
                width: "100%",
                padding: "14px",
                border: `2px solid ${
                  errors.expiryYear && touched.expiryYear
                    ? "#dc2626"
                    : "#e5e7eb"
                }`,
                borderRadius: "10px",
                fontSize: "16px",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
              }}
            />
            <ErrorMessage error={touched.expiryYear ? errors.expiryYear : ""} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              🔒 CVV
            </label>
            <input
              type="text"
              name={`card-cvv-${Date.now()}`}
              id={`card-cvv-${Date.now()}`}
              placeholder="123"
              value={cardDetails.cvv || ""}
              onChange={handleCvvChange}
              onBlur={() => handleFieldBlur("cvv")}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              style={{
                width: "100%",
                padding: "14px",
                border: `2px solid ${
                  errors.cvv && touched.cvv ? "#dc2626" : "#e5e7eb"
                }`,
                borderRadius: "10px",
                fontSize: "16px",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
              }}
            />
            <ErrorMessage error={touched.cvv ? errors.cvv : ""} />
          </div>
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
            🔑 Card PIN
          </label>
          <input
            type="password"
            name={`card-pin-${Date.now()}`}
            id={`card-pin-${Date.now()}`}
            placeholder="Enter your 4-digit PIN"
            value={cardDetails.pin || ""}
            onChange={handlePinChange}
            onBlur={() => handleFieldBlur("pin")}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            style={{
              width: "100%",
              padding: "14px",
              border: `2px solid ${
                errors.pin && touched.pin ? "#dc2626" : "#e5e7eb"
              }`,
              borderRadius: "10px",
              fontSize: "16px",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
            }}
          />
          <ErrorMessage error={touched.pin ? errors.pin : ""} />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onBack}
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
            onClick={onSubmit}
            disabled={!isFormValid}
            style={{
              flex: 2,
              padding: "14px",
              background: !isFormValid
                ? "#d1d5db"
                : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: !isFormValid ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
            }}
          >
            💳 Pay KES {amount.toLocaleString()}
          </button>
        </div>
      </div>
    );
  }
);

export default StableCardForm;
