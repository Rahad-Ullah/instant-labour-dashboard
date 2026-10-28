import { api } from "@/lib/api";
import { ICoupon, IPackage } from "@/types/others";

const createPackage = async (data: IPackage) => {
  const res = await api.post(`/package`, data);
  return res.data;
};

const getPackages = async () => {
  const res = await api.get(`/package`);
  return res.data;
};

const updatePackage = async (id: string, data: IPackage) => {
  const res = await api.patch(`/package/${id}`, data);
  return res.data;
};

const togglePackageStatus = async (id: string) => {
  const res = await api.patch(`/package/toggle/${id}`);
  return res.data;
};

const applyGlobalCuopon = async (data: ICoupon) => {
  const res = await api.post(`/package/apply-discount`, data);
  return res.data;
}

const getGlobalCoupon = async () => {
  const res = await api.get(`/package/coupon`);
  return res.data;
}

const deletePackage = async (id: string) => {
  const res = await api.delete(`/package/${id}`);
  return res.data;
};

const deleteGlobalCoupon = async ({ id }: { id: string }) => {
  const res = await api.delete(`/package/coupon/${id}`);
  return res.data;
}

export const PackageApi = {
  createPackage,
  getPackages,
  updatePackage,
  deletePackage,
  togglePackageStatus,
  applyGlobalCuopon,
  getGlobalCoupon,
  deleteGlobalCoupon,
};
