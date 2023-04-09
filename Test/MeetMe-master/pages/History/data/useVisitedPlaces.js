import { useQuery } from "@tanstack/react-query";

import { http } from "../../../http";

export function useVisitedPlaces() {
  return useQuery(
    ["visited-locations"],
    async () => {
      return http.get("/visited-locations").then((res) => res?.data?.data);
    },
    {
      staleTime: Infinity,
    }
  );
}
