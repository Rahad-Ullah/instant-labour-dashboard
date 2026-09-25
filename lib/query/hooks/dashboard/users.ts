import { IUser, IUserFilterableFields } from "@/types/users";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../keys";

import { UserApis } from "../../apis/user";
import { toast } from "react-toastify";

export const useGetAllUser = (params = {} as IUserFilterableFields) => {
  return useQuery({
    queryKey: queryKeys.dashboard.users(params),
    queryFn: async () => {
      const response = await UserApis.geAllUser(params);

      let data: IUser[] = [];
      let meta = response?.meta;

      if (Array.isArray(response?.data)) {
        data = response.data;
      } else if (Array.isArray((response?.data as any)?.data)) {
        data = (response.data as any).data;
        meta = (response.data as any)?.meta || meta;
      } else if (Array.isArray(response)) {
        data = response as any;
      }

      return {
        data,
        meta,
      };
    },
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: true,
  });
};

export const useGetVerificationRequests = (
  params = {} as IUserFilterableFields,
) => {
  return useQuery({
    queryKey: queryKeys.dashboard.verifyRequests(params),
    queryFn: async () => {
      const response = await UserApis.getAllVerificationRequests(params);

      let data: IUser[] = [];
      let meta = response?.meta;

      if (Array.isArray(response?.data)) {
        data = response.data;
      } else if (Array.isArray((response?.data as any)?.data)) {
        data = (response.data as any).data;
        meta = (response.data as any)?.meta || meta;
      } else if (Array.isArray(response)) {
        data = response as any;
      }

      return {
        data,
        meta,
      };
    },
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: true,
  });
};

export const useGetUserDetail = (id: string) => {
  return useQuery({
    queryKey: ["dashboard", "users", "detail", id],
    queryFn: async () => {
      const data = await UserApis.getUserDetail(id);
      return data.data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateUserStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["dashboard", "users", "updateStatus", id],
    mutationFn: async (userId: string) => {
      const data = await UserApis.updateUserStatus(userId);
      return data.data;
    },
    onSuccess: () => {
      // Invalidate all user queries to refetch data
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "verifyRequests"],
      });
    },
  });
};

export const useToggleUserVerification = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["dashboard", "users", "toggleVerification", id],
    mutationFn: async (userId: string) => {
      const data = await UserApis.toggleUserVerification(userId);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "User verification status updated!");
      // Invalidate all user queries to refetch data
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "verifyRequests"],
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["dashboard", "users", "delete"],
    mutationFn: async ({ _id }: { _id: string }) => {
      const data = await UserApis.deleteUser(_id);
      return data.data || {};
    },
    onSuccess: () => {
      // Refetch users list
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "verifyRequests"],
      });

      // Refetch dashboard stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.stats(),
      });
    },
  });
};
