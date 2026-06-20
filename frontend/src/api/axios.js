import axios from "axios";

const api = axios.create({
  baseURL: "http://44.204.213.108:3000/api",
  timeout: 5000
});

export default api;