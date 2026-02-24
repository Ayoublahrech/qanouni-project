const express = require('express');
const cors = require('cors');

// Ne charge dotenv qu'en développement
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Route de test ULTRA SIMPLE (la première)
app.get('/test', (req, res) => {
  console.log("🔥 ROUTE /test APPELÉE");
  res.json({ message: 'Qanouni API fonctionne !' });
});

// Route ping ultra simple
app.get('/ping', (req, res) => {
  console.log("🏓 ROUTE /ping APPELÉE");
  res.json({ message: 'pong' });
});

// Route debug
app.get('/debug', (req, res) => {
  res.json({
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd(),
    files: require('fs').readdirSync('.')
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur FINAL démarré sur http://localhost:${PORT}`);
  console.log(`📌 Routes disponibles:`);
  console.log(`   - /test`);
  console.log(`   - /ping`);
  console.log(`   - /debug`);
  console.log(`   - /api/chat`);
});
