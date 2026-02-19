import { useState } from "react"
import axios from "axios"

export default function Chat() {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")

  const sendMessage = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: message
      })
      setResponse(res.data.reply)
    } catch (err) {
      console.error(err)
      setResponse("Erreur serveur")
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Chat Qanouni</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Pose ta question juridique..."
        rows="4"
        style={{ width: "100%" }}
      />
      <br /><br />
      <button onClick={sendMessage}>Envoyer</button>
      <br /><br />
      <div>
        <strong>Réponse :</strong>
        <p>{response}</p>
      </div>
    </div>
  )
}
