const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

exports.initiatePayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  try {
    const { planId, amount, currency } = data;
    const userId = context.auth.uid;

    // IntaSend API configuration
    const intasendConfig = {
      headers: {
        Authorization: `Bearer ${functions.config().intasend.api_key}`,
        "Content-Type": "application/json",
      },
    };

    // Create payment request
    const paymentData = {
      amount: amount,
      currency: currency,
      email: context.auth.token.email,
      phone_number: context.auth.token.phone_number,
      api_ref: `eduaid_${userId}_${Date.now()}`,
      method: "M-PESA", // or 'CARD'
      redirect_url: `${functions.config().app.base_url}/payment-success`,
    };

    const response = await axios.post(
      "https://sandbox.intasend.com/api/v1/payment/mpesa-stk-push/",
      paymentData,
      intasendConfig
    );

    // Store payment record
    await admin.firestore().collection("payments").add({
      userId: userId,
      planId: planId,
      amount: amount,
      currency: currency,
      intasendId: response.data.id,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { paymentUrl: response.data.payment_url };
  } catch (error) {
    console.error("Payment initiation error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to initiate payment"
    );
  }
});
