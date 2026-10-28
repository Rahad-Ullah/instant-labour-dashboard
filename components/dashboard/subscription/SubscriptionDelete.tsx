"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useDeletePackage } from "@/lib/query/hooks/dashboard/package";

interface SubscriptionDeleteProps {
  id: string;
  packageName?: string;
  className?: string;
  trigger?: React.ReactNode;
}

export default function SubscriptionDelete({
  id,
  packageName,
  className,
  trigger,
}: SubscriptionDeleteProps) {
  const deletePackage = useDeletePackage();

  const handleDelete = () => {
    Swal.fire({
      title: "Delete Subscription Package?",
      html: `
        <div style="text-align: center; font-size: 14px; color: #4B5563; line-height: 1.5;">
          <p style="margin-bottom: 12px;">Are you sure you want to delete the <strong>${packageName || "subscription"}</strong> package?</p>
          <div style="background-color: #FEF2F2; border: 1px solid #FCA5A5; padding: 12px; border-radius: 8px; color: #991B1B; font-size: 13px; text-align: left;">
            ⚠️ <strong>Notice:</strong> All active subscriptions under this package will be auto cancel at period end and will not be auto renew.
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePackage.mutateAsync(id);
        } catch (error) {
          console.error("Failed to delete package:", error);
        }
      }
    });
  };

  if (trigger) {
    return (
      <span onClick={handleDelete} className={className || "cursor-pointer"}>
        {trigger}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deletePackage.isPending}
      className={
        className ||
        "border border-[#E02121] hover:bg-red-50 text-[#E02121] px-4 py-3 rounded-md font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
      }
      title="Delete Subscription Package"
    >
      <Trash2 className="w-4 h-4" />
      <span>{deletePackage.isPending ? "Deleting..." : "Delete"}</span>
    </button>
  );
}
