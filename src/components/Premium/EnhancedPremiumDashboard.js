import React, { useState, useEffect, useCallback, useMemo } from "react";
import BeautifulFlutterwavePayment from "../Payment/BeautifulFlutterwavePayment";

const EnhancedPremiumDashboard = ({ userId }) => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [currentPlan, setCurrentPlan] = useState("free");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [animateCards, setAnimateCards] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [showUpgradeAnimation, setShowUpgradeAnimation] = useState(false);
  const [paymentKey, setPaymentKey] = useState(0);

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
      id: "basic",
      name: "Basic",
      price: billingCycle === "monthly" ? 999 : 9990,
      originalPrice: billingCycle === "monthly" ? 1499 : 14990,
      description: "Great for regular learners",
      popular: false,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      icon: "📚",
      features: [
        "50 AI conversations per day",
        "PDF document analysis",
        "Advanced study plans",
        "Progress analytics",
        "Priority email support",
        "Offline mode",
      ],
      limitations: ["Limited advanced features"],
    },
    {
      id: "premium",
      name: "Premium",
      price: billingCycle === "monthly" ? 1499 : 14990,
      originalPrice: billingCycle === "monthly" ? 2499 : 24990,
      description: "Best value for serious students",
      popular: true,
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      icon: "🚀",
      features: [
        "Unlimited AI conversations",
        "Advanced PDF analysis with summaries",
        "Personalized learning paths",
        "Detailed analytics & insights",
        "24/7 priority support",
        "Advanced study planning",
        "Export study materials",
        "Study group collaboration",
      ],
      limitations: [],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: billingCycle === "monthly" ? 2999 : 29990,
      originalPrice: billingCycle === "monthly" ? 4999 : 49990,
      description: "For institutions and teams",
      popular: false,
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      icon: "🏢",
      features: [
        "Everything in Premium",
        "Team management dashboard",
        "Bulk user management",
        "Custom branding",
        "Advanced reporting",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
      ],
      limitations: [],
    },
  ];

  const switchToPlan = (plan) => {
    if (plan.id === "free") {
      setCurrentPlan("free");
      localStorage.removeItem(`subscription_${userId}`);

      // Show professional downgrade confirmation
      setSuccessData({
        type: "downgrade",
        planName: "Free",
        message: "You have successfully switched to the Free plan.",
        icon: "🆓",
      });
      setShowSuccessModal(true);
      return;
    }

    setSelectedPlan(plan);
    setPaymentKey((prev) => prev + 1); // Force fresh component
    setShowPayment(true);
  };

  const handlePaymentSuccess = useCallback(
    (response) => {
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

      // Show beautiful success animation
      setShowUpgradeAnimation(true);
      setTimeout(() => {
        setShowUpgradeAnimation(false);
        setSuccessData({
          type: "upgrade",
          planName: selectedPlan.name,
          planIcon: selectedPlan.icon,
          amount: selectedPlan.price,
          billingCycle: billingCycle,
          transactionId: response.transaction_id,
          features: selectedPlan.features.slice(0, 4), // Show first 4 features
          message: `Welcome to ${selectedPlan.name}! Your premium features are now active.`,
        });
        setShowSuccessModal(true);
      }, 2000);
    },
    [selectedPlan, billingCycle, userId]
  );

  const handlePaymentClose = useCallback(() => {
    setShowPayment(false);
    setSelectedPlan(null);
  }, []);

  // Memoized payment props to prevent re-renders
  const paymentProps = useMemo(
    () => ({
      amount: selectedPlan?.price || 0,
      email: "user@example.com",
      phone: "+254700000000",
      name: "EduAI User",
      planId: selectedPlan?.id || "",
    }),
    [selectedPlan]
  );

  const getCurrentPlanData = () => {
    return plans.find((plan) => plan.id === currentPlan) || plans[0];
  };

  // Professional Success Modal Component
  const SuccessModal = () => (
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
        zIndex: 10000,
        animation: "fadeIn 0.3s ease-out",
      }}
      onClick={() => setShowSuccessModal(false)}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "0",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 25px 80px rgba(0,0,0,0.3)",
          overflow: "hidden",
          animation: "slideInUp 0.4s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div
          style={{
            background:
              successData?.type === "upgrade"
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            padding: "30px",
            textAlign: "center",
            color: "white",
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "10px" }}>
            {successData?.type === "upgrade" ? "🎉" : "✅"}
          </div>
          <h2 style={{ margin: "0 0 10px 0", fontSize: "28px" }}>
            {successData?.type === "upgrade"
              ? "Subscription Activated!"
              : "Plan Changed!"}
          </h2>
          <p style={{ margin: "0", opacity: "0.9", fontSize: "16px" }}>
            {successData?.message}
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: "30px" }}>
          {successData?.type === "upgrade" && (
            <>
              {/* Plan Details */}
              <div
                style={{
                  background: "#f8f9ff",
                  padding: "20px",
                  borderRadius: "12px",
                  marginBottom: "25px",
                  border: "2px dashed #667eea",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: "0 0 5px 0",
                        color: "#667eea",
                        fontSize: "20px",
                      }}
                    >
                      {successData.planIcon} {successData.planName} Plan
                    </h3>
                    <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                      Transaction: {successData.transactionId}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#1a202c",
                      }}
                    >
                      KES {successData.amount?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {successData.billingCycle}
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Preview */}
              <div style={{ marginBottom: "25px" }}>
                <h4
                  style={{
                    margin: "0 0 15px 0",
                    color: "#1a202c",
                    textAlign: "center",
                  }}
                >
                  🌟 You now have access to:
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  {successData.features?.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        background: "#e6fffa",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #81e6d9",
                        fontSize: "13px",
                        color: "#234e52",
                        textAlign: "center",
                      }}
                    >
                      ✅ {feature}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                flex: 1,
                padding: "12px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🚀 Start Using Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Upgrade Animation Component
  const UpgradeAnimation = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      <div style={{ textAlign: "center", color: "white" }}>
        <div
          style={{
            fontSize: "80px",
            marginBottom: "20px",
            animation: "bounce 1s ease-in-out infinite",
          }}
        >
          🚀
        </div>
        <h2 style={{ margin: "0 0 10px 0", fontSize: "32px" }}>
          Upgrading Your Account...
        </h2>
        <p style={{ margin: "0", opacity: "0.9", fontSize: "18px" }}>
          Activating your premium features
        </p>
        <div
          style={{
            width: "200px",
            height: "4px",
            background: "rgba(255,255,255,0.3)",
            borderRadius: "2px",
            margin: "30px auto",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "white",
              borderRadius: "2px",
              animation: "progress 2s ease-in-out",
            }}
          ></div>
        </div>
      </div>
    </div>
  );

  const PlanCard = ({ plan, index }) => (
    <div
      className={`plan-card ${plan.popular ? "popular" : ""} ${
        plan.id === currentPlan ? "current" : ""
      }`}
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "0",
        boxShadow: plan.popular
          ? "0 8px 30px rgba(250, 112, 154, 0.3)"
          : "0 4px 20px rgba(0,0,0,0.1)",
        position: "relative",
        transform: animateCards
          ? "translateY(0) scale(1)"
          : `translateY(50px) scale(0.9)`,
        opacity: animateCards ? 1 : 0,
        transition: `all 0.6s ease-out ${index * 0.1}s`,
        border:
          plan.id === currentPlan ? "3px solid #4ade80" : "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            color: "white",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 2,
          }}
        >
          ⭐ MOST POPULAR
        </div>
      )}

      {/* Current Plan Badge */}
      {plan.id === currentPlan && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: "#4ade80",
            color: "white",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 2,
          }}
        >
          ✅ CURRENT PLAN
        </div>
      )}

      {/* Header with gradient */}
      <div
        style={{
          background: plan.gradient,
          padding: "30px 24px 20px",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "10px" }}>
          {plan.icon}
        </div>
        <h3
          style={{ margin: "0 0 5px 0", fontSize: "24px", fontWeight: "bold" }}
        >
          {plan.name}
        </h3>
        <p style={{ margin: "0", opacity: "0.9", fontSize: "14px" }}>
          {plan.description}
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: "24px" }}>
        {/* Pricing */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {plan.originalPrice > plan.price && (
              <span
                style={{
                  fontSize: "16px",
                  color: "#9ca3af",
                  textDecoration: "line-through",
                }}
              >
                KES {plan.originalPrice.toLocaleString()}
              </span>
            )}
            <span
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#1a202c",
              }}
            >
              KES {plan.price.toLocaleString()}
            </span>
          </div>
          <div style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
            per {billingCycle === "monthly" ? "month" : "year"}
          </div>
          {plan.originalPrice > plan.price && (
            <div
              style={{
                fontSize: "12px",
                color: "#16a34a",
                fontWeight: "bold",
                marginTop: "4px",
              }}
            >
              Save{" "}
              {Math.round(
                ((plan.originalPrice - plan.price) / plan.originalPrice) * 100
              )}
              %
            </div>
          )}
        </div>

        {/* Features */}
        <div style={{ marginBottom: "24px" }}>
          <h4
            style={{
              margin: "0 0 12px 0",
              fontSize: "14px",
              color: "#374151",
              fontWeight: "600",
            }}
          >
            ✨ FEATURES INCLUDED:
          </h4>
          {plan.features.map((feature, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#4b5563",
              }}
            >
              <span
                style={{
                  color: "#10b981",
                  marginRight: "8px",
                  fontSize: "16px",
                }}
              >
                ✅
              </span>
              {feature}
            </div>
          ))}
        </div>

        {/* Limitations */}
        {plan.limitations.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <h4
              style={{
                margin: "0 0 12px 0",
                fontSize: "14px",
                color: "#6b7280",
                fontWeight: "600",
              }}
            >
              ⚠️ LIMITATIONS:
            </h4>
            {plan.limitations.map((limitation, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                <span
                  style={{
                    color: "#f59e0b",
                    marginRight: "8px",
                    fontSize: "16px",
                  }}
                >
                  ⚠️
                </span>
                {limitation}
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => switchToPlan(plan)}
          disabled={plan.id === currentPlan}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: plan.id === currentPlan ? "default" : "pointer",
            background:
              plan.id === currentPlan
                ? "#e5e7eb"
                : plan.popular
                ? "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                : plan.gradient,
            color: plan.id === currentPlan ? "#6b7280" : "white",
            transition: "all 0.3s ease",
            transform: "scale(1)",
          }}
          onMouseEnter={(e) => {
            if (plan.id !== currentPlan) {
              e.target.style.transform = "scale(1.02)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }
          }}
          onMouseLeave={(e) => {
            if (plan.id !== currentPlan) {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }
          }}
        >
          {plan.id === currentPlan
            ? "✅ Current Plan"
            : plan.id === "free"
            ? "Switch to Free"
            : `Upgrade to ${plan.name}`}
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 16px 0",
          }}
        >
          🚀 EduAI Premium Plans
        </h1>
        <p
          style={{
            fontSize: "20px",
            color: "#6b7280",
            margin: "0 0 30px 0",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Unlock the full potential of AI-powered learning with our premium
          features
        </p>

        {/* Billing Toggle */}
        <div
          style={{
            display: "inline-flex",
            background: "white",
            borderRadius: "12px",
            padding: "4px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <button
            onClick={() => setBillingCycle("monthly")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              background:
                billingCycle === "monthly"
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "transparent",
              color: billingCycle === "monthly" ? "white" : "#6b7280",
              fontSize: "16px",
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
              borderRadius: "8px",
              border: "none",
              background:
                billingCycle === "yearly"
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "transparent",
              color: billingCycle === "yearly" ? "white" : "#6b7280",
              fontSize: "16px",
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
              SAVE 33%
            </span>
          </button>
        </div>
      </div>

      {/* Current Plan Info */}
      {currentPlan !== "free" && (
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto 40px",
            background: "white",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            border: "2px solid #4ade80",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3
                style={{
                  margin: "0 0 5px 0",
                  color: "#16a34a",
                  fontSize: "18px",
                }}
              >
                ✅ Your Current Plan: {getCurrentPlanData().name}
              </h3>
              <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>
                Enjoying premium features • Active subscription
              </p>
            </div>
            <div style={{ fontSize: "32px" }}>{getCurrentPlanData().icon}</div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {plans.map((plan, index) => (
          <PlanCard key={plan.id} plan={plan} index={index} />
        ))}
      </div>

      {/* Feature Comparison */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "60px auto 0",
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            margin: "0 0 30px 0",
            fontSize: "32px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ✨ Why Choose EduAI Premium?
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
          }}
        >
          {[
            {
              icon: "🤖",
              title: "Advanced AI Tutoring",
              description:
                "Get personalized explanations and help with complex topics using cutting-edge AI technology.",
            },
            {
              icon: "📊",
              title: "Detailed Analytics",
              description:
                "Track your learning progress with comprehensive insights and performance metrics.",
            },
            {
              icon: "📚",
              title: "Unlimited Resources",
              description:
                "Access unlimited study materials, practice questions, and educational content.",
            },
            {
              icon: "⚡",
              title: "Priority Support",
              description:
                "Get instant help from our expert team whenever you need assistance.",
            },
          ].map((benefit, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                {benefit.icon}
              </div>
              <h3
                style={{
                  margin: "0 0 12px 0",
                  color: "#1a202c",
                  fontSize: "20px",
                }}
              >
                {benefit.title}
              </h3>
              <p
                style={{
                  margin: "0",
                  color: "#6b7280",
                  fontSize: "16px",
                  lineHeight: "1.5",
                }}
              >
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <BeautifulFlutterwavePayment
          key={`payment-${paymentKey}`}
          {...paymentProps}
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && successData && <SuccessModal />}

      {/* Upgrade Animation */}
      {showUpgradeAnimation && <UpgradeAnimation />}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-20px);
            }
            60% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes progress {
            from { 
              transform: translateX(-100%);
            }
            to { 
              transform: translateX(0);
            }
          }
          
          .plan-card:hover {
            transform: translateY(-8px) scale(1.02) !important;
            box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
          }
          
          .plan-card.popular {
            transform: scale(1.05);
          }
          
          .plan-card.current {
            box-shadow: 0 8px 30px rgba(74, 222, 128, 0.3) !important;
          }
        `}
      </style>
    </div>
  );
};

export default EnhancedPremiumDashboard;
