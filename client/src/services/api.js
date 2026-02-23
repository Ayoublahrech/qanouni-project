import axios from 'axios';

const API_URL = 'http://localhost:5000';  // Retirons le /api

export const sendMessage = async (message, userId = 'anonymous') => {
  try {
    // Essayons d'abord la route DeepSeek qui fonctionne
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
