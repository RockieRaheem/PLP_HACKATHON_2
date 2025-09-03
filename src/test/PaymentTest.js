import React, { useState } from "react";
import FlutterwavePayment from "../components/Payment/FlutterwavePayment";

const PaymentTest = () => {
  const [showPayment, setShowPayment] = useState(false);

  const handlePaymentSuccess = () => {
    console.log("Payment successful");
    setShowPayment(false);
  };

  const handlePaymentClose = () => {
    console.log("Payment cancelled");
    setShowPayment(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Payment Test Component</h2>
      <button onClick={() => setShowPayment(true)}>
        Start Popup Payment Test
      </button>

      {showPayment && (
        <FlutterwavePayment
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}
    </div>
  );
};

export default PaymentTest;
