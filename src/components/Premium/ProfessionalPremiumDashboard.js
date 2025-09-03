import React, { useState, useEffect } from "react";
import WorkingFlutterwavePayment from "../Payment/WorkingFlutterwavePayment";

const ProfessionalPremiumDashboard = ({ userId }) => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [currentPlan, setCurrentPlan] = useState("free");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [animateCards, setAnimateCards] = useState(false);

  // Load user's current subscription status
  useEffect(() => {
    const loadUserSubscription = () => {
      const subscription = localStorage.getItem(`subscription_${userId}`);
      if (subscription) {
        const subData = JSON.parse(subscription);
        setCurrentPlan(subData.plan);
      }
    };

    if (userId) {
      loadUserSubscription();
    }

    // Trigger card animation
    setTimeout(() => setAnimateCards(true), 500);
  }, [userId]);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      originalPrice: 0,
      description: "Perfect for getting started",
      popular: false,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      icon: "🆓",
      features: [
        "5 AI conversations per day",
        "Basic study materials",
        "Simple progress tracking",
        "Community support",
        "Mobile app access",
      ],
      limitations: [
        "Limited AI interactions",
        "No PDF analysis",
        "Basic analytics only",
      ],
    },
    {
      id: "student",
      name: "Student",
      price: billingCycle === "monthly" ? 799 : 7990,
      originalPrice: billingCycle === "monthly" ? 1299 : 12990,
      description: "Most popular for students",
      popular: true,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      icon: "🎓",
      features: [
        "Unlimited AI conversations",
        "Advanced PDF analysis",
        "Smart study planner",
        "Progress analytics",
        "Past papers library",
        "Priority email support",
        "Offline study materials",
        "Custom study schedules",
      ],
      limitations: [],
    },
    {
      id: "premium",
      name: "Premium",
      price: billingCycle === "monthly" ? 1499 : 14990,
      originalPrice: billingCycle === "monthly" ? 2299 : 22990,
      description: "Everything for serious learners",
      popular: false,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      icon: "👑",
      features: [
        "Everything in Student plan",
        "AI tutor voice calls",
        "Live group study sessions",
        "Personal academic advisor",
        "24/7 priority support",
        "Advanced analytics & insights",
        "University application help",
        "Career guidance sessions",
        "Exam stress management",
        "Custom AI study assistant",
      ],
      limitations: [],
    },
  ];

  const handleSubscribe = async (plan) => {
    if (plan.id === "free") {
      setCurrentPlan("free");
      localStorage.removeItem(`subscription_${userId}`);

      // Show success animation
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        alert("✅ Switched to Free plan successfully!");
      }, 1500);
      return;
    }

    // For paid plans, open payment modal
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (response) => {
    console.log("🎉 Payment successful:", response);

    // Update user subscription
    const subscriptionData = {
      plan: selectedPlan.id,
      planName: selectedPlan.name,
      amount: selectedPlan.price,
      billingCycle: billingCycle,
      transactionId: response.transaction_id,
      startDate: new Date().toISOString(),
      status: "active",
    };

    localStorage.setItem(
      `subscription_${userId}`,
      JSON.stringify(subscriptionData)
    );
    setCurrentPlan(selectedPlan.id);
    setShowPayment(false);

    // Show success animation and message
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(
        `🎉 Welcome to ${selectedPlan.name}! Your premium features are now active.`
      );
    }, 2000);
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    setSelectedPlan(null);
  };

  const getCurrentPlanData = () => {
    return plans.find((plan) => plan.id === currentPlan) || plans[0];
  };

  const PlanCard = ({ plan, index }) => (
    <div
      className={`plan-card ${plan.popular ? "popular" : ""} ${
        currentPlan === plan.id ? "current" : ""
      } ${animateCards ? "animate-in" : ""}`}
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "30px",
        margin: "10px",
        boxShadow: plan.popular
          ? "0 20px 60px rgba(0,0,0,0.2)"
          : "0 10px 40px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden",
        transform: animateCards ? "translateY(0)" : "translateY(50px)",
        opacity: animateCards ? 1 : 0,
        transition: `all 0.6s ease ${index * 0.2}s`,
        border:
          currentPlan === plan.id ? "3px solid #4facfe" : "1px solid #e2e8f0",
      }}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div
          style={{
            position: "absolute",
            top: "-1px",
            left: "-1px",
            right: "-1px",
            height: "4px",
            background: plan.gradient,
            borderRadius: "20px 20px 0 0",
          }}
        />
      )}

      {/* Header with icon and name */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "10px" }}>
          {plan.icon}
        </div>
        <h3
          style={{
            margin: "0 0 5px 0",
            fontSize: "28px",
            fontWeight: "bold",
            background: plan.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {plan.name}
        </h3>
        <p
          style={{
            margin: "0",
            color: "#64748b",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          {plan.description}
        </p>
      </div>

      {/* Pricing */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        {plan.price > 0 ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  color: "#1a202c",
                }}
              >
                KES {plan.price.toLocaleString()}
              </span>
              {plan.originalPrice > plan.price && (
                <span
                  style={{
                    fontSize: "18px",
                    color: "#94a3b8",
                    textDecoration: "line-through",
                  }}
                >
                  {plan.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#64748b",
                marginTop: "5px",
              }}
            >
              per {billingCycle === "monthly" ? "month" : "year"}
              {billingCycle === "yearly" && (
                <span
                  style={{
                    color: "#10b981",
                    fontWeight: "bold",
                    marginLeft: "8px",
                  }}
                >
                  Save {Math.round((1 - plan.price / plan.originalPrice) * 100)}
                  %
                </span>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#1a202c",
            }}
          >
            Free Forever
          </div>
        )}
      </div>

      {/* Features */}
      <div style={{ marginBottom: "25px" }}>
        <h4
          style={{
            margin: "0 0 15px 0",
            color: "#1a202c",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          ✨ What's included:
        </h4>
        <ul
          style={{
            listStyle: "none",
            padding: "0",
            margin: "0",
          }}
        >
          {plan.features.map((feature, idx) => (
            <li
              key={idx}
              style={{
                padding: "8px 0",
                color: "#4a5568",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ color: "#10b981", fontSize: "16px" }}>✅</span>
              {feature}
            </li>
          ))}
        </ul>

        {plan.limitations.length > 0 && (
          <div style={{ marginTop: "15px" }}>
            <h5
              style={{
                margin: "0 0 10px 0",
                color: "#64748b",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Limitations:
            </h5>
            <ul
              style={{
                listStyle: "none",
                padding: "0",
                margin: "0",
              }}
            >
              {plan.limitations.map((limitation, idx) => (
                <li
                  key={idx}
                  style={{
                    padding: "4px 0",
                    color: "#94a3b8",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span style={{ color: "#f56565", fontSize: "14px" }}>❌</span>
                  {limitation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action button */}
      <button
        onClick={() => handleSubscribe(plan)}
        disabled={isProcessing || currentPlan === plan.id}
        style={{
          width: "100%",
          padding: "16px",
          background:
            currentPlan === plan.id
              ? "#10b981"
              : plan.popular
              ? plan.gradient
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: currentPlan === plan.id ? "default" : "pointer",
          transition: "all 0.3s ease",
          opacity: isProcessing ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (currentPlan !== plan.id && !isProcessing) {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "none";
        }}
      >
        {currentPlan === plan.id ? (
          <>✅ Current Plan</>
        ) : isProcessing ? (
          <>⏳ Processing...</>
        ) : plan.price === 0 ? (
          <>Start Free</>
        ) : (
          <>🚀 Upgrade to {plan.name}</>
        )}
      </button>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            margin: "0 0 10px 0",
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          🚀 Choose Your Plan
        </h1>
        <p
          style={{
            fontSize: "20px",
            opacity: "0.9",
            margin: "0 0 30px 0",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Unlock your learning potential with our premium features designed for
          academic success
        </p>

        {/* Billing cycle toggle */}
        <div
          style={{
            background: "rgba(255,255,255,0.2)",
            borderRadius: "50px",
            padding: "8px",
            display: "inline-flex",
            backdropFilter: "blur(10px)",
          }}
        >
          <button
            onClick={() => setBillingCycle("monthly")}
            style={{
              padding: "12px 24px",
              borderRadius: "50px",
              border: "none",
              background: billingCycle === "monthly" ? "white" : "transparent",
              color: billingCycle === "monthly" ? "#667eea" : "white",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            style={{
              padding: "12px 24px",
              borderRadius: "50px",
              border: "none",
              background: billingCycle === "yearly" ? "white" : "transparent",
              color: billingCycle === "yearly" ? "#667eea" : "white",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              position: "relative",
            }}
          >
            Yearly
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "#10b981",
                color: "white",
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "10px",
                fontWeight: "bold",
              }}
            >
              SAVE
            </span>
          </button>
        </div>
      </div>

      {/* Current plan status */}
      {currentPlan !== "free" && (
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "30px",
            textAlign: "center",
            color: "white",
            backdropFilter: "blur(10px)",
            maxWidth: "600px",
            margin: "0 auto 30px auto",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>
            🎉 You're currently on the {getCurrentPlanData().name} plan!
          </h3>
          <p style={{ margin: "0", opacity: "0.9" }}>
            Enjoy all your premium features and exclusive benefits
          </p>
        </div>
      )}

      {/* Plans grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {plans.map((plan, index) => (
          <PlanCard key={plan.id} plan={plan} index={index} />
        ))}
      </div>

      {/* Benefits section */}
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "40px",
          marginTop: "50px",
          textAlign: "center",
          color: "white",
          backdropFilter: "blur(10px)",
          maxWidth: "800px",
          margin: "50px auto 0 auto",
        }}
      >
        <h2 style={{ margin: "0 0 30px 0", fontSize: "32px" }}>
          🌟 Why Choose EduAI Premium?
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "30px",
          }}
        >
          {[
            {
              icon: "🤖",
              title: "AI-Powered Learning",
              desc: "Advanced AI that adapts to your learning style",
            },
            {
              icon: "📚",
              title: "Comprehensive Resources",
              desc: "Access to thousands of study materials",
            },
            {
              icon: "📊",
              title: "Progress Tracking",
              desc: "Detailed analytics to monitor your growth",
            },
            {
              icon: "🎯",
              title: "Personalized Plans",
              desc: "Custom study schedules tailored for you",
            },
            {
              icon: "🏆",
              title: "Exam Success",
              desc: "Proven methods to boost your grades",
            },
            {
              icon: "💬",
              title: "24/7 Support",
              desc: "Get help whenever you need it",
            },
          ].map((benefit, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>
                {benefit.icon}
              </div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
                {benefit.title}
              </h4>
              <p style={{ margin: "0", opacity: "0.8", fontSize: "14px" }}>
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <WorkingFlutterwavePayment
          amount={selectedPlan.price}
          email={`user${userId}@eduai.com`}
          phone="+254700000000"
          name="EduAI User"
          planId={selectedPlan.id}
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}

      {/* Processing overlay */}
      {isProcessing && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10001,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                border: "6px solid #e5e7eb",
                borderTop: "6px solid #667eea",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            />
            <h3 style={{ margin: "0", color: "#1a202c" }}>
              Processing your request...
            </h3>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .plan-card {
            transition: all 0.3s ease;
          }
          
          .plan-card:hover {
            transform: translateY(-5px) !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
          }
          
          .plan-card.popular {
            transform: scale(1.05);
          }
          
          .plan-card.current {
            transform: scale(1.02);
          }
          
          .animate-in {
            animation: slideInUp 0.6s ease-out forwards;
          }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(50px);
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
};

export default ProfessionalPremiumDashboard;
