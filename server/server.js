const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes Gemini
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Routes DeepSeek (AJOUTE CES LIGNES)
const chatRoutesDeepseek = require('./routes/chatRoutes-deepseek');
app.use('/api/chat-deepseek', chatRoutesDeepseek);

// Route de test
app.get('/test', (req, res) => {
  res.json({ message: 'Qanouni API fonctionne !' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`- Gemini: /api/chat`);
  console.log(`- DeepSeek: /api/chat-deepseek`);
});
