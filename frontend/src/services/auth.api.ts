import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const AuthApiService = {
  async login(email: string, pass: string) {
    const response = await api.post('/login', { email, password: pass });
    return response.data;
  }
};