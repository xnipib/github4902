import { useQuery } from "@tanstack/react-query";
import { http } from "../../../http";

export function useSearchUsers(keyword) {
  return useQuery(
    ["users-search", keyword],
    async () => {
      return http
        .get("/social/search", {
          params: {
            email: keyword,
          },
        })
        .then((res) => {
          return res?.data?.data;
        })
        .catch((err) => {
          return [];
        });
    },
    {
      staleTime: Infinity,
      initialData: [],
    }
  );
}
