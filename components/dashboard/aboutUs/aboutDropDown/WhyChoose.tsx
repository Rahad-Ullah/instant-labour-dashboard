import React from "react";
import Image from "next/image";
import AboutUsEdit from "../AboutUsEdit";
import { Edit, Plus } from "lucide-react";
import { useGetSection } from "@/lib/query/hooks/dashboard/pageContent";
import { SECTION_TYPES } from "@/types/others";
import { getImageUrl } from "@/utils/image";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { CheckCircle2 } from "lucide-react";

export default function WhyChoose() {
  const { data: section, isLoading } = useGetSection(SECTION_TYPES.ABOUT_WHY_US);

  const { title, description, images = [], content } = section || {};
  const hasData = Boolean(title && description);

  if (isLoading) {
    return (
      <section className="relative p-4 bg-white rounded-lg shadow-md min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </section>
    );
  }

  return (
    <section className="relative p-4 bg-white rounded-lg shadow-md min-h-[400px]">
      {/* Action button - Only show when there's data */}
      {hasData && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center justify-center bg-blue-600 h-8 w-8 text-white rounded-full cursor-pointer">
            <AboutUsEdit
              trigger={<Edit className="w-4 h-4 cursor-pointer" />}
              mode="edit"
              section={section}
              sectionType={SECTION_TYPES.ABOUT_WHY_US}
            />
          </div>
        </div>
      )}

      {hasData ? (
        <div className="grid grid-cols-[auto_55%] gap-14">
          {/* Image Section */}
          <div className="md:flex-shrink-0">
            <div>
              {images[0] && (
                <Image
                  src={getImageUrl(images[0])}
                  alt={title || "Why choose us"}
                  width={500}
                  height={500}
                  className="object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Content Section */}
          <div>
            <h1 className="font-semibold text-3xl 2xl:text-4xl my-3 leading-10 2xl:leading-16">
              {title}
            </h1>
            <p className="text-[#545454] mt-6">{description}</p>
          </div>
        </div>
      ) : (
        <EmptyState
          variant="default"
          icon={CheckCircle2}
          title="Why Choose Section Not Created Yet"
          description="The reasons to choose Instant Labour section is currently empty. Click below to add key benefits and value propositions."
          action={
            <AboutUsEdit
              trigger={
                <Button className="gap-2 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Create Why Choose Section
                </Button>
              }
              mode="create"
              section={section}
              sectionType={SECTION_TYPES.ABOUT_WHY_US}
            />
          }
        />
      )}
    </section>
  );
}
