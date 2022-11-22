import { useQuery, useMutation } from "@tanstack/react-query";
import { http } from "../../../http";

export function useFollowingList() {
  return useQuery(
    ["following"],
    async () => {
      return http.get("/social/followings").then((res) => res?.data?.data);
    },
    {
      staleTime: Infinity,
    }
  );
}

export function useUnFollow(opt) {
  return useMutation(
    ({ id }) => {
      return http.delete(`social/follow/${id}`);
    },
    {
      ...opt,
      onSuccess: (data) => {
        opt?.onSuccess?.(data);
      },
    }
  );
}

export function useFollow(opt) {
  return useMutation(
    ({ id }) => {
      return http.post(`social/follow/${id}`, {});
    },
    {
      ...opt,
      onSuccess: (data) => {
        opt?.onSuccess?.(data);
      },
    }
  );
}
