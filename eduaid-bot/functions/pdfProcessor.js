const functions = require("firebase-functions");
const admin = require("firebase-admin");
const pdf = require("pdf-parse");
const axios = require("axios");

exports.processPdfDocument = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  try {
    const { fileUrl } = data;

    // Download PDF from Firebase Storage
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    // Extract text from PDF
    const pdfData = await pdf(buffer);
    const extractedText = pdfData.text;

    // Analyze content with OpenAI
    const analysis = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Analyze this educational document and provide a summary suitable for an African student. 
        Identify key topics, concepts, and potential study questions.
        
        Document content: ${extractedText.substring(0, 3000)}`,
        },
      ],
      max_tokens: 300,
    });

    // Store in Firestore
    await admin.firestore().collection("processed_documents").add({
      userId: context.auth.uid,
      originalText: extractedText,
      analysis: analysis.choices[0].message.content,
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      extractedText: extractedText.substring(0, 1000), // Limit for frontend
      analysis: analysis.choices[0].message.content,
    };
  } catch (error) {
    console.error("PDF processing error:", error);
    throw new functions.https.HttpsError("internal", "Failed to process PDF");
  }
});
