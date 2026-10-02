"use client";

import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Lock,
  LockOpen,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  Star,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import {
  useDeleteUser,
  useGetUserDetail,
  useUpdateUserStatus,
} from "@/lib/query/hooks/dashboard/users";
import { getImageUrl } from "@/utils/image";
import { USER_STATUS } from "@/types/users";

export default function WorkerDetails({ id }: { id: string }) {
  const router = useRouter();
  const { data: worker, isLoading, error } = useGetUserDetail(id);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateUserStatus("");

  const isBlocked = worker?.status === USER_STATUS.RESTRICTED;

  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return "Not provided";
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return String(dateInput);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return String(dateInput);
    }
  };

  const handleBlockToggle = () => {
    if (!worker?._id) return;

    const isBlocking = worker.status === USER_STATUS.ACTIVE;
    const action = isBlocking ? "block" : "unblock";

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} this worker?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocking ? "#d33" : "#3085d6",
      cancelButtonColor: isBlocking ? "#3085d6" : "#d33",
      confirmButtonText: `Yes, ${action} worker!`,
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus(worker._id, {
          onSuccess: () => {
            Swal.fire({
              title: isBlocking ? "Blocked!" : "Unblocked!",
              text: `Worker has been ${isBlocking ? "blocked" : "unblocked"} successfully.`,
              icon: "success",
            });
          },
          onError: (err: any) => {
            Swal.fire({
              title: "Error!",
              text:
                err?.response?.data?.message ||
                `Failed to ${action} worker.`,
              icon: "error",
            });
          },
        });
      }
    });
  };

  const handleDelete = () => {
    if (!worker?._id) return;

    Swal.fire({
      title: "Delete Worker?",
      text: "Are you sure you want to delete this worker? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete worker!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(
          { _id: worker._id },
          {
            onSuccess: () => {
              Swal.fire({
                title: "Deleted!",
                text: "Worker has been deleted successfully.",
                icon: "success",
              }).then(() => {
                router.push("/all-worker");
              });
            },
            onError: (err: any) => {
              Swal.fire({
                title: "Error!",
                text:
                  err?.response?.data?.message ||
                  "Failed to delete worker.",
                icon: "error",
              });
            },
          },
        );
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-36 bg-slate-200 animate-pulse rounded-lg" />
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-48 bg-slate-200 animate-pulse rounded" />
              <div className="h-4 w-64 bg-slate-200 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="space-y-6">
        <Link
          href="/all-worker"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Workers
        </Link>
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center shadow-xs">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Worker Not Found</h2>
          <p className="text-slate-600 mb-5 max-w-md mx-auto text-sm">
            Unable to load worker record. The user may have been deleted or the ID is invalid.
          </p>
          <Button
            onClick={() => router.push("/all-worker")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Worker List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-1">
        <Link
          href="/all-worker"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Workers
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Worker Details
        </h1>
      </div>

      {/* Worker Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar with Status indicator */}
          <div className="relative shrink-0">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 border-slate-200 bg-slate-100 shadow-xs overflow-hidden flex items-center justify-center">
              {worker.profile ? (
                <Image
                  src={getImageUrl(worker.profile)}
                  alt={worker.name || "Worker"}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-10 h-10 text-slate-400" />
              )}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${isBlocked ? "bg-red-500" : "bg-emerald-500"
                }`}
              title={isBlocked ? "Blocked Account" : "Active Account"}
            />
          </div>

          {/* Core Identity Details */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 truncate">
                {worker.name || "Unnamed Worker"}
              </h2>

              {/* Role Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                <Briefcase className="w-3 h-3" />
                {worker.role || "Worker"}
              </span>

              {/* Account Status Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${isBlocked
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isBlocked ? "bg-red-500" : "bg-emerald-500"
                    }`}
                />
                {isBlocked ? "Blocked" : "Active"}
              </span>

              {/* Verification Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${worker?.isAccountVerified
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
              >
                {worker?.isAccountVerified ? (
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
            </div>

            {/* Quick Metadata Line */}
            <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1 font-mono">
                <span className="text-slate-400">ID:</span> {worker._id}
              </span>
              {worker.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Registered {formatDate(worker.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Information Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Contact Details */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-600" />
              Contact Information
            </h3>
          </div>

          <div className="p-5 divide-y divide-slate-100 text-sm">
            <div className="grid grid-cols-3 py-2.5 first:pt-0">
              <span className="text-slate-500">Full Name</span>
              <span className="col-span-2 font-medium text-slate-900">
                {worker.name || "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 py-2.5">
              <span className="text-slate-500">Email Address</span>
              <div className="col-span-2 font-medium text-slate-900 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {worker.email ? (
                  <a
                    href={`mailto:${worker.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {worker.email}
                  </a>
                ) : (
                  <span className="text-slate-400">Not provided</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 py-2.5">
              <span className="text-slate-500">Contact Number</span>
              <div className="col-span-2 font-medium text-slate-900 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {worker.phone ? (
                  <a
                    href={`tel:${worker.phone}`}
                    className="text-slate-900 hover:text-blue-600"
                  >
                    {worker.phone}
                  </a>
                ) : (
                  <span className="text-slate-400">Not provided</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 py-2.5">
              <span className="text-slate-500">Address / Location</span>
              <div className="col-span-2 font-medium text-slate-900 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>{worker.address || "Not provided"}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 py-2.5">
              <span className="text-slate-500">Account Status</span>
              <span className="col-span-2">
                <Badge
                  variant="outline"
                  className={
                    isBlocked
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }
                >
                  {isBlocked ? "Restricted / Blocked" : "Active"}
                </Badge>
              </span>
            </div>

            <div className="grid grid-cols-3 py-2.5">
              <span className="text-slate-500">Verification Status</span>
              <span className="col-span-2">
                <Badge
                  variant="outline"
                  className={
                    worker?.isAccountVerified
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }
                >
                  {worker?.isAccountVerified ? "Verified" : "Not Verified"}
                </Badge>
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Work & Qualifications */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Work & Job Details
            </h3>
          </div>

          <div className="p-5 divide-y divide-slate-100 text-sm">
            <div className="grid grid-cols-3 py-2.5 first:pt-0">
              <span className="text-slate-500">Category</span>
              <span className="col-span-2 font-medium text-slate-900">
                {worker.category || "Not assigned"}
              </span>
            </div>

            <div className="grid grid-cols-3 py-2.5">
              <span className="text-slate-500">Sub-Category</span>
              <span className="col-span-2 font-medium text-slate-900">
                {worker.subCategory || "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 py-2.5">
              <span className="text-slate-500">Experience</span>
              <span className="col-span-2 font-medium text-slate-900">
                {worker.yearsOfExperience !== undefined &&
                  worker.yearsOfExperience !== null
                  ? `${worker.yearsOfExperience} ${worker.yearsOfExperience === 1 ? "year" : "years"
                  }`
                  : "Not specified"}
              </span>
            </div>

            <div className="grid grid-cols-3 py-2.5">
              <span className="text-slate-500">Rate / Salary</span>
              <div className="col-span-2 font-medium text-slate-900 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                {worker.salary !== undefined && worker.salary !== null ? (
                  <span>
                    ${worker.salary}{" "}
                    <span className="text-xs text-slate-500">
                      ({worker.salaryType || "Hourly"})
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-400">Not specified</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 py-2.5">
              <span className="text-slate-500">Availability</span>
              <div className="col-span-2 flex flex-wrap gap-1.5">
                {worker.availability && worker.availability.length > 0 ? (
                  worker.availability.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                    >
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">Not specified</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 py-2.5">
              <span className="text-slate-500">Rating</span>
              <div className="col-span-2 font-medium text-slate-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>
                  {worker.rating !== undefined ? worker.rating.toFixed(1) : "0.0"}
                </span>
                <span className="text-xs text-slate-500 font-normal">
                  ({worker.totalReview || 0} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Work Overview & Skills (if available) */}
      {(worker.workOverview || (worker.coreSkills && worker.coreSkills.length > 0)) && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          {worker.workOverview && (
            <div className="space-y-1.5">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                Work Overview
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                {worker.workOverview}
              </p>
            </div>
          )}

          {worker.coreSkills && worker.coreSkills.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Core Skills
              </span>
              <div className="flex flex-wrap gap-2">
                {worker.coreSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recorded Work History (if present) */}
      {worker.workExperiences && worker.workExperiences.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-600" />
              Work History ({worker.workExperiences.length})
            </h3>
          </div>

          <div className="p-5 space-y-3">
            {worker.workExperiences.map((exp, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-slate-50/80 border border-slate-200/70 space-y-1.5 text-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="font-semibold text-slate-900">{exp.title}</div>
                  {(exp.startDate || exp.endDate) && (
                    <span className="text-xs text-slate-500 font-medium">
                      {exp.startDate ? formatDate(exp.startDate) : "Start"} —{" "}
                      {exp.endDate ? formatDate(exp.endDate) : "Present"}
                    </span>
                  )}
                </div>

                {exp.company && (
                  <div className="text-xs text-slate-600 font-medium flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {exp.company}
                  </div>
                )}

                {exp.description && (
                  <p className="text-xs text-slate-600 pt-0.5 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Action Section */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-xs border border-slate-200 rounded-xl p-5 gap-4">
        <div>
          <h4 className="font-semibold text-slate-900 text-sm">
            Admin Account Actions
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            If you feel the user is fake in any way, you can block or delete the user from here.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className={`${isBlocked
              ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
              : "bg-[#0057DC] hover:bg-blue-700 text-white border-transparent"
              }`}
            onClick={handleBlockToggle}
            disabled={isUpdating || isDeleting}
          >
            {isUpdating ? (
              "Processing..."
            ) : isBlocked ? (
              <>
                <LockOpen className="w-4 h-4 mr-1.5" />
                Unblock
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-1.5" />
                Block
              </>
            )}
          </Button>

          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDelete}
            disabled={isUpdating || isDeleting}
          >
            {isDeleting ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </>
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}
