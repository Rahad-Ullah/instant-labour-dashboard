"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useDeleteUser,
  useGetUserDetail,
  useUpdateUserStatus,
} from "@/lib/query/hooks/dashboard/users";
import { useGetPackages } from "@/lib/query/hooks/dashboard/package";
import { IUser, USER_STATUS } from "@/types/users";
import { IPackage } from "@/types/others";
import { getImageUrl } from "@/utils/image";
import {
  formatSubscriptionDate,
  getQuotaDisplay,
  getSubscriptionPlanName,
} from "@/utils/subscription";
import Swal from "sweetalert2";
import {
  Briefcase,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Loader2,
  Lock,
  LockOpen,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  Sparkles,
  Trash2,
  User,
  Zap,
} from "lucide-react";
import Image from "next/image";

interface EmployeDetailsProps {
  user: IUser;
  trigger: React.ReactNode;
}

export default function EmployeDetails({ user, trigger }: EmployeDetailsProps) {
  const [open, setOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fetch fresh user details when modal opens
  const { data: userDetail } = useGetUserDetail(
    open && user?._id ? user._id : ""
  );
  const currentUser = userDetail || user;

  // Fetch package plans to cross-reference package details
  const { data: packages } = useGetPackages();

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateUserStatus(
    currentUser?._id || ""
  );
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleStatusToggle = (employerId: string) => {
    if (!employerId) return;
    updateStatus(employerId);
  };

  const handleDelete = (id: string) => {
    setOpen(false); // Close dialog first

    setTimeout(() => {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this employer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteUser(
            { _id: id },
            {
              onSuccess: () => {
                Swal.fire({
                  title: "Deleted!",
                  text: "Employer has been deleted.",
                  icon: "success",
                });
              },
            }
          );
        }
      });
    }, 200);
  };

  // Subscription calculation
  const sub = currentUser?.subscription;
  const isSubActive = Boolean(sub?.isActive || sub?.status === "active");
  const planName = getSubscriptionPlanName(sub);
  const matchedPackage = packages?.find(
    (p: IPackage) =>
      p._id === sub?.packageId ||
      (planName && p.type?.toLowerCase() === planName.toLowerCase())
  );

  const hasSubscriptionData = Boolean(
    sub &&
      (isSubActive ||
        sub.packageType ||
        sub.stripeSubscriptionId ||
        sub.currentJobQuota !== undefined ||
        sub.currentBoostQuota !== undefined ||
        sub.currentBookingQuota !== undefined)
  );

  const isUserActive = currentUser?.status === USER_STATUS.ACTIVE;
  const isAccountVerified = Boolean(currentUser?.isAccountVerified);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-3xl lg:max-w-4xl w-full max-h-[90vh] p-0 flex flex-col overflow-hidden bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl cursor-default">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-xs flex items-center justify-center">
                {currentUser?.profile ? (
                  <Image
                    src={getImageUrl(currentUser.profile)}
                    alt={currentUser?.name || "Employer"}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-slate-400" />
                )}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  isUserActive ? "bg-emerald-500" : "bg-red-500"
                }`}
                title={isUserActive ? "Active Account" : "Blocked Account"}
              />
            </div>

            {/* Info and Badges */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-lg font-bold text-slate-900 truncate">
                  {currentUser?.name || "Employer Details"}
                </DialogTitle>

                {/* Role Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                  <Building2 className="w-3 h-3" />
                  Employer
                </span>

                {/* Verification Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isAccountVerified
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {isAccountVerified ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3 h-3" />
                      Not Verified
                    </>
                  )}
                </span>

                {/* Subscription Badge */}
                {isSubActive ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    {planName || "Active Plan"}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    No Subscription
                  </span>
                )}
              </div>

              <DialogDescription className="text-xs text-slate-500 flex items-center gap-3 mt-1 flex-wrap">
                {currentUser?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {currentUser.email}
                  </span>
                )}
                {currentUser?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {currentUser.phone}
                  </span>
                )}
                {currentUser?.address && (
                  <span className="flex items-center gap-1 truncate max-w-[280px]">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{currentUser.address}</span>
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {/* SUBSCRIPTION DATA SECTION */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Subscription & Quotas
                  </h3>
                  <p className="text-xs text-slate-500">
                    Current plan package, quota limits, and billing details
                  </p>
                </div>
              </div>

              {isSubActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              ) : sub?.status ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 capitalize">
                  {sub.status}
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  Free Tier
                </span>
              )}
            </div>

            <div className="p-5 space-y-5">
              {hasSubscriptionData ? (
                <>
                  {/* Plan Overview Card */}
                  <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/60 via-indigo-50/30 to-white p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                        Current Plan
                      </span>
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-lg font-bold text-slate-900">
                          {planName || (isSubActive ? "Active Plan" : "Custom Plan")}
                        </h4>
                        {matchedPackage?.regularPrice !== undefined && (
                          <span className="text-sm font-semibold text-slate-600 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                            £{matchedPackage.regularPrice}
                            {matchedPackage.interval
                              ? ` / ${matchedPackage.interval}`
                              : ""}
                          </span>
                        )}
                      </div>
                      {matchedPackage?.description && (
                        <p className="text-xs text-slate-600 max-w-md">
                          {matchedPackage.description}
                        </p>
                      )}
                    </div>

                    <div className="sm:text-right space-y-1">
                      <span className="text-xs font-medium text-slate-500 block">
                        Billing Period End
                      </span>
                      <span className="text-sm font-semibold text-slate-900 block">
                        {formatSubscriptionDate(sub?.currentPeriodEnd)}
                      </span>
                      {sub?.cancelAtPeriodEnd ? (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <Clock className="w-3 h-3" />
                          Cancels at period end
                        </span>
                      ) : isSubActive ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Auto-renews
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Quotas Grid */}
                  <div>
                    <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                      Usage & Quota Allocations
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Job Posts Quota */}
                      <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-600">
                            Job Post Quota
                          </span>
                          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                            <Briefcase className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-xl font-bold text-slate-900">
                          {getQuotaDisplay(sub?.currentJobQuota)}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {sub?.currentJobQuota === -1
                            ? "Unlimited postings"
                            : "Available job posts"}
                        </p>
                      </div>

                      {/* Worker Booking Quota */}
                      <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-600">
                            Booking Quota
                          </span>
                          <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                            <CalendarCheck className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-xl font-bold text-slate-900">
                          {getQuotaDisplay(sub?.currentBookingQuota)}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {sub?.currentBookingQuota === -1
                            ? "Unlimited bookings"
                            : "Direct worker bookings"}
                        </p>
                      </div>

                      {/* Boost Quota */}
                      <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-600">
                            Boost Quota
                          </span>
                          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                            <Zap className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-xl font-bold text-slate-900">
                          {getQuotaDisplay(sub?.currentBoostQuota)}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {sub?.currentBoostQuota === -1
                            ? "Unlimited boosts"
                            : "Job boost credits"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stripe / Billing Metadata */}
                  {(sub?.stripeSubscriptionId || sub?.stripeCustomerId) && (
                    <div className="pt-3 border-t border-slate-100">
                      <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                        Billing Reference
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {sub?.stripeSubscriptionId && (
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <span className="text-[11px] font-medium text-slate-500 block">
                                Stripe Subscription ID
                              </span>
                              <span
                                className="font-mono text-xs text-slate-800 truncate block"
                                title={sub.stripeSubscriptionId}
                              >
                                {sub.stripeSubscriptionId}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  sub.stripeSubscriptionId || "",
                                  "stripeSubId"
                                )
                              }
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors cursor-pointer shrink-0"
                              title="Copy ID"
                            >
                              {copiedKey === "stripeSubId" ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}

                        {sub?.stripeCustomerId && (
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <span className="text-[11px] font-medium text-slate-500 block">
                                Stripe Customer ID
                              </span>
                              <span
                                className="font-mono text-xs text-slate-800 truncate block"
                                title={sub.stripeCustomerId}
                              >
                                {sub.stripeCustomerId}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  sub.stripeCustomerId || "",
                                  "stripeCustId"
                                )
                              }
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors cursor-pointer shrink-0"
                              title="Copy ID"
                            >
                              {copiedKey === "stripeCustId" ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* No subscription state */
                <div className="py-6 px-4 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center">
                  <div className="p-3 bg-white text-slate-400 rounded-full border border-slate-200 shadow-2xs mb-2.5">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    No Active Subscription
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mt-1">
                    This employer is currently on the free tier without an active
                    paid subscription package.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* EMPLOYER & BUSINESS DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account & Contact */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Contact Information
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Full Name</span>
                  <span className="font-semibold text-slate-900">
                    {currentUser?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Email</span>
                  <span
                    className="font-semibold text-slate-900 truncate max-w-[200px]"
                    title={currentUser?.email}
                  >
                    {currentUser?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Phone</span>
                  <span className="font-semibold text-slate-900">
                    {currentUser?.phone || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Location</span>
                  <span
                    className="font-semibold text-slate-900 truncate max-w-[200px]"
                    title={currentUser?.address}
                  >
                    {currentUser?.address || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Account Status</span>
                  <span
                    className={`font-semibold ${
                      isUserActive ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {isUserActive ? "Active" : "Blocked"}
                  </span>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Business Credentials
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Employer Type</span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {currentUser?.employerType || "Individual / Not specified"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Business Name</span>
                  <span
                    className="font-semibold text-slate-900 truncate max-w-[200px]"
                    title={currentUser?.businessName}
                  >
                    {currentUser?.businessName || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Company Number</span>
                  <span className="font-semibold text-slate-900">
                    {currentUser?.companyNumber || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Registered Address</span>
                  <span
                    className="font-semibold text-slate-900 truncate max-w-[200px]"
                    title={currentUser?.registeredAddress}
                  >
                    {currentUser?.registeredAddress || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">ID Verification</span>
                  <span
                    className={`font-semibold ${
                      isAccountVerified ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {isAccountVerified ? "Verified" : "Pending Verification"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-500 max-w-md text-center sm:text-left">
            If you feel the employer violates platform terms or is suspicious,
            you can block or delete the account.
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => !isUpdating && handleStatusToggle(currentUser?._id)}
              disabled={isUpdating}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                isUserActive
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isUserActive ? (
                <>
                  <Lock className="w-4 h-4" />
                  Block Employer
                </>
              ) : (
                <>
                  <LockOpen className="w-4 h-4" />
                  Activate Employer
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleDelete(currentUser?._id)}
              disabled={isDeleting}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
