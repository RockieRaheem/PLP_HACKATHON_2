import React, { useState, useCallback, memo } from "react";

const ModernCardForm = memo(
  ({ cardDetails, onCardDetailsChange, onSubmit, onBack, amount }) => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Validation functions with Spotify/Google style
    const validateCardNumber = (value) => {
      const cleaned = value.replace(/\s/g, "");
      if (!cleaned) return "Card number is required";
      if (!/^\d+$/.test(cleaned))
        return "Card number should only contain numbers";
      if (cleaned.length < 13) return "Card number is too short";
      if (cleaned.length > 19) return "Card number is too long";
      return "";
    };

    const validateMonth = (value) => {
      if (!value || value === "") return "Month is required";
      const month = parseInt(value);
      if (isNaN(month)) return "Enter a valid month";
      if (month < 1 || month > 12) return "Enter a valid month (01-12)";
      return "";
    };

    const validateYear = (value) => {
      if (!value) return "Year is required";
      const year = parseInt(value);
      const currentYear = new Date().getFullYear() % 100;
      if (isNaN(year) || year < currentYear) return "Card has expired";
      if (year > currentYear + 10) return "Year seems too far in the future";
      return "";
    };

    const validateCvv = (value) => {
      if (!value) return "CVV is required";
      if (!/^\d{3,4}$/.test(value)) return "CVV should be 3 or 4 digits";
      return "";
    };

    const validatePin = (value) => {
      if (!value) return "PIN is required";
      if (!/^\d{4}$/.test(value)) return "PIN should be exactly 4 digits";
      return "";
    };

    // Format card number with spaces (like Spotify)
    const formatCardNumber = (value) => {
      return value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
        .substr(0, 23);
    };

    // Handle input changes with validation
    const handleInputChange = useCallback(
      (field, value) => {
        let formattedValue = value;

        if (field === "number") {
          formattedValue = formatCardNumber(value);
        } else if (field === "month") {
          formattedValue = value.replace(/\D/g, "").substr(0, 2);
        } else if (field === "year") {
          formattedValue = value.replace(/\D/g, "").substr(0, 2);
        } else if (field === "cvv") {
          formattedValue = value.replace(/\D/g, "").substr(0, 4);
        } else if (field === "pin") {
          formattedValue = value.replace(/\D/g, "").substr(0, 4);
        }

        onCardDetailsChange(field, formattedValue);

        // Clear error when user starts typing
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: "" }));
        }
      },
      [onCardDetailsChange, errors]
    );

    const handleBlur = useCallback(
      (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));

        let error = "";
        const value = cardDetails[field] || "";

        switch (field) {
          case "number":
            error = validateCardNumber(value);
            break;
          case "month":
            error = validateMonth(value);
            break;
          case "year":
            error = validateYear(value);
            break;
          case "cvv":
            error = validateCvv(value);
            break;
          case "pin":
            error = validatePin(value);
            break;
          default:
            break;
        }

        setErrors((prev) => ({ ...prev, [field]: error }));
      },
      [cardDetails]
    );

    const isFormValid = () => {
      const fields = ["number", "month", "year", "cvv", "pin"];
      return fields.every((field) => {
        const value = cardDetails[field] || "";
        switch (field) {
          case "number":
            return validateCardNumber(value) === "";
          case "month":
            return validateMonth(value) === "";
          case "year":
            return validateYear(value) === "";
          case "cvv":
            return validateCvv(value) === "";
          case "pin":
            return validatePin(value) === "";
          default:
            return true;
        }
      });
    };

    const handleSubmit = () => {
      // Validate all fields
      const newErrors = {};
      const newTouched = {};
      const fields = ["number", "month", "year", "cvv", "pin"];

      fields.forEach((field) => {
        newTouched[field] = true;
        const value = cardDetails[field] || "";
        switch (field) {
          case "number":
            newErrors[field] = validateCardNumber(value);
            break;
          case "month":
            newErrors[field] = validateMonth(value);
            break;
          case "year":
            newErrors[field] = validateYear(value);
            break;
          case "cvv":
            newErrors[field] = validateCvv(value);
            break;
          case "pin":
            newErrors[field] = validatePin(value);
            break;
          default:
            break;
        }
      });

      setErrors(newErrors);
      setTouched(newTouched);

      if (Object.values(newErrors).every((error) => !error)) {
        onSubmit();
      }
    };

    // Modern input component
    const ModernInput = ({
      label,
      type = "text",
      placeholder,
      value,
      onChange,
      onBlur,
      error,
      touched,
      maxLength,
      icon,
    }) => (
      <div style={{ marginBottom: "24px", position: "relative" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            color: error && touched ? "#e11d48" : "#374151",
            fontSize: "14px",
            fontWeight: "500",
            transition: "color 0.2s ease",
          }}
        >
          {icon && <span style={{ marginRight: "6px" }}>{icon}</span>}
          {label}
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            autoComplete="off"
            style={{
              width: "100%",
              padding: "16px",
              border: `2px solid ${
                error && touched
                  ? "#e11d48"
                  : touched && !error
                  ? "#22c55e"
                  : "#e5e7eb"
              }`,
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "400",
              transition: "all 0.2s ease",
              boxSizing: "border-box",
              backgroundColor: error && touched ? "#fef2f2" : "#ffffff",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor =
                error && touched ? "#e11d48" : "#3b82f6";
              e.target.style.boxShadow = `0 0 0 3px ${
                error && touched
                  ? "rgba(225, 29, 72, 0.1)"
                  : "rgba(59, 130, 246, 0.1)"
              }`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor =
                error && touched
                  ? "#e11d48"
                  : touched && !error
                  ? "#22c55e"
                  : "#e5e7eb";
              e.target.style.boxShadow = "none";
              onBlur && onBlur();
            }}
          />
          {touched && !error && (
            <div
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#22c55e",
                fontSize: "18px",
              }}
            >
              ✓
            </div>
          )}
        </div>
        {error && touched && (
          <div
            style={{
              marginTop: "6px",
              color: "#e11d48",
              fontSize: "13px",
              fontWeight: "400",
              display: "flex",
              alignItems: "center",
              animation: "slideDown 0.2s ease",
            }}
          >
            <span style={{ marginRight: "4px" }}>⚠</span>
            {error}
          </div>
        )}
      </div>
    );

    return (
      <div style={{ padding: "24px 0", maxWidth: "480px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
            padding: "24px",
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            borderRadius: "16px",
            color: "white",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>💳</div>
          <h2
            style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "600" }}
          >
            Card Payment
          </h2>
          <p style={{ margin: "0", opacity: "0.9", fontSize: "15px" }}>
            Enter your payment details securely
          </p>
        </div>

        {/* Card Number */}
        <ModernInput
          label="Card Number"
          placeholder="1234 5678 9012 3456"
          value={cardDetails.number || ""}
          onChange={(e) => handleInputChange("number", e.target.value)}
          onBlur={() => handleBlur("number")}
          error={errors.number}
          touched={touched.number}
          maxLength={23}
          icon="💳"
        />

        {/* Expiry Date - Split Fields */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#374151",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            📅 Expiry Date
          </label>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="MM"
                value={cardDetails.month || ""}
                onChange={(e) => handleInputChange("month", e.target.value)}
                maxLength={2}
                autoComplete="off"
                style={{
                  width: "100%",
                  padding: "16px",
                  border: `2px solid ${
                    errors.month && touched.month
                      ? "#e11d48"
                      : touched.month && !errors.month
                      ? "#22c55e"
                      : "#e5e7eb"
                  }`,
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "400",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  backgroundColor:
                    errors.month && touched.month ? "#fef2f2" : "#ffffff",
                  outline: "none",
                  textAlign: "center",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor =
                    errors.month && touched.month ? "#e11d48" : "#3b82f6";
                  e.target.style.boxShadow = `0 0 0 3px ${
                    errors.month && touched.month
                      ? "rgba(225, 29, 72, 0.1)"
                      : "rgba(59, 130, 246, 0.1)"
                  }`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor =
                    errors.month && touched.month
                      ? "#e11d48"
                      : touched.month && !errors.month
                      ? "#22c55e"
                      : "#e5e7eb";
                  e.target.style.boxShadow = "none";
                  handleBlur("month");
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
                color: "#6b7280",
                paddingTop: "8px",
              }}
            >
              /
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="YY"
                value={cardDetails.year || ""}
                onChange={(e) => handleInputChange("year", e.target.value)}
                maxLength={2}
                autoComplete="off"
                style={{
                  width: "100%",
                  padding: "16px",
                  border: `2px solid ${
                    errors.year && touched.year
                      ? "#e11d48"
                      : touched.year && !errors.year
                      ? "#22c55e"
                      : "#e5e7eb"
                  }`,
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "400",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  backgroundColor:
                    errors.year && touched.year ? "#fef2f2" : "#ffffff",
                  outline: "none",
                  textAlign: "center",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor =
                    errors.year && touched.year ? "#e11d48" : "#3b82f6";
                  e.target.style.boxShadow = `0 0 0 3px ${
                    errors.year && touched.year
                      ? "rgba(225, 29, 72, 0.1)"
                      : "rgba(59, 130, 246, 0.1)"
                  }`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor =
                    errors.year && touched.year
                      ? "#e11d48"
                      : touched.year && !errors.year
                      ? "#22c55e"
                      : "#e5e7eb";
                  e.target.style.boxShadow = "none";
                  handleBlur("year");
                }}
              />
            </div>
          </div>
          {((errors.month && touched.month) ||
            (errors.year && touched.year)) && (
            <div
              style={{
                marginTop: "6px",
                color: "#e11d48",
                fontSize: "13px",
                fontWeight: "400",
                display: "flex",
                alignItems: "center",
                animation: "slideDown 0.2s ease",
              }}
            >
              <span style={{ marginRight: "4px" }}>⚠</span>
              {errors.month || errors.year}
            </div>
          )}
        </div>

        {/* CVV and PIN */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <div style={{ flex: 1 }}>
            <ModernInput
              label="CVV"
              type="text"
              placeholder="123"
              value={cardDetails.cvv || ""}
              onChange={(e) => handleInputChange("cvv", e.target.value)}
              onBlur={() => handleBlur("cvv")}
              error={errors.cvv}
              touched={touched.cvv}
              maxLength={4}
              icon="🔒"
            />
          </div>
          <div style={{ flex: 1 }}>
            <ModernInput
              label="PIN"
              type="password"
              placeholder="****"
              value={cardDetails.pin || ""}
              onChange={(e) => handleInputChange("pin", e.target.value)}
              onBlur={() => handleBlur("pin")}
              error={errors.pin}
              touched={touched.pin}
              maxLength={4}
              icon="🔑"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          <button
            onClick={onBack}
            style={{
              flex: 1,
              padding: "16px",
              background: "#f8fafc",
              color: "#475569",
              border: "2px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#f1f5f9";
              e.target.style.borderColor = "#cbd5e1";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#f8fafc";
              e.target.style.borderColor = "#e2e8f0";
            }}
          >
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            style={{
              flex: 2,
              padding: "16px",
              background: isFormValid()
                ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                : "#9ca3af",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isFormValid() ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              boxShadow: isFormValid()
                ? "0 4px 12px rgba(79, 70, 229, 0.3)"
                : "none",
            }}
            onMouseEnter={(e) => {
              if (isFormValid()) {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 6px 16px rgba(79, 70, 229, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (isFormValid()) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.3)";
              }
            }}
          >
            💳 Pay KES {amount?.toLocaleString()}
          </button>
        </div>

        {/* CSS Animations */}
        <style>
          {`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </div>
    );
  }
);

export default ModernCardForm;
