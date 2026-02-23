import axios from 'axios';

// Utilise une variable d'environnement, ou localhost en développement
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const sendMessage = async (message, userId = 'anonymous') => {
  try {
    const response = await axios.post(`${API_URL}/api/chat-deepseek`, {
      message,
      userId
    });
    return response.data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};
