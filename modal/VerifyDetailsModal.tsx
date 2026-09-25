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
import {
  useToggleUserVerification,
  useDeleteUser,
} from "@/lib/query/hooks/dashboard/users";
import { toast } from "react-toastify";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ExternalLink,
  Building2,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  Trash2,
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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // In-modal confirmation state to ensure 100% reliable clicks without dialog focus-trap issues
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "revoke" | "delete";
    title: string;
    message: string;
    confirmText: string;
    confirmVariant: "emerald" | "red";
  } | null>(null);

  const { mutate: toggleVerification, isPending: isToggling } =
    useToggleUserVerification(user?._id);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const isVerified = Boolean(user?.isAccountVerified);

  // Document URLs
  const hasNidFront = Boolean(user?.nidFront && user.nidFront.trim() !== "");
  const hasNidBack = Boolean(user?.nidBack && user.nidBack.trim() !== "");
  const nidFrontUrl = hasNidFront ? getImageUrl(user.nidFront) : "";
  const nidBackUrl = hasNidBack ? getImageUrl(user.nidBack) : "";
  const profileUrl = user?.profile ? getImageUrl(user.profile) : "";

  // Helper formatters
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return null;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateAge = (dateString?: string | Date) => {
    if (!dateString) return null;
    const birth = new Date(dateString);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? age : null;
  };

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => {
      setCopiedField((prev) => (prev === fieldName ? null : prev));
    }, 2000);
  };

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
        message: `Are you sure you want to approve and mark ${
          user?.name || "this user"
        } as verified?`,
        confirmText: "Yes, Approve",
        confirmVariant: "emerald",
      });
    }
  };

  const handleRequestDelete = () => {
    if (!user?._id) return;
    setConfirmAction({
      type: "delete",
      title: "Delete Account?",
      message: `Are you sure you want to permanently delete ${
        user?.name || "this user"
      }? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      confirmVariant: "red",
    });
  };

  const handleExecuteConfirm = () => {
    if (!confirmAction || !user?._id) return;

    if (confirmAction.type === "approve" || confirmAction.type === "revoke") {
      toggleVerification(user._id, {
        onSuccess: () => {
          setConfirmAction(null);
          setOpen(false);
        },
        onError: () => {
          setConfirmAction(null);
        },
      });
    } else if (confirmAction.type === "delete") {
      deleteUser(
        { _id: user._id },
        {
          onSuccess: () => {
            setConfirmAction(null);
            setOpen(false);
            toast.success("User account deleted successfully");
          },
          onError: () => {
            setConfirmAction(null);
          },
        }
      );
    }
  };

  const dobFormatted = formatDate(user?.dateOfBirth);
  const age = calculateAge(user?.dateOfBirth);
  const companiesHouseUrl = user?.companyNumber
    ? `https://find-and-update.company-information.service.gov.uk/company/${encodeURIComponent(
        user.companyNumber.trim()
      )}`
    : "";

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-4xl lg:max-w-5xl w-full max-h-[90vh] p-0 flex flex-col overflow-hidden bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl cursor-default">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4 min-w-0">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-xs">
                  {profileUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profileUrl}
                      alt={user?.name || "User Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User className="w-7 h-7" />
                    </div>
                  )}
                </div>
                {/* Verified indicator dot on avatar */}
                <span
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                    isVerified ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  title={isVerified ? "Account Verified" : "Verification Pending"}
                />
              </div>

              {/* Header Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <DialogTitle className="text-xl font-bold text-slate-900 truncate">
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

                <DialogDescription className="text-xs text-slate-500 flex items-center gap-3 mt-1 flex-wrap">
                  <span className="font-mono text-slate-600 flex items-center gap-1">
                    ID: {user?._id?.slice(-8) || "N/A"}
                    <button
                      onClick={() => handleCopy(user?._id || "", "User ID")}
                      className="hover:text-slate-900 transition-colors p-0.5 cursor-pointer"
                      title="Copy full User ID"
                    >
                      {copiedField === "User ID" ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </span>
                  {user?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {user.email}
                    </span>
                  )}
                  {user?.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Joined: {formatDate(user.createdAt)}
                    </span>
                  )}
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {/* Status Alert Banner */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                isVerified
                  ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                  : "bg-amber-50/80 border-amber-200 text-amber-900"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isVerified ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div className="flex-1 text-sm">
                <div className="font-semibold text-slate-900">
                  {isVerified
                    ? "Account is Officially Verified"
                    : "Identity Verification Request Pending Review"}
                </div>
                <p className="text-xs mt-0.5 text-slate-600 leading-relaxed">
                  {isVerified
                    ? "This account has successfully passed verification. If documentation has expired or you suspect fraudulent activity, you can revoke verification or delete the account below."
                    : "Please inspect the front and back identity documents below, cross-reference the applicant's legal details (Date of Birth, Right to Work, National Insurance, etc.), and make your review decision."}
                </p>
              </div>
            </div>

            {/* Document Inspection Section (Front & Back ID) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Official Identity Documents (Proof of ID)
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  Click any document to open in a new tab
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
                        Click image or link to view
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
                        Click image or link to view
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

            {/* Cross-Check Identity & Legal Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Card 1: Legal Identity & Right to Work */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Identity & Right-to-Work Verification
                  </h4>
                </div>

                <div className="space-y-3 text-sm">
                  {/* Full Name */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 text-xs font-medium">
                      Full Legal Name
                    </span>
                    <span className="font-semibold text-slate-900">
                      {user?.name || "N/A"}
                    </span>
                  </div>

                  {/* Date of Birth & Age */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 text-xs font-medium">
                      Date of Birth
                    </span>
                    <div className="text-right">
                      <span className="font-semibold text-slate-900">
                        {dobFormatted || "N/A"}
                      </span>
                      {age !== null && (
                        <span className="ml-2 text-xs text-slate-500">
                          ({age} years old)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nationality / British Status */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 text-xs font-medium">
                      UK Status / Nationality
                    </span>
                    <div>
                      {user?.isBritish === true ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          🇬🇧 British Citizen
                        </span>
                      ) : user?.isBritish === false ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          🌍 Non-British / International
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Not specified</span>
                      )}
                    </div>
                  </div>

                  {/* Share Code (Right to Work) */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-slate-500 text-xs font-medium">
                        Right to Work Share Code
                      </span>
                      {user?.shareCode && (
                        <a
                          href="https://www.gov.uk/check-job-applicant-right-to-work"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                        >
                          Check on GOV.UK <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {user?.shareCode ? (
                        <>
                          <code className="px-2 py-0.5 bg-slate-100 text-slate-900 rounded font-mono font-semibold text-xs border border-slate-200 tracking-wider">
                            {user.shareCode}
                          </code>
                          <button
                            onClick={() =>
                              handleCopy(user.shareCode, "Share Code")
                            }
                            className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            title="Copy Share Code"
                          >
                            {copiedField === "Share Code" ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">Not provided</span>
                      )}
                    </div>
                  </div>

                  {/* National Insurance Number */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 text-xs font-medium">
                      National Insurance (NI) No.
                    </span>
                    <div className="flex items-center gap-2">
                      {user?.insuranceNumber ? (
                        <>
                          <code className="px-2 py-0.5 bg-slate-100 text-slate-900 rounded font-mono font-semibold text-xs border border-slate-200 tracking-wider">
                            {user.insuranceNumber}
                          </code>
                          <button
                            onClick={() =>
                              handleCopy(
                                user.insuranceNumber,
                                "National Insurance Number"
                              )
                            }
                            className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            title="Copy NI Number"
                          >
                            {copiedField === "National Insurance Number" ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Contact, Location & Account Profile */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <User className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Contact & Residential Details
                  </h4>
                </div>

                <div className="space-y-3 text-sm">
                  {/* Email */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Email Address
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${user?.email}`}
                        className="text-slate-900 hover:text-blue-600 font-medium text-xs sm:text-sm"
                      >
                        {user?.email || "N/A"}
                      </a>
                      {user?.email && (
                        <button
                          onClick={() => handleCopy(user.email || "", "Email")}
                          className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedField === "Email" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Phone Number
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${user?.phone}`}
                        className="text-slate-900 hover:text-blue-600 font-medium text-xs sm:text-sm"
                      >
                        {user?.phone || "N/A"}
                      </a>
                      {user?.phone && (
                        <button
                          onClick={() => handleCopy(user.phone || "", "Phone")}
                          className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          title="Copy Phone"
                        >
                          {copiedField === "Phone" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Residential Address */}
                  <div className="flex items-start justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Address / Location
                    </span>
                    <span className="text-slate-900 text-right text-xs sm:text-sm font-medium max-w-[60%]">
                      {user?.address || "N/A"}
                    </span>
                  </div>

                  {/* Account Status */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 text-xs font-medium">
                      Account Status
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        user?.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : user?.status === "restricted"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {user?.status || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Role-Specific Details: Employer vs Worker */}
            {user?.role === "employer" ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Employer Business & Corporate Profile
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">
                      Business / Trade Name
                    </span>
                    <span className="font-semibold text-slate-900">
                      {user?.businessName || "N/A"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">
                      Employer Classification
                    </span>
                    <span className="font-semibold text-slate-900 capitalize">
                      {user?.employerType || "N/A"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        Company Number (CRN)
                      </span>
                      {companiesHouseUrl && (
                        <a
                          href={companiesHouseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-0.5"
                        >
                          Companies House <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <code className="font-mono font-semibold text-slate-900 text-sm">
                        {user?.companyNumber || "N/A"}
                      </code>
                      {user?.companyNumber && (
                        <button
                          onClick={() =>
                            handleCopy(user.companyNumber, "Company Number")
                          }
                          className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          title="Copy Company Number"
                        >
                          {copiedField === "Company Number" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">
                      Registered Business Address
                    </span>
                    <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {user?.registeredAddress || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Worker Professional Profile & Skills
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium block">
                      Trade Category
                    </span>
                    <span className="font-semibold text-slate-900 mt-1 block">
                      {user?.category || "N/A"}
                      {user?.subCategory ? ` › ${user.subCategory}` : ""}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium block">
                      Experience
                    </span>
                    <span className="font-semibold text-slate-900 mt-1 block">
                      {user?.yearsOfExperience
                        ? `${user.yearsOfExperience} Years`
                        : "N/A"}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium block">
                      Expected Rate
                    </span>
                    <span className="font-semibold text-slate-900 mt-1 block">
                      {user?.salary
                        ? `£${user.salary} / ${user.salaryType || "Hour"}`
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Core Skills */}
                {user?.coreSkills && user.coreSkills.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs text-slate-500 font-medium block mb-2">
                      Core Skills & Qualifications
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {user.coreSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* About / Overview */}
                {(user?.about || user?.workOverview) && (
                  <div className="pt-2">
                    <span className="text-xs text-slate-500 font-medium block mb-1">
                      Worker Overview / Bio
                    </span>
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                      {user.about || user.workOverview}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRequestDelete}
                disabled={isDeleting || isToggling}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Delete Account
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>

              {isVerified ? (
                <button
                  type="button"
                  onClick={handleRequestToggle}
                  disabled={isToggling}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
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
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
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
          </div>

          {/* Guaranteed working In-Modal Confirmation Overlay */}
          {confirmAction && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-150">
              <div
                className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 max-w-md w-full space-y-4 animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      confirmAction.confirmVariant === "emerald"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {confirmAction.confirmVariant === "emerald" ? (
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

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setConfirmAction(null)}
                    disabled={isToggling || isDeleting}
                    className="px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleExecuteConfirm}
                    disabled={isToggling || isDeleting}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50 ${
                      confirmAction.confirmVariant === "emerald"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {(isToggling || isDeleting) && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
