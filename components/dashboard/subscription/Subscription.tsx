"use client";
import React from "react";
import SubscriptionModal from "./SubscriptionModal";
import SubscriptionDelete from "./SubscriptionDelete";
import PromotionOffer from "./PromotionOffer";
import {
  useGetGlobalCoupon,
  useGetPackages,
} from "@/lib/query/hooks/dashboard/package";
import { IPackage } from "@/types/others";
import { Package, Plus } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";

export default function Subscription() {
  const { data: packages, isLoading } = useGetPackages();
  const { data: coupon } = useGetGlobalCoupon();

  return (
    <section>
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 mt-4 px-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col animate-pulse">
              <div className="h-10 bg-slate-200 rounded-md w-full mb-4" />
              <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col h-80">
                <div className="h-16 bg-slate-100 rounded-xl mb-6" />
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                </div>
                <div className="h-10 bg-slate-200 rounded-md mt-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : !packages || packages.length === 0 ? (
        <div className="mt-6 px-6">
          <EmptyState
            icon={Package}
            title="No Subscription Packages Found"
            description="There are currently no subscription packages available. Create your first package to start offering subscription plans to employers."
            action={
              <SubscriptionModal
                header="Add Package"
                trigger={
                  <button className="inline-flex items-center gap-2 bg-[#0057DC] hover:bg-[#0047b3] text-white px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors shadow-xs">
                    <Plus className="w-4 h-4" />
                    Create First Package
                  </button>
                }
              />
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 mt-4 px-6">
          {packages.map((plan: IPackage, index: number) => (
            <div key={plan._id || index} className="flex flex-col">
              {/* header */}
              <h1 className="bg-[#B0CBF4] py-2 text-center font-bold rounded-md w-full">
                {plan.type}
              </h1>

              <div className="relative overflow-hidden rounded-2xl bg-white mt-4 w-full flex flex-col h-full">
                {/* business name & price */}
                <div className="bg-[#E6EEFC] py-6 rounded-2xl text-center">
                  <h1 className="text-xl 2xl:text-2xl font-medium">
                    {plan.type}
                  </h1>

                  <div className="flex items-center justify-center">
                    <h1 className="text-2xl 2xl:text-3xl">
                      {/* {plan.currency || ""} */}
                      <span className="font-bold">
                        £{plan.regularPrice}
                      </span>{" "}
                      <span className="text-sm ">{plan.interval}ly</span>
                    </h1>
                    {/* <p>/{plan.interval}</p> */}
                  </div>
                </div>

                {/* features */}
                <div className="pt-10 pb-4">
                  {plan.features?.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 my-2 ml-5"
                    >
                      {index !== 3 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-black" />
                      )}
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>

                {/* description */}
                <div className="px-5 pb-6 text-center">{plan.description}</div>

                {/* buttons — always bottom */}
                <div className="mt-auto flex items-center justify-center gap-3 mb-10 px-4 relative z-10">
                  <SubscriptionModal
                    packageData={plan}
                    trigger={
                      <button className="bg-[#0057DC] hover:bg-[#0047b3] px-6 rounded-md text-white font-medium py-3 cursor-pointer transition-colors">
                        Edit Now
                      </button>
                    }
                  />
                  {plan._id && (
                    <SubscriptionDelete
                      id={plan._id}
                      packageName={plan.type}
                    />
                  )}
                </div>

                {/* background decoration */}
                <div className="bg-[#B0CBF4] w-28 h-28 rotate-45 absolute -bottom-1 -left-1 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
                <div className="bg-[#B0CBF4] w-28 h-28 rotate-45 absolute -bottom-1 -right-1 translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* promotion offer */}
      <PromotionOffer coupon={coupon} />
    </section>
  );
}
