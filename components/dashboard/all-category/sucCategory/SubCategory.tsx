'use client'
import { Pencil, Layers, PlusCircle } from "lucide-react";
import CategoryHeader from "../CategoryHeader";
import { SubCategoryEdit } from "./SubCategoryEdit";
import CategoryDelete from "./CategoryDelete";
import { useGetCategories } from "@/lib/query/hooks/dashboard/category";
import EmptyState from "@/components/ui/empty-state";

export default function SubCategory({ }) {
  const { data: categories, isLoading } = useGetCategories();

  return (
    <>
      <CategoryHeader title="sub" />
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border border-slate-200 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-1/2 mb-4" />
              <div className="space-y-2">
                <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                <div className="h-3.5 bg-slate-100 rounded w-2/3" />
                <div className="h-3.5 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !categories || categories.length === 0 ? (
        <div className="p-3">
          <EmptyState
            icon={Layers}
            title="No Categories Found"
            description="There are currently no job categories or subcategories created. Add your first category to organize skills and worker roles."
            action={
              <SubCategoryEdit
                title="Add Category"
                trigger={
                  <button className="flex items-center gap-1.5 bg-[#0057DC] hover:bg-[#0047b3] text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer shadow-xs">
                    <PlusCircle className="w-4 h-4" />
                    <span>Add First Category</span>
                  </button>
                }
              />
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-3">
          {categories.map((category, index) => (
            <div key={category._id || index} className="border border-slate-200 bg-white rounded-lg p-4 shadow-2xs hover:shadow-xs transition-shadow">
              {/* Title with edit icon */}
              <div className="flex items-center justify-between border-b pb-2 mb-3">
                <h2 className="font-semibold text-base text-slate-800">{category.title}</h2>
                <div className="flex items-center justify-center gap-2">
                  <div>
                    <SubCategoryEdit
                      category={category}
                      title="Edit Category"
                      trigger={
                        <button className="text-blue-600 hover:text-blue-700 p-1 cursor-pointer">
                          <Pencil className="w-4 h-4" />
                        </button>
                      }
                    />
                  </div>

                  <div>
                    <CategoryDelete _id={category._id} />
                  </div>
                </div>
              </div>

              {/* Job list */}
              <ul className="list-disc pl-4 space-y-1 text-sm text-slate-600">
                {category.subCategories.map((job, i) => (
                  <li key={i}>{job}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
