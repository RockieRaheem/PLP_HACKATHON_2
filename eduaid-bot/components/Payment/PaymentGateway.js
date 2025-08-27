import { useState } from "react";
import { httpsCallable } from "firebase/functions";

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
      <h2>Upgrade to Premium</h2>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.name}</h3>
            <p className="price">KES {plan.price}/month</p>
            <ul>
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handlePayment(plan)}
              disabled={isProcessing}
              className="subscribe-btn"
            >
              {isProcessing ? "Processing..." : `Subscribe to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
