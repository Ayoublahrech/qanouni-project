const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes Gemini (uniquement)
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Route de test
app.get('/test', (req, res) => {
  res.json({ message: 'Qanouni API fonctionne !' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`- Gemini: /api/chat`);
});
