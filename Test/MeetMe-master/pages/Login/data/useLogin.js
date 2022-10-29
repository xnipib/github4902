import { useMutation } from "@tanstack/react-query";
import { http } from "../../../http";

import * as SecureStore from "expo-secure-store";

export function useLogin(opt) {
  return useMutation(
    (credentials) => {
      return http.post("/login", credentials);
    },
    {
      ...opt,
      onSuccess: async (data) => {
        const token = data.data.token;
        await SecureStore.setItemAsync("token", token ?? "");

        await opt?.onSuccess?.(token);
      },
    }
  );
}
