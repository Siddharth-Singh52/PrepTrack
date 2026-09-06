import api from './api.js';

export const placementService = {
  async getPlacements(params = {}) {
    const response = await api.get('/placements', { params });
    return response.data;
  },

  async createPlacement(data) {
    const response = await api.post('/placements', data);
    return response.data;
  },

  async updatePlacement(id, data) {
    const response = await api.put(`/placements/${id}`, data);
    return response.data;
  },

  async deletePlacement(id) {
    const response = await api.delete(`/placements/${id}`);
    return response.data;
  },
};
