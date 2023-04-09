import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "../../../http";

export function useNearbyLocations({ latitude, longitude, keyword } = {}) {
  return useQuery(
    ["nearby-locations ", latitude, longitude, keyword],

    async ({ queryKey: [, latitude, longitude, keyword] }) => {
      return http
        .get("/nearby", {
          params: {
            latitude,
            longitude,
            keyword,
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
      enabled: !!latitude && !!longitude && !!keyword,
    }
  );
}

export function useMeetUser(opt) {
  return useMutation(
    ({ user, location, address, name, photo_url }) => {
      return http.post(`/mark-visited`, {
        visited_with: user?.id,
        latitude: location?.latitude,
        longitude: location?.longitude,
        address,
        name,
        photo_url,
      });
    },
    {
      ...opt,
      onSuccess: (data) => {
        opt?.onSuccess?.(data);
      },
    }
  );
}
