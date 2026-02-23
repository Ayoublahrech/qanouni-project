const mongoose = require("mongoose")

const conversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  messages: [
    {
      role: String,
      content: String
    }
  ]
}, { timestamps: true })

module.exports = mongoose.model("Conversation", conversationSchema)
