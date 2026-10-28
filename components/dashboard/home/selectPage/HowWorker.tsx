import { PAGE_SLUGS, SECTION_TYPES } from "@/types/others";
import WorkEdit from "../modal/WorkEdit";
import { useGetSection } from "@/lib/query/hooks/dashboard/pageContent";
import EmptyState from "@/components/ui/empty-state";
import { HardHat } from "lucide-react";

// Default data structure
const defaultData = [
  {
    id: 1,
    title: "Create Worker Profile",
    subTitle: "Describe Your Job – It Takes Under 1 Minute",
  },
  {
    id: 2,
    title: "Get Matched With Jobs Instantly",
    subTitle: "our ai sends it to the best local work",
  },
  {
    id: 3,
    title: "Go To Work!",
    subTitle: "your worker confirm an shows up.done.",
  },
];

export default function HowWorker() {
  const { data: section, isLoading } = useGetSection(
    SECTION_TYPES.HOW_IT_WORKS_WORKER
  );



  // Extract data from section or use default
  const headline = section?.title || "How It Works(Worker)";
  const steps = section?.content?.steps || defaultData;

  const hasData = section && section.title;

  if (isLoading) {
    return (
      <div className="bg-white py-12 px-6 md:px-16 relative min-h-[300px] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 px-6 md:px-16 relative min-h-[400px]">
      {/* Edit button - only show when data exists */}
      {hasData && (
        <div className="absolute top-4 right-4 flex items-center justify-center bg-blue-600 h-8 w-8 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
          <WorkEdit
            mode="edit"
            section={section}
            pageSlug={PAGE_SLUGS.HOME}
            sectionType={SECTION_TYPES.HOW_IT_WORKS_WORKER}
          />
        </div>
      )}

      {hasData ? (
        <>
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-700">
            {headline}
          </h2>
          <div className="grid md:grid-cols-3 gap-5 text-center">
            {steps.map((item: any, index: number) => (
              <div key={item.id || index} className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-13 h-7 2xl:w-10 2xl:h-10 flex items-center justify-center text-lg font-medium mb-4 flex-shrink-0">
                  {item.id || index + 1}
                </div>
                <div className="text-left">
                  <h3 className="text-[18px] font-semibold mb-2 text-gray-700">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 capitalize">{item.subTitle}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          variant="default"
          icon={HardHat}
          title="How It Works (Worker) Not Created Yet"
          description="The worker steps section is not configured yet. Click below to add the onboarding steps for workers."
          action={
            <WorkEdit
              mode="create"
              pageSlug={PAGE_SLUGS.HOME}
              sectionType={SECTION_TYPES.HOW_IT_WORKS_WORKER}
            />
          }
        />
      )}
    </div>
  );
}
