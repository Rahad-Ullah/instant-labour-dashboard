import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../keys";
import { PackageApi } from "../../apis/package";
import { toast } from "react-toastify";
import { ICoupon, IPackage } from "@/types/others";
import { getErrorMessage } from "@/lib/api-utils";

export const useGetPackages = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.package(),
    queryFn: async () => {
      const data = await PackageApi.getPackages();
      return data.data || [];
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};


export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.dashboard.package(),
    mutationFn: async (data: IPackage) => {
      return await PackageApi.createPackage(data);
    },
    onSuccess: (res) => {
      toast.success(res.message || "Successfully created package");
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.package() });
    },
    onError: (error: any) => {
      toast.error(
        getErrorMessage(error) || error?.response?.data?.message || error?.message || "Failed to create package"
      );
    },
  });
};

export const useUpdatePackage = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.dashboard.package(),
    mutationFn: async (data: IPackage) => {
      return await PackageApi.updatePackage(id, data);
    },
    onSuccess: (res) => {
      toast.success(res.message || "Successfully updated package");
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.package() });
    },
    onError: (error: any) => {
      toast.error(
        getErrorMessage(error) || error?.response?.data?.message || error?.message || "Failed to update package"
      );
    },
  });
};

export const useTogglePackageStatus = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.dashboard.package(),
    mutationFn: async () => {
      return await PackageApi.togglePackageStatus(id);
    },
    onSuccess: (res) => {
      toast.success(res.message || "Successfully toggled package status");
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.package() });
    },
    onError: (error: any) => {
      toast.error(
        getErrorMessage(error) || error?.response?.data?.message || error?.message || "Failed to toggle package status"
      );
    },
  });
};


export const useApplyGlobalCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.dashboard.package(),
    mutationFn: async (data: ICoupon) => {
      return await PackageApi.applyGlobalCuopon(data);
    },
    onSuccess: (res) => {
      toast.success(res.message || "Successfully applied coupon");
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.package() });
      // Also invalidate coupon query to refresh the coupon data
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.coupon() });
    },
    onError: (error: any) => {
      toast.error(
        getErrorMessage(error) || error?.response?.data?.message || error?.message || "Failed to apply coupon"
      );
    },
  });
};

export const useGetGlobalCoupon = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.coupon(),
    queryFn: async () => {
      const data = await PackageApi.getGlobalCoupon();
      return data.data || [];
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useDeleteGlobalCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.dashboard.coupon(),
    mutationFn: async ({ id }: { id: string }) => {
      return await PackageApi.deleteGlobalCoupon({ id });
    },
    onSuccess: (res) => {
      toast.success(res.message || "Successfully deleted coupon");
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.coupon() });
    },
    onError: (error: any) => {
      toast.error(
        getErrorMessage(error) || error?.response?.data?.message || error?.message || "Failed to delete coupon"
      );
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.dashboard.package(),
    mutationFn: async (id: string) => {
      return await PackageApi.deletePackage(id);
    },
    onSuccess: (res) => {
      toast.success(res.message || "Successfully deleted package");
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.package() });
    },
    onError: (error: any) => {
      toast.error(
        getErrorMessage(error) || error?.response?.data?.message || error?.message || "Failed to delete package"
      );
    },
  });
};