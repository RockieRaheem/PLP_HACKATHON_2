import React, { memo } from "react";

const IsolatedInput = memo(
  ({ placeholder, value, onChange, type = "text", label }) => {
    return (
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
          {label}
        </label>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
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
    );
  }
);

export default IsolatedInput;
