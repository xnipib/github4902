import { useMutation } from "@tanstack/react-query";
import { http } from "../../../http";

export function useRegister(opt) {
  return useMutation(
    (credentials) => {
      return http.post("/register", credentials);
    },
    {
      ...opt,
    }
  );
}
