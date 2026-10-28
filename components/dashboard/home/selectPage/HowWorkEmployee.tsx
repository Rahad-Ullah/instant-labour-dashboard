import { PAGE_SLUGS, SECTION_TYPES } from "@/types/others";
import WorkEdit from "../modal/WorkEdit";
import { useGetSection } from "@/lib/query/hooks/dashboard/pageContent";
import EmptyState from "@/components/ui/empty-state";
import { Briefcase } from "lucide-react";

export default function HowWorkEmployee() {
  const { data: section, isLoading } = useGetSection(
    SECTION_TYPES.HOW_IT_WORKS
  );

  // Extract data from pageContent or use default
  const headline = section?.title || "How It Works(worker)";
  const steps = section?.content?.steps || [];

  // Check if section actually has data (not just an empty object)
  const hasData =
    section &&
    (section.title ||
      (section.content &&
        section.content.steps &&
        section.content.steps.length > 0));

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
            sectionType={SECTION_TYPES.HOW_IT_WORKS}
          />
        </div>
      )}

      {hasData ? (
        <>
          {/* <h2 className="text-3xl font-semibold text-center mb-12 text-gray-700">
            {headline}
          </h2> */}
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {steps.map((item: any, index: number) => (
              <div key={item.id || index} className="flex items-start gap-3">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mb-4 flex-shrink-0">
                  {item.id || index + 1}
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">
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
          icon={Briefcase}
          title="How It Works (Employer) Not Created Yet"
          description="The employer steps section is not configured yet. Click below to add the steps for hiring workers."
          action={
            <WorkEdit
              mode="create"
              pageSlug={PAGE_SLUGS.HOME}
              sectionType={SECTION_TYPES.HOW_IT_WORKS}
            />
          }
        />
      )}
    </div>
  );
}
