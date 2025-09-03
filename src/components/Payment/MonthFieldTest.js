import React, { useState } from "react";

const MonthFieldTest = () => {
  const [month, setMonth] = useState("");

  const handleMonthChange = (value) => {
    // Enhanced professional month handling
    const digits = value.replace(/\D/g, "");
    let formattedValue;

    if (digits.length === 0) {
      formattedValue = "";
    } else if (digits.length === 1) {
      const digit = parseInt(digits);
      if (digit === 0) {
        formattedValue = "0";
      } else if (digit === 1) {
        formattedValue = "1";
      } else if (digit >= 2 && digit <= 9) {
        formattedValue = "0" + digit;
      }
    } else {
      const monthNum = parseInt(digits.substr(0, 2));
      if (monthNum === 0) {
        formattedValue = "01";
      } else if (monthNum >= 1 && monthNum <= 12) {
        formattedValue = monthNum.toString().padStart(2, "0");
      } else if (monthNum > 12) {
        // If user tries to enter invalid month, reset to previous valid state
        const firstDigit = parseInt(digits.charAt(0));
        if (firstDigit === 1) {
          formattedValue = "12"; // Max valid month starting with 1
        } else {
          formattedValue = "09"; // Max valid month for others
        }
      }
    }

    setMonth(formattedValue);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h3>Month Field Test</h3>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          📅 Month (Professional Logic)
        </label>
        <input
          type="text"
          placeholder="MM"
          value={month}
          onChange={(e) => handleMonthChange(e.target.value)}
          onKeyDown={(e) => {
            // Allow backspace, delete, tab, escape, enter
            if (
              [8, 9, 27, 13, 46].includes(e.keyCode) ||
              // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
              (e.keyCode === 65 && e.ctrlKey) ||
              (e.keyCode === 67 && e.ctrlKey) ||
              (e.keyCode === 86 && e.ctrlKey) ||
              (e.keyCode === 88 && e.ctrlKey) ||
              // Allow home, end, left, right
              (e.keyCode >= 35 && e.keyCode <= 39)
            ) {
              return;
            }
            // Ensure that it is a number and stop the keypress
            if (
              (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
              (e.keyCode < 96 || e.keyCode > 105)
            ) {
              e.preventDefault();
            }
          }}
          maxLength={2}
          autoComplete="off"
          style={{
            width: "100%",
            padding: "16px",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "400",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            outline: "none",
            textAlign: "center",
          }}
        />
      </div>

      <div style={{ fontSize: "14px", color: "#666" }}>
        <p>
          <strong>Expected Behavior:</strong>
        </p>
        <ul>
          <li>Type "1" → shows "1" (can continue to "10", "11", "12")</li>
          <li>Type "2" → shows "02" (auto-formats)</li>
          <li>Type "8" → shows "08" (auto-formats)</li>
          <li>Type "13" → shows "12" (auto-corrects to max valid month)</li>
          <li>Can delete/backspace normally</li>
          <li>Only allows numeric input</li>
        </ul>
        <p>
          <strong>Current value:</strong> "{month}"
        </p>
      </div>
    </div>
  );
};

export default MonthFieldTest;
