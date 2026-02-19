import { useEffect, useState } from "react"
import axios from "axios"

export default function Dashboard() {

  const [conversations, setConversations] = useState([])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await axios.get("http://localhost:5000/api/chat/history", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setConversations(res.data)

      } catch (error) {
        console.error(error)
      }
    }

    fetchHistory()
  }, [])

  return (
    <div style={{ padding: "40px" }}>
      <h2>Mon Historique</h2>

      {conversations.length === 0 && <p>Aucune conversation trouvée.</p>}

      {conversations.map((conv) => (
        <div key={conv._id} style={{
          border: "1px solid #ddd",
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "8px"
        }}>
          {conv.messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.role}:</strong>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
      ))}

    </div>
  )
}
