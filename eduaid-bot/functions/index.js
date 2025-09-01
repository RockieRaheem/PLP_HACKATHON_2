/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const OpenAI = require("openai");
const cors = require("cors")({ origin: true });

admin.initializeApp();

const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

// Chat with OpenAI (Callable function for Firebase SDK)
exports.sendChatMessage = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  try {
    const { message, context: userContext, language } = data;

    const systemPrompt = `You are EduAid Bot, an AI tutor specifically designed for African students. 
    Your role is to provide educational support tailored to African curricula (WAEC, KCSE, Matric, etc.).
    
    Guidelines:
    - Explain concepts in simple, clear language
    - Use examples relevant to African contexts
    - Support local languages when requested (Swahili, Yoruba, etc.)
    - Focus on practical, exam-oriented explanations
    - Be encouraging and supportive
    
    Current context: ${userContext}
    Response language: ${language}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    // Log the interaction for analytics
    await admin.firestore().collection("chat_logs").add({
      userId: context.auth.uid,
      message: message,
      response: completion.choices[0].message.content,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { response: completion.choices[0].message.content };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to process message"
    );
  }
});

// CORS-enabled HTTP endpoint for frontend direct fetch
exports.sendChatMessageHttp = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      // Optionally, verify authentication here if needed
      const { message, context: userContext, language } = req.body;
      const systemPrompt = `You are EduAid Bot, an AI tutor specifically designed for African students. 
      Your role is to provide educational support tailored to African curricula (WAEC, KCSE, Matric, etc.).
      
      Guidelines:
      - Explain concepts in simple, clear language
      - Use examples relevant to African contexts
      - Support local languages when requested (Swahili, Yoruba, etc.)
      - Focus on practical, exam-oriented explanations
      - Be encouraging and supportive
      
      Current context: ${userContext}
      Response language: ${language}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      // Log the interaction for analytics
      await admin.firestore().collection("chat_logs").add({
        message: message,
        response: completion.choices[0].message.content,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.set("Access-Control-Allow-Origin", "*");
      res.status(200).json({ response: completion.choices[0].message.content });
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.set("Access-Control-Allow-Origin", "*");
      res.status(500).json({ error: "Failed to process message" });
    }
  });
});

// Generate Study Plan
exports.generateStudyPlan = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  try {
    const { subjects, studyHoursPerDay, preferredStudyTimes } = data;

    const prompt = `Create a detailed 7-day study plan for the following subjects: ${subjects
      .map((s) => s.name)
      .join(", ")}.
    
    Requirements:
    - ${studyHoursPerDay} hours of study per day
    - Preferred study times: ${preferredStudyTimes.join(", ")}
    - Focus on African curriculum standards
    - Include specific topics and time allocation
    - Prioritize subjects with upcoming exams
    
    Return as a JSON array with objects containing: date, subject, topic, duration`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an educational planner for African students.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.5,
    });

    // Try to parse the JSON response, fallback to demo data if parsing fails
    let plan;
    try {
      plan = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      // Fallback to demo plan
      plan = [
        {
          date: "Today",
          subject: subjects[0]?.name || "Mathematics",
          topic: "Algebra Review",
          duration: "2 hours",
        },
        {
          date: "Tomorrow",
          subject: subjects[0]?.name || "Mathematics",
          topic: "Geometry Practice",
          duration: "1.5 hours",
        },
      ];
    }

    return { plan };
  } catch (error) {
    console.error("Study plan generation error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to generate study plan"
    );
  }
});

// Process PDF Document
exports.processPdfDocument = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  try {
    const { fileUrl } = data;

    // For demo purposes, return mock analysis
    // In production, you would use PDF parsing libraries like pdf-parse
    const mockAnalysis =
      "This document appears to be about mathematics concepts including algebra and geometry. Key topics identified: quadratic equations, triangular properties, and coordinate geometry.";

    return {
      extractedText: "Sample extracted text from PDF...",
      analysis: mockAnalysis,
    };
  } catch (error) {
    console.error("PDF processing error:", error);
    throw new functions.https.HttpsError("internal", "Failed to process PDF");
  }
});

// Initialize Payment with IntaSend
exports.initiatePayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  try {
    const { planId, amount, currency } = data;

    // For demo purposes, return mock payment URL
    // In production, integrate with IntaSend API
    const mockPaymentUrl = `https://sandbox.intasend.com/checkout/${planId}`;

    // Log payment initiation
    await admin.firestore().collection("payment_logs").add({
      userId: context.auth.uid,
      planId,
      amount,
      currency,
      status: "initiated",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { paymentUrl: mockPaymentUrl };
  } catch (error) {
    console.error("Payment initiation error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to initiate payment"
    );
  }
});
