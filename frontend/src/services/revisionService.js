import api from './api.js';

export const revisionService = {
  async getRevisions() {
    const response = await api.get('/revisions');
    return response.data;
  },

  async completeRevision(questionId) {
    const response = await api.post(`/revisions/${questionId}/complete`);
    return response.data;
  },
};
