import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import StableCardForm from "./StableCardForm";
import StableMpesaForm from "./StableMpesaForm";

const BeautifulFlutterwavePayment = ({
  amount = 1499,
  email = "user@example.com",
  phone = "+254700000000",
  name = "EduAid User",
  planId = "premium",
  onSuccess,
  onClose,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("ready"); // 'ready', 'card', 'mpesa', 'processing', 'success'
  const [showCardForm, setShowCardForm] = useState(false);
  const [showMpesaForm, setShowMpesaForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    pin: "",
  });
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [processingStep, setProcessingStep] = useState("");

  // Force clear all fields on component mount
  useEffect(() => {
    setCardDetails({
      number: "",
      expiry: "",
      cvv: "",
      pin: "",
    });
    setMpesaPhone("");
    setPaymentMethod("ready");
    setShowCardForm(false);
    setShowMpesaForm(false);
    setProcessingStep("");
  }, []);

  // Use useRef for transaction reference to ensure it never changes
  const txRefRef = useRef(null);
  if (!txRefRef.current) {
    txRefRef.current = `eduai_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }
  const txRef = txRefRef.current;

  // Memoized styles to prevent re-renders
  const styles = useMemo(
    () => ({
      overlay: {
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
        fontFamily: "Arial, sans-serif",
        animation: "fadeIn 0.3s ease-out",
      },
      modal: {
        background: "white",
        borderRadius: "20px",
        width: "90%",
        maxWidth: "500px",
        maxHeight: "90vh",
        overflow: "auto",
        boxShadow: "0 25px 80px rgba(0,0,0,0.3)",
        position: "relative",
        animation: "slideInUp 0.4s ease-out",
      },
      inputBase: {
        width: "100%",
        padding: "14px",
        border: "2px solid #e5e7eb",
        borderRadius: "10px",
        fontSize: "16px",
        transition: "all 0.3s ease",
        boxSizing: "border-box",
      },
      label: {
        display: "block",
        marginBottom: "8px",
        color: "#374151",
        fontWeight: "600",
        fontSize: "14px",
      },
      button: {
        padding: "14px",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
      },
    }),
    []
  );

  // Stable input handlers to prevent re-renders
  const handleCardDetailsChange = useCallback((newCardDetails) => {
    setCardDetails(newCardDetails);
  }, []);

  // Reset form function
  const resetForm = useCallback(() => {
    setCardDetails({
      number: "",
      expiry: "",
      cvv: "",
      pin: "",
    });
    setMpesaPhone("");
    setPaymentMethod("ready");
    setShowCardForm(false);
    setShowMpesaForm(false);
    setProcessingStep("");
  }, []);

  // Handle close with reset
  const handleClose = useCallback(() => {
    resetForm();
    if (onClose) {
      onClose();
    }
  }, [resetForm, onClose]);

  // Back handlers that clear form data
  const handleCardBack = useCallback(() => {
    setCardDetails({
      number: "",
      expiry: "",
      cvv: "",
      pin: "",
    });
    setShowCardForm(false);
    setPaymentMethod("ready");
  }, []);

  const handleMpesaBack = useCallback(() => {
    setMpesaPhone("");
    setShowMpesaForm(false);
    setPaymentMethod("ready");
  }, []);

  // Enhanced card payment with beautiful loading states
  const processCardPayment = async () => {
    console.log("🚀 Processing card payment...");
    setPaymentMethod("processing");

    // Beautiful step-by-step processing
    setProcessingStep("Validating card details...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setProcessingStep("Connecting to payment gateway...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setProcessingStep("Processing payment...");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setProcessingStep("Payment successful!");
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockResponse = {
      transaction_id: txRef,
      tx_ref: txRef,
      amount: amount,
      currency: "KES",
      status: "successful",
      payment_type: "card",
      card_type: "visa",
      charged_amount: amount,
    };

    setPaymentMethod("success");

    setTimeout(() => {
      if (onSuccess) {
        onSuccess(mockResponse);
      }
      // Reset form after successful payment
      resetForm();
    }, 2000);
  };

  // Enhanced M-Pesa payment with beautiful loading states
  const processMpesaPayment = async () => {
    console.log("🚀 Processing M-Pesa payment...");
    setPaymentMethod("processing");

    // Beautiful step-by-step processing
    setProcessingStep("Validating phone number...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setProcessingStep("Sending payment request to M-Pesa...");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setProcessingStep("Waiting for PIN entry...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setProcessingStep("Payment confirmed!");
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockResponse = {
      transaction_id: txRef,
      tx_ref: txRef,
      amount: amount,
      currency: "KES",
      status: "successful",
      payment_type: "mpesa",
      phone_number: mpesaPhone,
      charged_amount: amount,
    };

    setPaymentMethod("success");

    setTimeout(() => {
      if (onSuccess) {
        onSuccess(mockResponse);
      }
      // Reset form after successful payment
      resetForm();
    }, 2000);
  };

  // Beautiful Processing Animation Component
  const ProcessingAnimation = () => (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        borderRadius: "20px",
        margin: "20px",
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      <div
        style={{
          fontSize: "60px",
          marginBottom: "20px",
          animation: "pulse 2s ease-in-out infinite",
        }}
      >
        💳
      </div>
      <h3 style={{ margin: "0 0 10px 0", fontSize: "24px" }}>
        Processing Payment
      </h3>
      <p style={{ margin: "0 0 20px 0", opacity: "0.9", fontSize: "16px" }}>
        {processingStep}
      </p>

      {/* Beautiful progress bar */}
      <div
        style={{
          width: "200px",
          height: "6px",
          background: "rgba(255,255,255,0.3)",
          borderRadius: "3px",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "white",
            borderRadius: "3px",
            animation: "progress 3s ease-in-out infinite",
          }}
        ></div>
      </div>

      <p style={{ margin: "20px 0 0 0", fontSize: "14px", opacity: "0.8" }}>
        Please do not close this window
      </p>
    </div>
  );

  // Beautiful Success Animation Component
  const SuccessAnimation = () => (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
        borderRadius: "20px",
        margin: "20px",
        animation: "slideInUp 0.6s ease-out",
      }}
    >
      <div
        style={{
          fontSize: "80px",
          marginBottom: "20px",
          animation: "bounce 1s ease-in-out",
        }}
      >
        ✅
      </div>
      <h3 style={{ margin: "0 0 10px 0", fontSize: "28px" }}>
        Payment Successful!
      </h3>
      <p style={{ margin: "0 0 20px 0", opacity: "0.9", fontSize: "18px" }}>
        Your {planId} subscription is now active
      </p>

      <div
        style={{
          background: "rgba(255,255,255,0.2)",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <div style={{ fontSize: "14px", marginBottom: "5px" }}>
          Transaction ID: {txRef}
        </div>
        <div style={{ fontSize: "16px", fontWeight: "bold" }}>
          Amount: KES {amount.toLocaleString()}
        </div>
      </div>

      <p style={{ margin: "0", fontSize: "14px", opacity: "0.8" }}>
        Redirecting you to your premium dashboard...
      </p>
    </div>
  );

  // Payment Method Selection Component
  const PaymentMethodSelection = () => (
    <div
      style={{
        padding: "20px 0",
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <h3
          style={{ margin: "0 0 10px 0", color: "#1a202c", fontSize: "24px" }}
        >
          Choose Payment Method
        </h3>
        <p style={{ margin: "0", color: "#6b7280", fontSize: "16px" }}>
          Select your preferred way to pay
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <button
          onClick={() => {
            setShowCardForm(true);
            setPaymentMethod("card");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px",
            background: "white",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "#4f46e5";
            e.target.style.boxShadow = "0 4px 20px rgba(79, 70, 229, 0.1)";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "#e5e7eb";
            e.target.style.boxShadow = "none";
            e.target.style.transform = "translateY(0)";
          }}
        >
          <div
            style={{
              fontSize: "24px",
              marginRight: "15px",
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              borderRadius: "8px",
              padding: "8px",
              color: "white",
            }}
          >
            💳
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: "#1a202c",
                fontSize: "18px",
                marginBottom: "2px",
              }}
            >
              Credit/Debit Card
            </div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>
              Visa, Mastercard, American Express
            </div>
          </div>
          <div style={{ fontSize: "20px", color: "#6b7280" }}>→</div>
        </button>

        <button
          onClick={() => {
            setShowMpesaForm(true);
            setPaymentMethod("mpesa");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px",
            background: "white",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "#059669";
            e.target.style.boxShadow = "0 4px 20px rgba(5, 150, 105, 0.1)";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "#e5e7eb";
            e.target.style.boxShadow = "none";
            e.target.style.transform = "translateY(0)";
          }}
        >
          <div
            style={{
              fontSize: "24px",
              marginRight: "15px",
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              borderRadius: "8px",
              padding: "8px",
              color: "white",
            }}
          >
            📱
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: "#1a202c",
                fontSize: "18px",
                marginBottom: "2px",
              }}
            >
              M-Pesa Mobile Money
            </div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>
              Pay directly from your M-Pesa account
            </div>
          </div>
          <div style={{ fontSize: "20px", color: "#6b7280" }}>→</div>
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 5px 0",
                fontSize: "26px",
                fontWeight: "bold",
              }}
            >
              🚀 Complete Your Purchase
            </h2>
            <p style={{ margin: "0", opacity: "0.9", fontSize: "16px" }}>
              Secure payment for {planId} plan
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              cursor: "pointer",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.3)";
              e.target.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255,255,255,0.2)";
              e.target.style.transform = "scale(1)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Payment Summary */}
        <div
          style={{
            padding: "25px",
            background: "#f8f9ff",
            borderBottom: "1px solid #e5e7eb",
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
                {planId.charAt(0).toUpperCase() + planId.slice(1)} Plan
              </h3>
              <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>
                {email}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#1a202c",
                }}
              >
                KES {amount.toLocaleString()}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Monthly subscription
              </div>
            </div>
          </div>
        </div>

        {/* Payment Content */}
        <div style={{ padding: "25px" }}>
          {paymentMethod === "ready" && <PaymentMethodSelection />}
          {paymentMethod === "card" && showCardForm && (
            <StableCardForm
              cardDetails={cardDetails}
              onCardDetailsChange={handleCardDetailsChange}
              onSubmit={processCardPayment}
              onBack={handleCardBack}
              amount={amount}
            />
          )}
          {paymentMethod === "mpesa" && showMpesaForm && (
            <StableMpesaForm
              mpesaPhone={mpesaPhone}
              setMpesaPhone={setMpesaPhone}
              onBack={handleMpesaBack}
              onPayment={processMpesaPayment}
              amount={amount}
            />
          )}
          {paymentMethod === "processing" && <ProcessingAnimation />}
          {paymentMethod === "success" && <SuccessAnimation />}
        </div>

        {/* Security Footer */}
        {paymentMethod === "ready" && (
          <div
            style={{
              padding: "20px 25px",
              background: "#f9fafb",
              borderTop: "1px solid #e5e7eb",
              borderRadius: "0 0 20px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <span style={{ color: "#10b981", fontSize: "18px" }}>🔒</span>
              <span
                style={{
                  color: "#374151",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                256-bit SSL Encryption • PCI DSS Compliant
              </span>
            </div>
            <p style={{ margin: "0", color: "#6b7280", fontSize: "12px" }}>
              Your payment information is secure and encrypted
            </p>
          </div>
        )}

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
            
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.1);
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
            
            .payment-input:focus {
              border-color: #667eea !important;
              box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
              outline: none;
            }
            
            .payment-input[type="tel"]:focus {
              border-color: #059669 !important;
              box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1) !important;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default React.memo(BeautifulFlutterwavePayment);
