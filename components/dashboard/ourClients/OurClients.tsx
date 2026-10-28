"use client";

import Image from "next/image";
import { EditClientSection } from "./Edit";
import { useGetClientReview } from "@/lib/query/hooks/dashboard/pageContent";
import { IClientreview, SECTION_TYPES } from "@/types/others";
import { getImageUrl } from "@/utils/image";
import EmptyState from "@/components/ui/empty-state";
import { MessageSquareQuote } from "lucide-react";

export default function OurClients() {
  const { data: clientReviews = [], isLoading } = useGetClientReview(
    SECTION_TYPES.CLIENT_SAY
  );

  console.log("clientReviews", clientReviews);

  // ✅ Correct check for array data
  const hasHeroData = clientReviews?.length > 0;

  if (isLoading) {
    return (
      <section className="relative p-4 bg-white rounded-lg shadow-md min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </section>
    );
  }

  return (
    <section className="relative my-5 p-4 bg-white text-center max-w-7xl mx-auto rounded-md">
      {hasHeroData && (
        <div className="absolute top-4 right-4">
          <EditClientSection
            mode="create"
            clientReview={{} as IClientreview}
            sectionType={SECTION_TYPES.CLIENT_SAY}
          />
        </div>
      )}
      <h2 className="text-3xl font-semibold mb-12">
        What Our Clients Say
      </h2>

      {hasHeroData ? (
        <div className="flex flex-col md:flex-row items-center gap-8 px-4">
          {clientReviews.map((t: IClientreview, index: number) => (
            <div
              key={t._id}
              className={`bg-white shadow-md rounded-lg p-6 w-full max-w-sm ${index === 1 ? "mb-32" : ""
                }`}
            >
              <div className="relative w-full h-48 mb-4 overflow-hidden">
                <Image
                  src={getImageUrl(t.image)}
                  alt={t.name}
                  fill
                  className="object-cover"
                />
              </div>

              <section className="flex justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-left">
                    {t.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-left">
                    {t.designation}
                  </p>
                </div>
                <EditClientSection
                  mode="edit"
                  clientReview={t}
                  sectionType={SECTION_TYPES.CLIENT_SAY}
                />
              </section>

              <p className="text-sm text-gray-700 mb-4">
                {t.description}
              </p>

              <div className="flex justify-center">
                {Array(t.rating)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.3 3.993a1 1 0 00.95.69h4.213c.969 0 1.371 1.24.588 1.81l-3.408 2.475a1 1 0 00-.364 1.118l1.3 3.993c.3.921-.755 1.688-1.538 1.118l-3.408-2.475a1 1 0 00-1.176 0L5.59 17.126c-.783.57-1.838-.197-1.538-1.118l1.3-3.993a1 1 0 00-.364-1.118L1.58 8.42c-.783-.57-.38-1.81.588-1.81h4.213a1 1 0 00.95-.69l1.3-3.993z" />
                    </svg>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8">
          <EmptyState
            variant="default"
            icon={MessageSquareQuote}
            title="Client Reviews Not Created Yet"
            description="No client testimonials or reviews have been published yet. Click below to add your first client review."
            action={
              <EditClientSection
                mode="create"
                clientReview={clientReviews}
                sectionType={SECTION_TYPES.CLIENT_SAY}
              />
            }
          />
        </div>
      )}
    </section>
  );
}