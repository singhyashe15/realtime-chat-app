import axios from "axios";
const server_url = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: `${server_url}`,
  withCredentials: true
});

export default api;