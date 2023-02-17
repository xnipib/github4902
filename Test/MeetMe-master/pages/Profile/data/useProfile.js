import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "../../../http";

export function useProfile() {
  return useQuery(
    ["profile"],
    async () => {
      return http
        .get("/me")
        .then((res) => {
          return res?.data?.data;
        })
        .catch((err) => {
          return {};
        });
    },
    {
      staleTime: Infinity,
    }
  );
}

export function useUpdateProfile(opt) {
  return useMutation(
    (user) => {
      return http.post(`/me`, user, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

export function useToggleVisibility(opt) {
  return useMutation(
    (location_visible) => {
      return http.put(`/location/visibility`, {
        location_visible,
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

export function useUpdateLocation(opt) {
  return useMutation(
    (location) => {
      return http.put(`/location`, { location });
    },
    {
      ...opt,
      onSuccess: (data) => {
        opt?.onSuccess?.(data);
      },
    }
  );
}
