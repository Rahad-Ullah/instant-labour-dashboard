"use client";
import Header from "@/components/dashboard/subscription/Header";
import Subscription from "@/components/dashboard/subscription/Subscription";
import { useGetGlobalCoupon } from "@/lib/query/hooks/dashboard/package";
import { Plus } from "lucide-react";
import React from "react";

export default function page() {
  const { data: coupon } = useGetGlobalCoupon();

  return (
    <div className="px-8 ">
      <Header coupon={coupon} />
      {/* subscription card */}
      <Subscription />
    </div>
  );
}
