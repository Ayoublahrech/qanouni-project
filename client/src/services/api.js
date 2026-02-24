import axios from 'axios';

const API_URL = 'https://determined-education-production-e2a4.up.railway.app';

export const sendMessage = async (message, userId = 'anonymous') => {
  try {
    const response = await axios.post(`${API_URL}/api/chat`, {
      message,
      userId
    });
    return response.data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};
