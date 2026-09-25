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
import { IUser } from "@/types/users";
import { getImageUrl } from "@/utils/image";
import { useToggleUserVerification } from "@/lib/query/hooks/dashboard/users";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Building2,
  Briefcase,
  User,
  Loader2,
  IdCard,
  AlertTriangle,
} from "lucide-react";

interface VerifyDetailsModalProps {
  trigger: React.ReactNode;
  user: IUser;
}

export default function VerifyDetailsModal({
  trigger,
  user,
}: VerifyDetailsModalProps) {
  const [open, setOpen] = useState(false);

  // In-modal confirmation state to ensure reliable clicks without dialog focus-trap issues
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "revoke";
    title: string;
    message: string;
    confirmText: string;
    confirmVariant: "blue" | "red";
  } | null>(null);

  const { mutate: toggleVerification, isPending: isToggling } =
    useToggleUserVerification(user?._id);

  const isVerified = Boolean(user?.isAccountVerified);

  // Document URLs
  const hasNidFront = Boolean(user?.nidFront && user.nidFront.trim() !== "");
  const hasNidBack = Boolean(user?.nidBack && user.nidBack.trim() !== "");
  const nidFrontUrl = hasNidFront ? getImageUrl(user.nidFront) : "";
  const nidBackUrl = hasNidBack ? getImageUrl(user.nidBack) : "";
  const profileUrl = user?.profile ? getImageUrl(user.profile) : "";

  const handleRequestToggle = () => {
    if (!user?._id) return;
    if (isVerified) {
      setConfirmAction({
        type: "revoke",
        title: "Revoke Verification?",
        message: `Are you sure you want to revoke the verified status of ${
          user?.name || "this user"
        }?`,
        confirmText: "Yes, Revoke",
        confirmVariant: "red",
      });
    } else {
      setConfirmAction({
        type: "approve",
        title: "Approve Verification?",
        message: `Are you sure you want to approve ${
          user?.name || "this user"
        }'s identity documents and mark them as verified?`,
        confirmText: "Yes, Approve",
        confirmVariant: "blue",
      });
    }
  };

  const handleExecuteConfirm = () => {
    if (!confirmAction || !user?._id) return;

    toggleVerification(user._id, {
      onSuccess: () => {
        setConfirmAction(null);
        setOpen(false);
      },
      onError: () => {
        setConfirmAction(null);
      },
    });
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-3xl lg:max-w-4xl w-full max-h-[90vh] p-0 flex flex-col overflow-hidden bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl cursor-default">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                  {profileUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profileUrl}
                      alt={user?.name || "User Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    isVerified ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  title={isVerified ? "Verified" : "Pending Review"}
                />
              </div>

              {/* Title & Badges */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <DialogTitle className="text-lg font-bold text-slate-900 truncate">
                    {user?.name || "Unnamed User"}
                  </DialogTitle>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      user?.role === "employer"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    } capitalize`}
                  >
                    {user?.role === "employer" ? (
                      <Building2 className="w-3 h-3" />
                    ) : (
                      <Briefcase className="w-3 h-3" />
                    )}
                    {user?.role || "User"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isVerified
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {isVerified ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3 h-3" />
                        Pending Review
                      </>
                    )}
                  </span>
                </div>

                <DialogDescription className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                  {user?.email && <span>{user.email}</span>}
                  {user?.phone && <span>• {user.phone}</span>}
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
            {/* Quick Cross-Reference Info Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block mb-1">
                    Full Legal Name
                  </span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {user?.name || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block mb-1">
                    Email Address
                  </span>
                  <span
                    className="font-semibold text-slate-900 text-sm truncate block"
                    title={user?.email}
                  >
                    {user?.email || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block mb-1">
                    Phone Number
                  </span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {user?.phone || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block mb-1">
                    Address / Location
                  </span>
                  <span
                    className="font-semibold text-slate-900 text-sm truncate block"
                    title={user?.address}
                  >
                    {user?.address || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Identity Documents (Front & Back NID Cards) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Identity Documents (Proof of ID)
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  Click any document to open in full size (new tab)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Front ID Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
                  <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <IdCard className="w-3.5 h-3.5 text-slate-500" />
                      ID Card - Front Side
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        hasNidFront
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {hasNidFront ? "Uploaded" : "Not Provided"}
                    </span>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-center">
                    {hasNidFront ? (
                      <a
                        href={nidFrontUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Click to open image in new tab"
                        className="relative aspect-[16/10] bg-slate-950/5 rounded-lg border border-slate-200 overflow-hidden group cursor-pointer flex items-center justify-center block"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={nidFrontUrl}
                          alt="Front ID"
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <span className="px-3 py-1.5 bg-white/95 text-slate-800 text-xs font-semibold rounded-md shadow-md flex items-center gap-1.5">
                            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                            Open in New Tab
                          </span>
                        </div>
                      </a>
                    ) : (
                      <div className="aspect-[16/10] rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-4 text-center">
                        <IdCard className="w-8 h-8 text-slate-300 mb-2" />
                        <p className="text-xs font-medium text-slate-500">
                          No front document uploaded
                        </p>
                      </div>
                    )}
                  </div>

                  {hasNidFront && (
                    <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">
                        Click preview or link
                      </span>
                      <a
                        href={nidFrontUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Open in new tab</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Back ID Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
                  <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <IdCard className="w-3.5 h-3.5 text-slate-500" />
                      ID Card - Back Side
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        hasNidBack
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {hasNidBack ? "Uploaded" : "Not Provided"}
                    </span>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-center">
                    {hasNidBack ? (
                      <a
                        href={nidBackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Click to open image in new tab"
                        className="relative aspect-[16/10] bg-slate-950/5 rounded-lg border border-slate-200 overflow-hidden group cursor-pointer flex items-center justify-center block"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={nidBackUrl}
                          alt="Back ID"
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <span className="px-3 py-1.5 bg-white/95 text-slate-800 text-xs font-semibold rounded-md shadow-md flex items-center gap-1.5">
                            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                            Open in New Tab
                          </span>
                        </div>
                      </a>
                    ) : (
                      <div className="aspect-[16/10] rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-4 text-center">
                        <IdCard className="w-8 h-8 text-slate-300 mb-2" />
                        <p className="text-xs font-medium text-slate-500">
                          No back document uploaded
                        </p>
                      </div>
                    )}
                  </div>

                  {hasNidBack && (
                    <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">
                        Click preview or link
                      </span>
                      <a
                        href={nidBackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Open in new tab</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 shadow-xs transition-colors cursor-pointer"
            >
              Close
            </button>

            {isVerified ? (
              <button
                type="button"
                onClick={handleRequestToggle}
                disabled={isToggling}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isToggling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Revoke Verification
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRequestToggle}
                disabled={isToggling}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isToggling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Approve Verification
              </button>
            )}
          </div>

          {/* Guaranteed In-Modal Confirmation Overlay */}
          {confirmAction && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-150">
              <div
                className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 max-w-md w-full space-y-4 animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      confirmAction.confirmVariant === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {confirmAction.confirmVariant === "blue" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {confirmAction.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Please confirm your decision below
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {confirmAction.message}
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setConfirmAction(null)}
                    disabled={isToggling}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleExecuteConfirm}
                    disabled={isToggling}
                    className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 ${
                      confirmAction.confirmVariant === "blue"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isToggling && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {confirmAction.confirmText}
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
