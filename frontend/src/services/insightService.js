import api from './api.js';

export const insightService = {
  async getInsights() {
    const response = await api.get('/insights');
    return response.data;
  },
};
