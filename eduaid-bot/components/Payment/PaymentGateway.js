import React, { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";

const PaymentGateway = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: 500, // KES
      features: [
        "50 AI questions/month",
        "Basic study planner",
        "Progress tracking",
      ],
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: 1000, // KES
      features: [
        "Unlimited AI questions",
        "Advanced study planner",
        "PDF analysis",
        "Past papers",
      ],
    },
  ];

  const initiatePayment = httpsCallable(functions, "initiatePayment");

  const handlePayment = async (plan) => {
    setIsProcessing(true);

    try {
      const result = await initiatePayment({
        planId: plan.id,
        amount: plan.price,
        currency: "KES",
      });

      // Redirect to IntaSend payment page
      window.location.href = result.data.paymentUrl;
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }

    setIsProcessing(false);
  };

  return (
    <div className="payment-gateway">
      <div className="payment-header">
        <h2>💎 Upgrade to Premium</h2>
        <p>Unlock advanced features to accelerate your learning</p>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${plan.id === "premium" ? "featured" : ""}`}
          >
            {plan.id === "premium" && <div className="badge">Most Popular</div>}
            <h3>{plan.name}</h3>
            <div className="price">
              <span className="currency">KES</span>
              <span className="amount">{plan.price}</span>
              <span className="period">/month</span>
            </div>
            <ul className="features-list">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <span className="checkmark">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePayment(plan)}
              disabled={isProcessing}
              className={`subscribe-btn ${
                plan.id === "premium" ? "premium-btn" : ""
              }`}
            >
              {isProcessing ? "⏳ Processing..." : `Choose ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="payment-info">
        <p>💳 Secure payment powered by IntaSend</p>
        <p>🔒 Cancel anytime • 7-day money-back guarantee</p>
      </div>
    </div>
  );
};

export default PaymentGateway;
