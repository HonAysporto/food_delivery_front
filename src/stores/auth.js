import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    async register(form) {
      const res = await api.post("/register", form);

      this.token = res.data.token;
      localStorage.setItem("token", this.token);

      await this.fetchUser();
    },

    async login(form) {
      const res = await api.post("/login", form);

      this.token = res.data.token;
      localStorage.setItem("token", this.token);

      // IMPORTANT: set user immediately (prevents UI flicker)
      this.user = res.data.user;
      localStorage.setItem("user", JSON.stringify(this.user));

      // still refresh from backend to stay consistent
      await this.fetchUser();
    },

  async fetchUser() {
  try {
    const res = await api.get("/user");

    this.user = res.data;
    localStorage.setItem("user", JSON.stringify(res.data));
  } catch (error) {
    console.log("Fetch User Error:");
    console.log(error);
    console.log(error.response);
    console.log(error.response?.data);

   
    this.logout();
  }
},

async googleLogin(token) {
  this.token = token;

  localStorage.setItem("token", token);

  await this.fetchUser();
},

    logout() {
      this.user = null;
      this.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});