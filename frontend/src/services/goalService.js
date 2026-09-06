import api from './api.js';

export const goalService = {
  async getGoals() {
    const response = await api.get('/goals');
    return response.data;
  },

  async createGoal(data) {
    const response = await api.post('/goals', data);
    return response.data;
  },

  async updateGoal(id, data) {
    const response = await api.put(`/goals/${id}`, data);
    return response.data;
  },

  async deleteGoal(id) {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },
};
