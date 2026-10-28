import Image from "next/image";
import React from "react";
import AboutHeroModal from "../modal/AboutHeroModal";
import { useGetSection } from "@/lib/query/hooks/dashboard/pageContent";
import { SECTION_TYPES } from "@/types/others";
import { getImageUrl } from "@/utils/image";
import EmptyState from "@/components/ui/empty-state";
import { Sparkles } from "lucide-react";

export default function AboutHeroSection() {
  const { data: section, isLoading } = useGetSection(SECTION_TYPES.ABOUT_HERO);

  const { title, description, images = [] } = section || {};
  const hasHeroData = Boolean(title && description);

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
      {hasHeroData && (
        <div className="absolute top-4 right-4">
          <AboutHeroModal mode="edit" contents={section} />
        </div>
      )}

      {hasHeroData ? (
        <div className="grid grid-cols-[auto_40%] gap-14">
          <div>
            <h1 className="font-semibold text-4xl 2xl:text-5xl my-3 leading-12 2xl:leading-16">
              {title}
            </h1>
            <p className="text-[#545454] mt-6">{description}</p>
            <button className="bg-[#FFC823] text-[#333333] rounded py-3 px-6 w-[220px] mt-6 text-xl cursor-pointer">
              Contact
            </button>
          </div>

          <div>
            <Image
              src={getImageUrl(images[0])}
              alt="About hero image"
              width={400}
              height={400}
              priority
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      ) : (
        <EmptyState
          variant="default"
          icon={Sparkles}
          title="About Hero Section Not Created Yet"
          description="The About Us hero banner is currently empty. Click below to add title, description, and images."
          action={<AboutHeroModal mode="create" contents={section} />}
        />
      )}
    </section>
  );
}
