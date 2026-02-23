const express = require("express");
const router = express.Router();
const axios = require("axios");
const Conversation = require("../models/Conversation");
const protect = require("../middleware/authMiddleware");

console.log("✅ chatRoutes-deepseek.js chargé ! (Mode OpenRouter - Auto:free)");

// Configuration OpenRouter
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Prompt système
const SYSTEM_PROMPT = `Tu es QANOUNI, un assistant juridique IA spécialisé dans le droit du Royaume du Maroc.
Ton rôle est de fournir des informations juridiques générales basées sur des sources officielles.

RÈGLES:
1. Cite les articles de loi (ex: Code du Travail, article 14) quand c'est possible.
2. Ne donne pas de conseils juridiques personnalisés.
3. Réponds en français, de façon claire.`;

// Route principale
router.post("/", async (req, res) => {
  console.log("🔥 Route POST /api/chat-deepseek atteinte !");
  console.log("Body reçu:", req.body);

  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message requis" });
    }

    if (!OPENROUTER_API_KEY) {
      console.error("❌ Clé API OpenRouter manquante !");
      return res.status(500).json({ message: "Clé API OpenRouter non configurée" });
    }

    console.log("🔑 Clé OpenRouter trouvée");
    console.log("🌐 Appel au routeur gratuit OpenRouter...");

    // Appel à OpenRouter avec le modèle "free" qui choisit automatiquement
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "openrouter/free",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
        temperature: 0.3,
        max_tokens: 1000
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "Qanouni Test"
        },
        timeout: 15000
      }
    );

    console.log("✅ Réponse reçue d'OpenRouter, status:", response.status);
    const reply = response.data.choices[0].message.content;
    console.log("📄 Réponse (premiers 100 caractères):", reply.substring(0, 100));

    res.json({
      reply,
      model: "openrouter-free"
    });

  } catch (error) {
    console.error("❌ Erreur OpenRouter:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message
    });
  }
});

module.exports = router;
