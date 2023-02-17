import axios from "axios";
import * as SecureStore from "expo-secure-store";

const http = axios.create({
  baseURL:
    "https://3094-2a02-8109-ae3f-ce38-741a-f583-34a2-b6bd.eu.ngrok.io/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { http };
