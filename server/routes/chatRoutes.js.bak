const express = require("express")
const router = express.Router()
const axios = require("axios")
const Conversation = require("../models/Conversation")
const protect = require("../middleware/authMiddleware")

// CREATE CHAT
router.post("/", protect, async (req, res) => {
  try {
    const { message } = req.body

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: "Tu es QANOUNI, expert en droit marocain. Cite les articles de loi." },
              { text: message }
            ]
          }
        ]
      }
    )

    const reply = response.data.candidates[0].content.parts[0].text

    const conversation = new Conversation({
      user: req.user.id,
      messages: [
        { role: "user", content: message },
        { role: "assistant", content: reply }
      ]
    })

    await conversation.save()

    res.json({ reply })

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
})


// GET USER CONVERSATIONS
router.get("/history", protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({ user: req.user.id })
      .sort({ createdAt: -1 })

    res.json(conversations)

  } catch (error) {
    res.status(500).json({ message: "Erreur récupération historique" })
  }
})

module.exports = router
