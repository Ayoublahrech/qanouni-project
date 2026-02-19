import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>QANOUNI</h1>
      <p>Assistant Juridique Intelligent Marocain</p>
      <Link to="/chat">
        <button>Accéder au Chat</button>
      </Link>
    </div>
  )
}
