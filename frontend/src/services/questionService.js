import api from './api.js';

export const questionService = {
  async getQuestions(params = {}) {
    const response = await api.get('/questions', { params });
    return response.data;
  },

  async getQuestionById(id) {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  async createQuestion(data) {
    const response = await api.post('/questions', data);
    return response.data;
  },

  async updateQuestion(id, data) {
    const response = await api.put(`/questions/${id}`, data);
    return response.data;
  },

  async deleteQuestion(id) {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },

  async updateProgress(questionId, status) {
    const response = await api.put(`/questions/${questionId}/progress`, { status });
    return response.data;
  },

  async updateNotes(questionId, notes) {
    const response = await api.put(`/questions/${questionId}/notes`, { notes });
    return response.data;
  },

  async toggleFavorite(questionId) {
    const response = await api.put(`/questions/${questionId}/favorite`);
    return response.data;
  },
};
