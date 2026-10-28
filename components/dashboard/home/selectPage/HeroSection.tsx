import Image from "next/image";
import HeroSectionModal from "../modal/HeroSection";
import { getImageUrl } from "@/utils/image";
import { useGetSection } from "@/lib/query/hooks/dashboard/pageContent";
import { SECTION_TYPES } from "@/types/others";
import EmptyState from "@/components/ui/empty-state";
import { Sparkles } from "lucide-react";

export default function HeroSection() {
  const { data: section, isLoading } = useGetSection(SECTION_TYPES.HERO);

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
          <HeroSectionModal mode="edit" contents={section} />
        </div>
      )}

      {hasHeroData ? (
        <div className="grid grid-cols-[auto_30%] gap-14">
          <div>
            <h1 className="font-semibold text-3xl 2xl:text-5xl my-3 leading-12 2xl:leading-16">
              {title}
            </h1>
            <p className="text-[#545454] mt-6 capitalize">{description}</p>
          </div>

          <div>
            <Image
              src={getImageUrl(images[0])}
              alt="Hero image"
              width={300}
              height={300}
              priority
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      ) : (
        <EmptyState
          variant="default"
          icon={Sparkles}
          title="Hero Section Not Created Yet"
          description="The main landing page hero section is currently empty. Click below to add title, description, and hero banner images."
          action={<HeroSectionModal mode="create" contents={section} />}
        />
      )}
    </section>
  );
}
