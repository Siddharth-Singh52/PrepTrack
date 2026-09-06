import api from './api.js';

export const resumeService = {
  async analyzeResume(file) {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getHistory() {
    const response = await api.get('/resume/history');
    return response.data;
  },
};
