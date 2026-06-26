import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

// Handle responses globally
api.interceptors.response.use(
  (response) => response,

  (error) => {

    if (
      error.response?.status === 403 &&
      error.response?.data?.message ===
        "Restaurant suspended by admin"
    ) {

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert(
        "Your restaurant has been suspended by the admin."
      );

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;