"use client";
import Image from "next/image";
import { Edit, Plus, Mail } from "lucide-react";

import { SECTION_TYPES } from "@/types/others";
import ContactEdit from "./ContactEdit";
import { useGetSection } from "@/lib/query/hooks/dashboard/pageContent";
import { getImageUrl } from "@/utils/image";
import EmptyState from "@/components/ui/empty-state";

export default function ContactUs() {
  const { data: section, isLoading } = useGetSection(SECTION_TYPES.CONTACT_US);
  
  const hasData =  section?.title || section?.description;

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto my-5">
        <div className="flex items-center justify-between bg-[#F6F6F6] p-4 rounded-md mb-4">
          <h2 className="text-base font-medium text-gray-800">
            Contact Us Landing Page
          </h2>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md min-h-[400px] flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto my-5">
      <div className="flex items-center justify-between bg-[#F6F6F6] p-4 rounded-md mb-4">
        <h2 className="text-base font-medium text-gray-800">
          Contact Us Landing Page
        </h2>
      </div>

      <section className="p-4 bg-white rounded-lg shadow-md min-h-[400px] relative">
        {/* Edit/Create button */}
        {hasData ? (
          <ContactEdit
            mode="edit"
            section={section}
            trigger={
              <button className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            }
          />
        ) : (
          <div className="absolute top-4 right-4">
            <ContactEdit
              mode="create"
              trigger={
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Contact Section
                </button>
              }
            />
          </div>
        )}

        {hasData ? (
          <div className="grid grid-cols-2 gap-14">
            <div>
              <h1 className="font-semibold text-3xl 2xl:text-5xl my-3 leading-10 2xl:leading-16">
                {section.title}
              </h1>
              <p className="text-[#545454] mt-6">
                {section.description}
              </p>
            </div>

            <div>
              <Image
                src={getImageUrl(section.images?.[0]) || ""}
                alt="Contact us image"
                width={400}
                height={400}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
      ) : (
        <EmptyState
          variant="default"
          icon={Mail}
          title="Contact Section Not Created Yet"
          description="The contact landing section has not been configured yet. Use the create button in the top right to set up contact information."
          action={
            <ContactEdit
              mode="create"
              trigger={
                <button className="px-4 py-2 bg-[#0057DC] hover:bg-[#0047b3] text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shadow-xs cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Create Contact Section
                </button>
              }
            />
          }
        />
      )}
      </section>
    </section>
  );
}