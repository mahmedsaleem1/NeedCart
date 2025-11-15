import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Controller for handling chatbot messages
export const chatWithBot = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build context for the chatbot about NeedCart
    const systemContext = `You are a helpful assistant for NeedCart, an e-commerce marketplace platform. 
NeedCart connects buyers and sellers, allowing users to:
- Browse and purchase products
- List items for sale
- Create and engage with community posts
- Make offers on products
- Leave reviews and ratings
- Track orders and transactions
- Use secure payment methods including Stripe
- Manage wishlists

You should help users with:
- Product inquiries
- How to buy or sell items
- Account and dashboard questions
- Payment and order issues
- General platform navigation
- Post and community features

Be friendly, helpful, and concise in your responses.`;

    // Build the conversation context
    let prompt = systemContext + "\n\n";
    
    // Add conversation history if available
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg) => {
        prompt += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n`;
      });
    }
    
    // Add current message
    prompt += `User: ${message}\nAssistant:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      response: text,
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process chat message",
      error: error.message,
    });
  }
};
