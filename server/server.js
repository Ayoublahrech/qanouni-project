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

// Route de test simple (ne dépend de rien)
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Route de test standard
app.get('/test', (req, res) => {
  res.json({ message: 'Qanouni API fonctionne !' });
});

// Route de debug basique
app.get('/debug-env', (req, res) => {
  res.json({
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    nodeEnv: process.env.NODE_ENV,
  });
});

// Route de debug détaillée
app.get('/debug-env-all', (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    port: process.env.PORT,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`- Ping: /ping`);
  console.log(`- Test: /test`);
  console.log(`- Gemini: /api/chat`);
  console.log(`- Debug: /debug-env, /debug-env-all`);
});
