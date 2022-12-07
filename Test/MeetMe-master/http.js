import axios from "axios";
import * as SecureStore from "expo-secure-store";

const http = axios.create({
  baseURL: "https://d833-156-216-46-228.eu.ngrok.io/api",
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
