import { defineStore } from "pinia";
import { AuthApiService } from "../services/auth.api";

interface User {
  username: string;
  email: string;
  role: string;
  region: string;
  company: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") as string | null,
    user: null as User | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,

    username: (state) => state.user?.username,
    email: (state) => state.user?.email,
    role: (state) => state.user?.role,
    region: (state) => state.user?.region,
    company: (state) => state.user?.company,
  },

  actions: {
    async login(email: string, password: string) {
      const data = await AuthApiService.login(email, password);

      this.token = data.token;
      this.user = data.user;

      // persistence
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    initAuth() {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
      }
    },
  },
});
