import { Check, Edit, ShieldCheck } from "lucide-react";
import React from "react";
import LabourModal from "../modal/Labour";
import { useGetSection } from "@/lib/query/hooks/dashboard/pageContent";
import { SECTION_TYPES } from "@/types/others";
import EmptyState from "@/components/ui/empty-state";

// Default texts
const defaultTexts = [
  "Same-Day Labour No Phone Calls,",
  " Skilled professionals you can trust.",
  "AI Matching – We Find The Best Fit Instantly",
  "post in less than 1 min.",
  "all workers verified.",
  "We're Here Whenever You Need Us.",
];

export default function Labour() {
  
  const { data: section, isLoading } = useGetSection(SECTION_TYPES.WHY_US);

  // Extract data from section or use defaults
  const headline = section?.title || "Why Instant Labour?";
  const texts = section?.content?.texts || defaultTexts;

  const hasData = section && (section.title || section.content?.texts);

  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-md min-h-[300px] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-md min-h-[400px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl 2xl:text-5xl font-semibold text-[#333333]">
            {headline}
          </h2>
        </div>

        {/* Edit button - only show when data exists */}
        {hasData && (
          <div className="flex items-center justify-center bg-blue-600 h-8 w-8 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
            <LabourModal
              mode="edit"
              content={section}
            />
          </div>
        )}
      </div>

      {hasData ? (
        <div className="text-gray-700 my-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {texts.map((text: string, index: number) => (
              <div className="flex items-start gap-2" key={index}>
                <span className="bg-teal-600 w-7 h-7 text-xl rounded-full p-1 text-white flex justify-center items-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </span>
                <p className="text-lg md:text-xl capitalize">
                  {typeof text === "string" ? text : "Text item"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          variant="default"
          icon={ShieldCheck}
          title="Why Instant Labour Not Created Yet"
          description="The key advantages and features section is not configured yet. Click below to add your bullet points."
          action={
            <LabourModal
              mode="create"
              content={section}
            />
          }
        />
      )}
    </div>
  );
}
