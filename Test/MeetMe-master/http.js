import axios from "axios";
import * as SecureStore from "expo-secure-store";

const http = axios.create({
  baseURL:
    "https://b81a-2a02-8109-ae3f-ce38-2941-303f-5a19-f431.ngrok-free.app/api",
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
