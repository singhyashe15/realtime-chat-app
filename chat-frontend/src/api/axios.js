import axios from "axios";
const server_url = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: `${server_url}`,
  withCredentials: true
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response && error.response.status === 401) {
      console.log("Unauthorized");

      localStorage.removeItem("token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;