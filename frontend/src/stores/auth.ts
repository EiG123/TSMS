import { defineStore } from 'pinia';
import { AuthApiService } from '../services/auth.api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null as any,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  
  actions: {
    async login(email: string, password: string) {
      try {
        const data = await AuthApiService.login(email, password);
        
        this.token = data.token;
        this.user = data.user;
        
        // เก็บ token ใน localStorage (สำหรับ persistence)
        localStorage.setItem('token', data.token);
        
        return { success: true, data };
      } catch (error: any) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Login failed' 
        };
      }
    },
    
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
    
    // เรียกตอน app init
    initAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        // อาจจะต้อง validate token หรือ fetch user data
      }
    }
  }
});