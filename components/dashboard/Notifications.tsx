"use client";
import { useGetFaq } from "@/lib/query/hooks/dashboard/public";
import { BellIcon, BellOff } from "lucide-react";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EmptyState from "@/components/ui/empty-state";

export default function Notifications() {
  const { data: faqData, isLoading } = useGetFaq();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-lg p-4 shadow-xs animate-pulse flex items-center justify-between">
            <div className="flex items-center gap-4 w-full">
              <div className="w-9 h-9 bg-slate-200 rounded-md" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
            </div>
            <div className="w-5 h-5 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!faqData || faqData.length === 0) {
    return (
      <EmptyState
        icon={BellOff}
        title="No Notifications"
        description="You're all caught up! There are no announcements or notifications to display at this time."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible>
        {faqData.map((item: any, index: number) => (
          <AccordionItem
            value={`item-${index}`}
            key={index}
            className="bg-white rounded-lg shadow-sm my-4 border border-slate-100"
          >
            <AccordionTrigger className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center justify-between gap-5">
                <div className="bg-blue-100 p-2 rounded-md flex items-center ">
                  <BellIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex items-start text-slate-800 font-medium">{item.question}</div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pl-18 pb-4 text-slate-600">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
