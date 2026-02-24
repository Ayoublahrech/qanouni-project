const express = require('express');
const cors = require('cors');

// Ne charge dotenv qu'en développement
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
app.use(cors());
app.use(express.json());

// Routes Gemini
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Route de test
app.get('/test', (req, res) => {
  res.json({ message: 'Qanouni API fonctionne !' });
});

const PORT = process.env.PORT || 5000;
app.get('/debug-env', (req, res) => {
  res.json({
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    // On ne renvoie pas la clé elle-même par sécurité !
  });
});
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`- Gemini: /api/chat`);
});
