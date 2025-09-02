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

    // Flutterwave API configuration
    const flutterwaveConfig = {
      headers: {
        Authorization: `Bearer FLWSECK_TEST-Q3d6O6dYUJX1vseBPRPWgfHrzDAl9ACs-X`,
        "Content-Type": "application/json",
      },
    };

    // Create payment request for Flutterwave
    const paymentData = {
      tx_ref: `eduaid_${userId}_${Date.now()}`,
      amount: amount,
      currency: currency,
      redirect_url: `${
        functions.config().app.base_url || "http://localhost:3002"
      }/payment-success`,
      customer: {
        email: context.auth.token.email || "user@example.com",
        phonenumber: context.auth.token.phone_number || "254700000000",
        name: context.auth.token.name || "EduAid User",
      },
      customizations: {
        title: "EduAid Premium Subscription",
        description: `Payment for ${planId} plan`,
        logo: "https://eduaid-bot.web.app/logo192.png",
      },
    };

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      paymentData,
      flutterwaveConfig
    );

    // Store payment record
    await admin.firestore().collection("payments").add({
      userId: userId,
      planId: planId,
      amount: amount,
      currency: currency,
      flutterwaveRef: response.data.data.id,
      txRef: paymentData.tx_ref,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      paymentUrl: response.data.data.link,
      reference: paymentData.tx_ref,
    };
  } catch (error) {
    console.error("Payment initiation error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to initiate payment"
    );
  }
});

exports.verifyPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  try {
    const { transaction_id } = data;

    // Flutterwave verification
    const flutterwaveConfig = {
      headers: {
        Authorization: `Bearer FLWSECK_TEST-Q3d6O6dYUJX1vseBPRPWgfHrzDAl9ACs-X`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      flutterwaveConfig
    );

    if (
      response.data.status === "success" &&
      response.data.data.status === "successful"
    ) {
      // Update payment record
      const paymentQuery = await admin
        .firestore()
        .collection("payments")
        .where("txRef", "==", response.data.data.tx_ref)
        .get();

      if (!paymentQuery.empty) {
        const paymentDoc = paymentQuery.docs[0];
        await paymentDoc.ref.update({
          status: "completed",
          flutterwaveTransactionId: transaction_id,
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      return { verified: true, data: response.data.data };
    } else {
      return { verified: false, message: "Payment verification failed" };
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to verify payment"
    );
  }
});
