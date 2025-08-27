const functions = require("firebase-functions");
const admin = require("firebase-admin");
const OpenAI = require("openai");

admin.initializeApp();

const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

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
