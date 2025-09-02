import React from "react";
import FlutterwavePayment from "./FlutterwavePayment";

const PaymentGateway = () => {
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

  const handlePaymentSuccess = (response, plan) => {
    console.log("Payment successful:", response);

    // Store subscription info in localStorage
    const subscriptionData = {
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      currency: "KES",
      transactionRef: response.tx_ref,
      flutterwaveRef: response.flw_ref,
      subscribedAt: new Date().toISOString(),
      status: "active",
    };

    localStorage.setItem(
      "eduaid_subscription",
      JSON.stringify(subscriptionData)
    );
    localStorage.setItem("eduaid_subscription_status", "premium");

    alert("✅ Payment successful! Welcome to EduAid Premium!");

    // Reload to reflect premium status
    window.location.reload();
  };

  const handlePaymentClose = () => {
    console.log("Payment modal closed");
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

            <FlutterwavePayment
              amount={plan.price}
              email="user@example.com"
              phone="254700000000"
              name="EduAid User"
              planId={plan.id}
              onSuccess={(response) => handlePaymentSuccess(response, plan)}
              onClose={handlePaymentClose}
            />
          </div>
        ))}
      </div>

      <div className="payment-info">
        <p>💳 Secure payment powered by Flutterwave</p>
        <p>🔒 Cancel anytime • 7-day money-back guarantee</p>
      </div>
    </div>
  );
};

export default PaymentGateway;
