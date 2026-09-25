import { api } from "@/lib/api";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { IUser, IUserFilterableFields } from "@/types/users";

const geAllUser = async (
  params = {} as IUserFilterableFields,
): Promise<
  ApiResponse<IUser[]> & { meta?: PaginatedResponse<IUser>["meta"] }
> => {
  const res = await api.get("/dashboard/users", { params });
  return res.data;
};

const getAllVerificationRequests = async (
  params = {} as IUserFilterableFields,
): Promise<
  ApiResponse<IUser[]> & { meta?: PaginatedResponse<IUser>["meta"] }
> => {
  const res = await api.get("/dashboard/users-verification", { params });
  return res.data;
};

const getUserDetail = async (id: string): Promise<ApiResponse<IUser>> => {
  const res = await api.get(`/dashboard/users/${id}`);
  return res.data;
};

const updateUserStatus = async (id: string): Promise<ApiResponse<IUser>> => {
  const res = await api.patch(`/dashboard/users/toggle/${id}`);
  return res.data;
};

const toggleUserVerification = async (
  id: string,
): Promise<ApiResponse<IUser>> => {
  const res = await api.patch(`/dashboard/users/verify/${id}`);
  return res.data;
};

const deleteUser = async (id: string): Promise<ApiResponse<IUser>> => {
  const res = await api.delete(`/user/${id}`);
  return res.data;
};

export const UserApis = {
  geAllUser,
  getAllVerificationRequests,
  getUserDetail,
  updateUserStatus,
  toggleUserVerification,
  deleteUser,
};
