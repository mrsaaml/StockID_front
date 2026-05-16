import api from './api'

export const verifyService = {
  async verify(formData) {
    const response = await api.post('/verify/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async getHistory() {
    const response = await api.get('/verify/history')
    return response.data
  },
}
