import api from './api'

export const cowService = {
  async register(formData) {
    const response = await api.post('/cows/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async getAll() {
    const response = await api.get('/cows/')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/cows/${id}`)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/cows/${id}`)
    return response.data
  },
}
