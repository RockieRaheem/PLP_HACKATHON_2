import React, { useCallback, memo } from "react";

const StableCardForm = memo(
  ({ cardDetails, onCardDetailsChange, onSubmit, onBack, amount }) => {
    // Local handlers that don't cause parent re-renders
    const handleNumberChange = useCallback(
      (e) => {
        onCardDetailsChange("number", e.target.value);
      },
      [onCardDetailsChange]
    );

    const handleExpiryChange = useCallback(
      (e) => {
        onCardDetailsChange("expiry", e.target.value);
      },
      [onCardDetailsChange]
    );

    const handleCvvChange = useCallback(
      (e) => {
        onCardDetailsChange("cvv", e.target.value);
      },
      [onCardDetailsChange]
    );

    const handlePinChange = useCallback(
      (e) => {
        onCardDetailsChange("pin", e.target.value);
      },
      [onCardDetailsChange]
    );

    const isFormValid =
      cardDetails.number &&
      cardDetails.expiry &&
      cardDetails.cvv &&
      cardDetails.pin;

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
            value={cardDetails.number}
            onChange={handleNumberChange}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
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
              📅 Expiry Date
            </label>
            <input
              type="text"
              name={`card-expiry-${Date.now()}`}
              id={`card-expiry-${Date.now()}`}
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChange={handleExpiryChange}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
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
              🔒 CVV
            </label>
            <input
              type="text"
              name={`card-cvv-${Date.now()}`}
              id={`card-cvv-${Date.now()}`}
              placeholder="123"
              value={cardDetails.cvv}
              onChange={handleCvvChange}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
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
            value={cardDetails.pin}
            onChange={handlePinChange}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
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
