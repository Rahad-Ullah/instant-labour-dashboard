"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Edit2Icon, HelpCircle, Plus, Trash2 } from "lucide-react";
import FaqEdit from "./FaqEdit";
import Swal from "sweetalert2";
import {
  useGetFaq,
  useDeleteFaq,
} from "@/lib/query/hooks/dashboard/public";
import { IFaq } from "@/types/others";
import EmptyState from "@/components/ui/empty-state";

export function Faq() {
  const { data: faqs, isLoading } = useGetFaq();
  const { mutate: deleteFaq } = useDeleteFaq();

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this FAQ!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {

        deleteFaq(id, {
          onSuccess: () => {
            Swal.fire({
              title: "Deleted!",
              text: "Your FAQ has been deleted.",
              icon: "success",
            });
          },
          onError: (error) => {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete FAQ. Please try again.",
              icon: "error",
            });
            console.error("Delete error:", error);
          }
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-slate-100 p-4 rounded-md animate-pulse">
            <div className="h-5 bg-slate-200 rounded w-2/3 mb-2" />
            <div className="h-4 bg-slate-200/60 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!faqs || faqs.length === 0) {
    return (
      <EmptyState
        icon={HelpCircle}
        title="No FAQs Found"
        description="You have no FAQs created yet. Create frequently asked questions to help workers and employers easily navigate the platform."
        action={
          <FaqEdit
            title="Add Faq"
            trigger={
              <button className="inline-flex items-center gap-1.5 cursor-pointer bg-[#0057DC] hover:bg-[#0047b3] py-2 px-4 rounded-lg text-white font-medium text-sm transition-colors shadow-xs">
                <Plus className="w-4 h-4" />
                Add First FAQ
              </button>
            }
          />
        }
      />
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full "
      defaultValue="item-1"
    >
      {faqs.map((item: IFaq) => (
        <div className="bg-[#E6EEFC] px-4 my-3 rounded-md" key={item._id}>
          <AccordionItem value={item._id || `item-${item._id}`}>
            <AccordionTrigger className="text-md cursor-pointer">
              {item.question}
            </AccordionTrigger>

            <AccordionContent className="flex flex-col gap-4 text-balance ">
              <p>{item.answer}</p>
              <section className="flex justify-end">
                <div className="flex items-center gap-3">
                  {/* Pass the FAQ data as default values to FaqEdit */}
                  <FaqEdit
                    title="Edit Faq"
                    defaultValues={{
                      id: item._id,
                      question: item.question,
                      answer: item.answer,
                    }}
                    trigger={
                      <span className="cursor-pointer">
                        <Edit2Icon size={20} />
                      </span>
                    }
                  />
                  <span
                    className="cursor-pointer"
                    onClick={() => item._id && handleDelete(item._id)}
                  >
                    <Trash2 size={20} />
                  </span>
                </div>
              </section>
            </AccordionContent>
          </AccordionItem>
        </div>
      ))}
    </Accordion>
  );
}