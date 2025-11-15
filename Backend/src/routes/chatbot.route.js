import express from "express";
import { chatWithBot } from "../controllers/chatbot.controller.js";

const router = express.Router();

// POST route for chatbot messages
router.post("/chat", chatWithBot);

export default router;
