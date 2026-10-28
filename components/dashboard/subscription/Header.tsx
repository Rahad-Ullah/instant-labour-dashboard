import { ArrowBigLeft, Plus } from "lucide-react";
import React from "react";
import SubscriptionModal from "./SubscriptionModal";
import OfferModal from "./OfferModal";
import { ICoupon } from "@/types/others";

export default function Header({ coupon }: { coupon: ICoupon | null }) {
  return (
    <section className="mt-3 flex items-center justify-between px-10">
      <div className="flex items-center gap-2">
        <span className="bg-[#E6EEFC] p-3 rounded-full">
          <ArrowBigLeft />
        </span>
        <h1 className="text-2xl font-semibold text-[#333333]">
          Subscription Packages
        </h1>
      </div>
      <div className="flex items-center gap-5">
        <OfferModal
          trigger={
            <div className="capitalize font-semibold bg-[#FFC823] text-black rounded-md px-2 py-3 cursor-pointer flex">
              <Plus />
              promotional offer
            </div>
          }
        />

        <SubscriptionModal
          header="Add Subscriber"
          trigger={
            <div className="capitalize font-semibold bg-[#FFC823] text-black rounded-md px-2 py-3 flex cursor-pointer ">
              <Plus />
              New Package
            </div>
          }
        />
      </div>
    </section>
  );
}
