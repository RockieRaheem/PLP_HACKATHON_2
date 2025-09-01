import React, { useState, useEffect } from "react";
import "./ModernPremium.css";

const ModernPremium = ({ userId }) => {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [currentPlan, setCurrentPlan] = useState("free");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

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
  }, [userId]);

  // Cycle through testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      originalPrice: 0,
      description: "Perfect for getting started",
      popular: false,
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
        "No priority support",
      ],
    },
    {
      id: "student",
      name: "Student",
      price: billingCycle === "monthly" ? 799 : 7990,
      originalPrice: billingCycle === "monthly" ? 1299 : 12990,
      description: "Most popular for students",
      popular: true,
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

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Learning",
      description:
        "Get instant answers and explanations from our advanced AI tutor",
    },
    {
      icon: "📚",
      title: "Smart Study Materials",
      description: "AI-organized content that adapts to your learning style",
    },
    {
      icon: "📊",
      title: "Progress Analytics",
      description: "Track your learning journey with detailed insights",
    },
    {
      icon: "🎯",
      title: "Personalized Plans",
      description: "Custom study schedules based on your goals and pace",
    },
    {
      icon: "📱",
      title: "Mobile Learning",
      description: "Study anywhere with our responsive mobile platform",
    },
    {
      icon: "👥",
      title: "Community Support",
      description: "Connect with fellow learners and study groups",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Wanjiku",
      role: "University of Nairobi Student",
      content:
        "EduAid helped me improve my grades by 40%. The AI tutor explains concepts so clearly!",
      rating: 5,
      image: "👩‍🎓",
    },
    {
      name: "David Mwangi",
      role: "High School Student",
      content:
        "The study planner is amazing. I never miss assignments anymore and my stress is way down.",
      rating: 5,
      image: "👨‍🎓",
    },
    {
      name: "Grace Akinyi",
      role: "Medical Student",
      content:
        "PDF analysis saved me hours of study time. It highlights exactly what I need to focus on.",
      rating: 5,
      image: "👩‍⚕️",
    },
  ];

  const handleSubscribe = async (plan) => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Save subscription to localStorage
      const subscriptionData = {
        plan: plan.id,
        startDate: new Date().toISOString(),
        endDate: new Date(
          Date.now() +
            (billingCycle === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
        ).toISOString(),
        billingCycle: billingCycle,
        amount: plan.price,
      };

      localStorage.setItem(
        `subscription_${userId}`,
        JSON.stringify(subscriptionData)
      );
      setCurrentPlan(plan.id);

      // Show success message
      alert(`Successfully subscribed to ${plan.name} plan!`);
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Subscription failed. Please try again.");
    }
    setIsProcessing(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDiscount = (originalPrice, currentPrice) => {
    if (originalPrice === currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <div className="modern-premium">
      {/* Header Section */}
      <div className="premium-header">
        <div className="header-content">
          <div className="header-main">
            <div className="page-title">
              <div className="title-icon">💎</div>
              <div>
                <h1>Premium Plans</h1>
                <p>Unlock your full learning potential with EduAid Premium</p>
              </div>
            </div>

            <div className="billing-toggle">
              <span className={billingCycle === "monthly" ? "active" : ""}>
                Monthly
              </span>
              <div
                className="toggle-switch"
                onClick={() =>
                  setBillingCycle(
                    billingCycle === "monthly" ? "yearly" : "monthly"
                  )
                }
              >
                <div
                  className={`toggle-slider ${
                    billingCycle === "yearly" ? "yearly" : ""
                  }`}
                ></div>
              </div>
              <span className={billingCycle === "yearly" ? "active" : ""}>
                Yearly
                <span className="discount-badge">Save 35%</span>
              </span>
            </div>
          </div>

          {currentPlan !== "free" && (
            <div className="current-plan-info">
              <div className="plan-status">
                <span className="status-icon">✅</span>
                <span>
                  Currently on {plans.find((p) => p.id === currentPlan)?.name}{" "}
                  plan
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="premium-content">
        {/* Plans Section */}
        <div className="plans-section">
          <div className="plans-grid">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`plan-card ${plan.popular ? "popular" : ""} ${
                  currentPlan === plan.id ? "current" : ""
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="popular-badge">Most Popular</div>
                )}
                {currentPlan === plan.id && (
                  <div className="current-badge">Current Plan</div>
                )}

                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <p className="plan-description">{plan.description}</p>

                  <div className="plan-pricing">
                    {plan.price > 0 ? (
                      <>
                        <div className="price-main">
                          <span className="currency">KES</span>
                          <span className="amount">
                            {billingCycle === "monthly"
                              ? plan.price
                              : (plan.price / 10).toFixed(0)}
                          </span>
                          <span className="period">
                            /{billingCycle === "monthly" ? "month" : "year"}
                          </span>
                        </div>
                        {getDiscount(plan.originalPrice, plan.price) > 0 && (
                          <div className="price-discount">
                            <span className="original-price">
                              {formatPrice(plan.originalPrice)}
                            </span>
                            <span className="discount-percent">
                              {getDiscount(plan.originalPrice, plan.price)}% off
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="price-main">
                        <span className="amount">Free</span>
                        <span className="period">forever</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="plan-features">
                  <ul>
                    {plan.features.map((feature, index) => (
                      <li key={index} className="feature-included">
                        <span className="feature-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="feature-limited">
                        <span className="feature-icon">✗</span>
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="plan-action">
                  {currentPlan === plan.id ? (
                    <button className="plan-btn current-plan-btn" disabled>
                      Current Plan
                    </button>
                  ) : (
                    <button
                      className={`plan-btn ${
                        plan.popular ? "primary" : "secondary"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (plan.id === "free") {
                          // Handle downgrade to free
                          setCurrentPlan("free");
                          localStorage.removeItem(`subscription_${userId}`);
                        } else {
                          handleSubscribe(plan);
                        }
                      }}
                      disabled={isProcessing}
                    >
                      {isProcessing
                        ? "Processing..."
                        : plan.id === "free"
                        ? "Downgrade"
                        : "Upgrade Now"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="comparison-toggle">
            <button
              className="comparison-btn"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? "Hide" : "Show"} Detailed Comparison
            </button>
          </div>

          {showComparison && (
            <div className="detailed-comparison">
              <h3>Feature Comparison</h3>
              <div className="comparison-table">
                <div className="comparison-header">
                  <div className="feature-column">Features</div>
                  {plans.map((plan) => (
                    <div key={plan.id} className="plan-column">
                      {plan.name}
                    </div>
                  ))}
                </div>

                <div className="comparison-body">
                  {[
                    "AI Conversations",
                    "PDF Analysis",
                    "Study Planner",
                    "Progress Analytics",
                    "Past Papers",
                    "Priority Support",
                    "Voice Calls",
                    "Group Sessions",
                  ].map((feature, index) => (
                    <div key={index} className="comparison-row">
                      <div className="feature-name">{feature}</div>
                      <div className="feature-value">Limited</div>
                      <div className="feature-value">✓</div>
                      <div className="feature-value">✓ Premium</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="premium-sidebar">
          {/* Features Highlight */}
          <div className="sidebar-section">
            <h3>Why Choose Premium?</h3>
            <div className="features-list">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="feature-content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="sidebar-section">
            <h3>Student Success Stories</h3>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-header">
                  <div className="student-avatar">
                    {testimonials[testimonialIndex].image}
                  </div>
                  <div className="student-info">
                    <h4>{testimonials[testimonialIndex].name}</h4>
                    <p>{testimonials[testimonialIndex].role}</p>
                  </div>
                </div>
                <div className="testimonial-text">
                  "{testimonials[testimonialIndex].content}"
                </div>
                <div className="testimonial-rating">
                  {"⭐".repeat(testimonials[testimonialIndex].rating)}
                </div>
              </div>

              <div className="testimonial-dots">
                {testimonials.map((_, index) => (
                  <div
                    key={index}
                    className={`dot ${
                      index === testimonialIndex ? "active" : ""
                    }`}
                    onClick={() => setTestimonialIndex(index)}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="sidebar-section">
            <div className="guarantee-card">
              <div className="guarantee-icon">🛡️</div>
              <h3>30-Day Money Back Guarantee</h3>
              <p>
                Not satisfied? Get a full refund within 30 days, no questions
                asked.
              </p>
            </div>
          </div>

          {/* Contact Support */}
          <div className="sidebar-section">
            <div className="support-card">
              <div className="support-icon">💬</div>
              <h3>Need Help Choosing?</h3>
              <p>
                Our education specialists are here to help you find the perfect
                plan.
              </p>
              <button className="contact-btn">Chat with Support</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bottom-cta">
        <div className="cta-content">
          <h2>Ready to Transform Your Learning Journey?</h2>
          <p>
            Join thousands of students who have already unlocked their potential
            with EduAid Premium
          </p>
          <div className="cta-actions">
            <button
              className="cta-primary"
              onClick={() =>
                handleSubscribe(plans.find((p) => p.id === "student"))
              }
              disabled={isProcessing}
            >
              Start Free Trial
            </button>
            <button className="cta-secondary">View All Features</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernPremium;
